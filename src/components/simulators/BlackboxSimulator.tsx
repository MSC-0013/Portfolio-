'use client';

import React, { useState, useMemo } from 'react';
import { runBlackboxSimulation, SimulationConfig, SimulationResult } from '@/lib/simulators/blackbox-engine';
import { Play, RotateCcw, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function BlackboxSimulator() {
  const [arrivalRate, setArrivalRate] = useState(80);
  const [workerCount, setWorkerCount] = useState(4);
  const [queueCapacity, setQueueCapacity] = useState(15);
  const [overloadPolicy, setOverloadPolicy] = useState<'drop-tail' | 'backpressure'>('drop-tail');
  const [failureActive, setFailureActive] = useState(false);
  const [seed, setSeed] = useState(42);

  const config: SimulationConfig = useMemo(() => ({
    seed,
    durationSeconds: 5,
    arrivalRate,
    workerCount,
    meanServiceTimeMs: 25, // 40 req/sec per worker
    queueCapacity,
    overloadPolicy,
    failureInjection: failureActive
      ? {
          startVirtualTime: 1.5,
          endVirtualTime: 3.5,
          workerCapacityMultiplier: 0.25, // cuts workers by 75%
        }
      : undefined,
  }), [seed, arrivalRate, workerCount, queueCapacity, overloadPolicy, failureActive]);

  const [result, setResult] = useState<SimulationResult>(() => runBlackboxSimulation(config));

  const handleRun = () => {
    setResult(runBlackboxSimulation(config));
  };

  const handleReset = () => {
    setArrivalRate(80);
    setWorkerCount(4);
    setQueueCapacity(15);
    setOverloadPolicy('drop-tail');
    setFailureActive(false);
    setSeed(42);
    setResult(runBlackboxSimulation({
      seed: 42,
      durationSeconds: 5,
      arrivalRate: 80,
      workerCount: 4,
      meanServiceTimeMs: 25,
      queueCapacity: 15,
      overloadPolicy: 'drop-tail',
    }));
  };

  return (
    <div className="w-full rounded-sm border border-neutral-800 bg-[#0c0c0c] p-4 sm:p-6 text-neutral-200">
      {/* Header & Taxonomy Badge */}
      <div className="mb-6 flex flex-col justify-between gap-3 border-b border-neutral-800/80 pb-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-semibold text-neutral-100 uppercase tracking-wider">
              BLACKBOX-X Virtual Scheduler
            </span>
            <span className="rounded bg-neutral-800 px-2 py-0.5 font-mono text-[10px] text-neutral-300">
              Type A: Educational Simulator
            </span>
          </div>
          <p className="mt-1 font-mono text-xs text-neutral-400">
            Deterministic discrete-event simulator modeling Poisson arrivals, worker saturation, and queue backpressure.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center space-x-1.5 rounded-sm border border-neutral-700 bg-neutral-900 px-3 py-1.5 font-mono text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={handleRun}
            className="inline-flex items-center space-x-1.5 rounded-sm bg-neutral-100 px-4 py-1.5 font-mono text-xs font-semibold text-black hover:bg-white transition-colors"
          >
            <Play className="h-3.5 w-3.5 fill-black" />
            <span>Execute Run</span>
          </button>
        </div>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {/* Arrival Rate */}
        <div className="space-y-1.5 rounded border border-neutral-800/80 bg-neutral-950 p-3">
          <div className="flex justify-between font-mono text-xs">
            <label htmlFor="arrival-rate-input" className="text-neutral-400">Arrival Rate (λ):</label>
            <span className="text-neutral-100 font-semibold">{arrivalRate} req/s</span>
          </div>
          <input
            id="arrival-rate-input"
            type="range"
            min="20"
            max="250"
            step="10"
            value={arrivalRate}
            onChange={(e) => setArrivalRate(Number(e.target.value))}
            className="w-full accent-neutral-300"
          />
        </div>

        {/* Worker Count */}
        <div className="space-y-1.5 rounded border border-neutral-800/80 bg-neutral-950 p-3">
          <div className="flex justify-between font-mono text-xs">
            <label htmlFor="worker-pool-input" className="text-neutral-400">Virtual Workers (k):</label>
            <span className="text-neutral-100 font-semibold">{workerCount} workers</span>
          </div>
          <input
            id="worker-pool-input"
            type="range"
            min="1"
            max="12"
            value={workerCount}
            onChange={(e) => setWorkerCount(Number(e.target.value))}
            className="w-full accent-neutral-300"
          />
        </div>

        {/* Queue Buffer Capacity */}
        <div className="space-y-1.5 rounded border border-neutral-800/80 bg-neutral-950 p-3">
          <div className="flex justify-between font-mono text-xs">
            <label htmlFor="queue-buffer-input" className="text-neutral-400">Queue Buffer (Slots):</label>
            <span className="text-neutral-100 font-semibold">{queueCapacity} slots</span>
          </div>
          <input
            id="queue-buffer-input"
            type="range"
            min="5"
            max="40"
            value={queueCapacity}
            onChange={(e) => setQueueCapacity(Number(e.target.value))}
            className="w-full accent-neutral-300"
          />
        </div>

        {/* Overload Policy & Failure Injection */}
        <div className="space-y-2 rounded border border-neutral-800/80 bg-neutral-950 p-3">
          <div className="flex justify-between font-mono text-xs">
            <span className="text-neutral-400">Overload Policy:</span>
            <span className="text-neutral-200 uppercase font-semibold">{overloadPolicy}</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setOverloadPolicy(overloadPolicy === 'drop-tail' ? 'backpressure' : 'drop-tail')}
              className="flex-1 rounded border border-neutral-700 py-1 font-mono text-[11px] text-neutral-300 hover:bg-neutral-800"
            >
              Toggle Policy
            </button>
            <button
              type="button"
              onClick={() => setFailureActive(!failureActive)}
              className={`rounded border px-2 py-1 font-mono text-[11px] font-semibold transition-colors ${
                failureActive
                  ? 'border-red-500 bg-red-950/40 text-red-400'
                  : 'border-neutral-700 bg-neutral-900 text-neutral-400'
              }`}
            >
              {failureActive ? 'Failure: ON' : 'Inject Failure'}
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <div className="rounded border border-neutral-800/80 bg-neutral-950/60 p-3 font-mono">
          <div className="text-[10px] text-neutral-400 uppercase">Total Arrived</div>
          <div className="text-base font-semibold text-neutral-100">{result.totalArrived}</div>
          <div className="text-[10px] text-neutral-400">Poisson λ={arrivalRate}</div>
        </div>

        <div className="rounded border border-neutral-800/80 bg-neutral-950/60 p-3 font-mono">
          <div className="text-[10px] text-neutral-400 uppercase">Completed</div>
          <div className="text-base font-semibold text-emerald-400">{result.totalCompleted}</div>
          <div className="text-[10px] text-neutral-400">Processed</div>
        </div>

        <div className="rounded border border-neutral-800/80 bg-neutral-950/60 p-3 font-mono">
          <div className="text-[10px] text-neutral-400 uppercase">
            {overloadPolicy === 'drop-tail' ? 'Dropped' : 'Throttled'}
          </div>
          <div className={`text-base font-semibold ${result.totalDropped > 0 ? 'text-red-400' : 'text-neutral-300'}`}>
            {overloadPolicy === 'drop-tail' ? result.totalDropped : result.totalThrottled}
          </div>
          <div className="text-[10px] text-neutral-400">Buffer overflow</div>
        </div>

        <div className="rounded border border-neutral-800/80 bg-neutral-950/60 p-3 font-mono">
          <div className="text-[10px] text-neutral-400 uppercase">p95 Latency</div>
          <div className="text-base font-semibold text-neutral-100">{result.p95LatencyMs} ms</div>
          <div className="text-[10px] text-neutral-400">Calculated</div>
        </div>

        <div className="rounded border border-neutral-800/80 bg-neutral-950/60 p-3 font-mono">
          <div className="text-[10px] text-neutral-400 uppercase">p99 Latency</div>
          <div className="text-base font-semibold text-amber-400">{result.p99LatencyMs} ms</div>
          <div className="text-[10px] text-neutral-400">Tail latency</div>
        </div>

        <div className="rounded border border-neutral-800/80 bg-neutral-950/60 p-3 font-mono">
          <div className="text-[10px] text-neutral-400 uppercase">Peak Queue</div>
          <div className="text-base font-semibold text-neutral-100">{result.peakQueueDepth} / {queueCapacity}</div>
          <div className="text-[10px] text-neutral-400">Slots used</div>
        </div>
      </div>

      {/* Queue Saturation Visualization */}
      <div className="rounded border border-neutral-800 bg-neutral-950 p-4">
        <div className="flex items-center justify-between mb-3 font-mono text-xs">
          <span className="text-neutral-400">QUEUE BUFFER SATURATION MODEL:</span>
          <span className="text-neutral-400">
            Avg Depth: {result.averageQueueDepth} | Seed: {result.config.seed} (Deterministic)
          </span>
        </div>

        {/* Visual Slots representation */}
        <div className="grid grid-cols-10 sm:grid-cols-20 gap-1.5 p-2 rounded bg-neutral-900/60 border border-neutral-800/50">
          {Array.from({ length: queueCapacity }).map((_, index) => {
            const isOccupied = index < result.peakQueueDepth;
            const isNearCapacity = index >= queueCapacity * 0.8;
            return (
              <div
                key={index}
                className={`h-6 rounded-xs transition-colors flex items-center justify-center font-mono text-[9px] ${
                  isOccupied
                    ? isNearCapacity
                      ? 'bg-red-500/80 text-white font-bold'
                      : 'bg-neutral-200 text-black font-medium'
                    : 'bg-neutral-800/40 text-neutral-600'
                }`}
                title={`Slot ${index + 1}`}
              >
                {index + 1}
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex items-center justify-between font-mono text-[11px] text-neutral-400">
          <div className="flex items-center space-x-2">
            <span className="inline-block h-2.5 w-2.5 rounded-xs bg-neutral-200" />
            <span>Buffered Request</span>
            <span className="inline-block h-2.5 w-2.5 rounded-xs bg-red-500 ml-2" />
            <span>Near Saturated</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Deterministic Virtual Clock Execution</span>
          </div>
        </div>
      </div>
    </div>
  );
}
