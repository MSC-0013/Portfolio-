/**
 * BLACKBOX-X: Deterministic Discrete-Event Simulation Engine
 * Educational Simulator (Type A)
 * 
 * Simulates virtual clock event scheduling, queue backpressure/drop-tail policies,
 * worker concurrency contention, and service degradation.
 */

// Mulberry32 deterministic pseudorandom number generator
export function createPRNG(seed: number) {
  let s = seed >>> 0;
  return function next(): number {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type OverloadPolicy = 'drop-tail' | 'backpressure';

export interface SimulationConfig {
  seed: number;
  durationSeconds: number;       // Virtual time duration (e.g. 10.0s)
  arrivalRate: number;           // Requests per second (Poisson parameter lambda)
  workerCount: number;           // Concurrent virtual workers (k)
  meanServiceTimeMs: number;     // Average processing time per request (1/mu)
  queueCapacity: number;         // Bounded queue maximum slots
  overloadPolicy: OverloadPolicy;
  failureInjection?: {
    startVirtualTime: number;
    endVirtualTime: number;
    workerCapacityMultiplier: number; // e.g. 0.2 reduces workers by 80%
  };
}

export interface SimulatedRequest {
  id: number;
  arrivalTime: number;           // in ms
  startTime?: number;            // in ms
  completionTime?: number;       // in ms
  status: 'completed' | 'dropped' | 'throttled';
  latencyMs?: number;
}

export interface MetricSnapshot {
  virtualTimeMs: number;
  queueDepth: number;
  activeWorkers: number;
  completedCount: number;
  droppedCount: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  throughputRps: number;
}

export interface SimulationResult {
  config: SimulationConfig;
  totalArrived: number;
  totalCompleted: number;
  totalDropped: number;
  totalThrottled: number;
  p50LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  averageQueueDepth: number;
  peakQueueDepth: number;
  snapshots: MetricSnapshot[];
  isDeterministic: boolean;
}

interface SimEvent {
  timeMs: number;
  type: 'ARRIVAL' | 'DEPARTURE';
  requestId: number;
}

export function runBlackboxSimulation(config: SimulationConfig): SimulationResult {
  const prng = createPRNG(config.seed);
  const totalSimMs = config.durationSeconds * 1000;

  let virtualTimeMs = 0;
  let nextRequestId = 1;

  const eventQueue: SimEvent[] = [];
  const waitingQueue: number[] = []; // Request IDs
  const requests = new Map<number, SimulatedRequest>();
  const completedLatencies: number[] = [];

  let totalArrived = 0;
  let totalDropped = 0;
  let totalThrottled = 0;

  // Insert event maintaining chronological order
  function scheduleEvent(event: SimEvent) {
    let low = 0;
    let high = eventQueue.length;
    while (low < high) {
      const mid = (low + high) >>> 1;
      if (eventQueue[mid].timeMs <= event.timeMs) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    eventQueue.splice(low, 0, event);
  }

  // Generate Poisson arrival intervals (exponential distribution)
  let arrivalTime = 0;
  while (arrivalTime < totalSimMs) {
    const u = Math.max(prng(), 0.00001);
    const intervalMs = (-Math.log(u) / config.arrivalRate) * 1000;
    arrivalTime += intervalMs;
    if (arrivalTime < totalSimMs) {
      const reqId = nextRequestId++;
      requests.set(reqId, {
        id: reqId,
        arrivalTime,
        status: 'completed',
      });
      scheduleEvent({ timeMs: arrivalTime, type: 'ARRIVAL', requestId: reqId });
      totalArrived++;
    }
  }

  let busyWorkers = 0;
  const snapshots: MetricSnapshot[] = [];
  let lastSnapshotTime = 0;
  const snapshotIntervalMs = Math.max(100, totalSimMs / 40);

  let sumQueueDepth = 0;
  let queueDepthSamples = 0;
  let peakQueueDepth = 0;

  function getEffectiveWorkers(t: number): number {
    if (
      config.failureInjection &&
      t >= config.failureInjection.startVirtualTime * 1000 &&
      t <= config.failureInjection.endVirtualTime * 1000
    ) {
      return Math.max(
        1,
        Math.floor(config.workerCount * config.failureInjection.workerCapacityMultiplier)
      );
    }
    return config.workerCount;
  }

  while (eventQueue.length > 0) {
    const event = eventQueue.shift()!;
    virtualTimeMs = event.timeMs;

    const effectiveWorkers = getEffectiveWorkers(virtualTimeMs);

    if (virtualTimeMs - lastSnapshotTime >= snapshotIntervalMs) {
      const p95 = calculatePercentile(completedLatencies, 0.95);
      const p99 = calculatePercentile(completedLatencies, 0.99);
      const throughput =
        virtualTimeMs > 0
          ? (completedLatencies.length / (virtualTimeMs / 1000))
          : 0;

      snapshots.push({
        virtualTimeMs: Math.round(virtualTimeMs),
        queueDepth: waitingQueue.length,
        activeWorkers: busyWorkers,
        completedCount: completedLatencies.length,
        droppedCount: totalDropped,
        p95LatencyMs: Math.round(p95 * 10) / 10,
        p99LatencyMs: Math.round(p99 * 10) / 10,
        throughputRps: Math.round(throughput * 10) / 10,
      });
      lastSnapshotTime = virtualTimeMs;
    }

    sumQueueDepth += waitingQueue.length;
    queueDepthSamples++;
    if (waitingQueue.length > peakQueueDepth) {
      peakQueueDepth = waitingQueue.length;
    }

    if (event.type === 'ARRIVAL') {
      const req = requests.get(event.requestId);
      if (!req) continue;

      if (busyWorkers < effectiveWorkers) {
        busyWorkers++;
        req.startTime = virtualTimeMs;
        const u = Math.max(prng(), 0.00001);
        const serviceMs = -Math.log(u) * config.meanServiceTimeMs;
        scheduleEvent({
          timeMs: virtualTimeMs + serviceMs,
          type: 'DEPARTURE',
          requestId: req.id,
        });
      } else {
        if (waitingQueue.length < config.queueCapacity) {
          waitingQueue.push(req.id);
        } else {
          if (config.overloadPolicy === 'drop-tail') {
            req.status = 'dropped';
            totalDropped++;
          } else {
            req.status = 'throttled';
            totalThrottled++;
          }
        }
      }
    } else if (event.type === 'DEPARTURE') {
      const req = requests.get(event.requestId);
      if (req && req.startTime !== undefined) {
        req.completionTime = virtualTimeMs;
        req.latencyMs = req.completionTime - req.arrivalTime;
        completedLatencies.push(req.latencyMs);
      }
      busyWorkers = Math.max(0, busyWorkers - 1);

      if (waitingQueue.length > 0 && busyWorkers < effectiveWorkers) {
        const nextReqId = waitingQueue.shift()!;
        const nextReq = requests.get(nextReqId);
        if (nextReq) {
          busyWorkers++;
          nextReq.startTime = virtualTimeMs;
          const u = Math.max(prng(), 0.00001);
          const serviceMs = -Math.log(u) * config.meanServiceTimeMs;
          scheduleEvent({
            timeMs: virtualTimeMs + serviceMs,
            type: 'DEPARTURE',
            requestId: nextReq.id,
          });
        }
      }
    }
  }

  const p50 = calculatePercentile(completedLatencies, 0.50);
  const p95 = calculatePercentile(completedLatencies, 0.95);
  const p99 = calculatePercentile(completedLatencies, 0.99);

  return {
    config,
    totalArrived,
    totalCompleted: completedLatencies.length,
    totalDropped,
    totalThrottled,
    p50LatencyMs: Math.round(p50 * 10) / 10,
    p95LatencyMs: Math.round(p95 * 10) / 10,
    p99LatencyMs: Math.round(p99 * 10) / 10,
    averageQueueDepth: queueDepthSamples > 0 ? Math.round((sumQueueDepth / queueDepthSamples) * 10) / 10 : 0,
    peakQueueDepth,
    snapshots,
    isDeterministic: true,
  };
}

function calculatePercentile(latencies: number[], percentile: number): number {
  if (latencies.length === 0) return 0;
  const sorted = [...latencies].sort((a, b) => a - b);
  const index = Math.ceil(sorted.length * percentile) - 1;
  return sorted[Math.max(0, Math.min(index, sorted.length - 1))];
}
