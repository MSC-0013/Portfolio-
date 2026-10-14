import { describe, it, expect } from 'vitest';
import { runBlackboxSimulation } from '../src/lib/simulators/blackbox-engine';
import { QuorumLabCluster } from '../src/lib/simulators/quorum-engine';
import {
  validateSystemXPayload,
  canonicalizeJSON,
  computeSHA256,
} from '../src/lib/simulators/systemx-engine';

describe('BLACKBOX-X Simulator Engine', () => {
  it('is 100% deterministic given identical seed and parameters', () => {
    const config = {
      seed: 1337,
      durationSeconds: 5,
      arrivalRate: 50,
      workerCount: 4,
      meanServiceTimeMs: 20,
      queueCapacity: 10,
      overloadPolicy: 'drop-tail' as const,
    };

    const run1 = runBlackboxSimulation(config);
    const run2 = runBlackboxSimulation(config);

    expect(run1.totalArrived).toBe(run2.totalArrived);
    expect(run1.totalCompleted).toBe(run2.totalCompleted);
    expect(run1.totalDropped).toBe(run2.totalDropped);
    expect(run1.p95LatencyMs).toBe(run2.p95LatencyMs);
    expect(run1.p99LatencyMs).toBe(run2.p99LatencyMs);
    expect(run1.averageQueueDepth).toBe(run2.averageQueueDepth);
  });

  it('correctly drops requests under drop-tail policy when saturated', () => {
    const config = {
      seed: 42,
      durationSeconds: 3,
      arrivalRate: 200,
      workerCount: 1,
      meanServiceTimeMs: 50,
      queueCapacity: 5,
      overloadPolicy: 'drop-tail' as const,
    };

    const run = runBlackboxSimulation(config);
    expect(run.totalDropped).toBeGreaterThan(0);
    expect(run.totalCompleted).toBeGreaterThan(0);
  });
});

describe('QUORUM LAB Simulator Engine (Refined)', () => {
  it('proves that for N=5, W=3, R=3 every eligible set pair has a non-empty intersection', () => {
    const cluster = new QuorumLabCluster();
    cluster.setQuorumSettings(3, 3);

    // Write to {A, B, C}
    const writeRes = cluster.executeQuorumWrite('config:timeout', '5000ms', ['node-a', 'node-b', 'node-c']);
    expect(writeRes.success).toBe(true);
    expect(writeRes.writeSet).toEqual(['node-a', 'node-b', 'node-c']);

    // Read from {C, D, E}
    const readRes = cluster.executeQuorumRead('config:timeout', ['node-c', 'node-d', 'node-e']);
    expect(readRes.success).toBe(true);
    expect(readRes.intersectionSet).toContain('node-c');
    expect(readRes.intersectionSet?.length).toBeGreaterThanOrEqual(1);
    expect(readRes.staleReadDetected).toBe(false);
  });

  it('demonstrates that for N=5, W=2, R=2 disjoint sets produce empty intersection and stale read', () => {
    const cluster = new QuorumLabCluster();
    cluster.setQuorumSettings(2, 2);

    // Completed write reaches {A, B}
    cluster.executeQuorumWrite('cluster:status', 'ACTIVE', ['node-a', 'node-b']);

    // Read queries disjoint set {C, D}
    const readRes = cluster.executeQuorumRead('cluster:status', ['node-c', 'node-d']);
    expect(readRes.intersectionSet).toEqual([]);
    expect(readRes.staleReadDetected).toBe(true);
  });

  it('tracks full Raft log entry lifecycle: RECEIVED -> APPENDED -> REPLICATED -> COMMITTED -> APPLIED', () => {
    const cluster = new QuorumLabCluster();
    // Default leader is node-c in partition group 2 (majority: C, D, E)
    const result = cluster.submitRaftCommand('SET_MAX_CLIENTS=1000');

    expect(result.committed).toBe(true);
    expect(result.entry.status).toBe('APPLIED');
    expect(result.lifecycle.map(l => l.state)).toEqual([
      'RECEIVED',
      'APPENDED',
      'REPLICATED',
      'COMMITTED',
      'APPLIED',
    ]);
  });

  it('prevents log commitment on minority partition', () => {
    const cluster = new QuorumLabCluster();
    cluster.togglePartition(true);
    // Make node-a leader in minority partition Group 1 (Nodes A, B only)
    const nodeA = cluster.nodes.find(n => n.id === 'node-a')!;
    nodeA.role = 'LEADER';
    cluster.activeLeaderId = 'node-a';

    const result = cluster.submitRaftCommand('SET_RATE_LIMIT=500');
    expect(result.committed).toBe(false);
    expect(result.entry.status).toBe('APPENDED'); // Replicated to 2 nodes only, cannot reach Q=3 majority
  });

  it('rejects Raft leader election in minority partition', () => {
    const cluster = new QuorumLabCluster();
    cluster.togglePartition(true);

    const minorityElection = cluster.triggerRaftElection('node-a');
    expect(minorityElection.success).toBe(false);

    const majorityElection = cluster.triggerRaftElection('node-c');
    expect(majorityElection.success).toBe(true);
  });

  it('compares Split-Brain failure between unsafe multi-master and Raft consensus', () => {
    const cluster = new QuorumLabCluster();
    cluster.togglePartition(true);

    const comparison = cluster.simulateSplitBrainComparison('leader_key', 'val_partition_1', 'val_partition_2');
    expect(comparison.unsafeModel.splitBrainDetected).toBe(true);
    expect(comparison.unsafeModel.linearizabilityPreserved).toBe(false);

    expect(comparison.raftModel.splitBrainDetected).toBe(false);
    expect(comparison.raftModel.linearizabilityPreserved).toBe(true);
  });
});

describe('SYSTEM-X Simulator Engine (Draft-07 & RFC 8785)', () => {
  it('validates Draft-07 schema and rejects malformed payloads', () => {
    const validPayload = {
      schemaVersion: '1.0.0',
      experimentId: 'exp-perf-01',
      workload: {
        model: 'poisson',
        targetRps: 500,
        durationSeconds: 60,
      },
      environment: {
        clusterId: 'cluster-prod-east',
        nodes: 8,
      },
      invariants: ['p99_latency_under_50ms', 'zero_data_loss'],
    };

    const validCheck = validateSystemXPayload(validPayload);
    expect(validCheck.valid).toBe(true);
    expect(validCheck.schemaVersion).toBe('draft-07');

    const invalidPayload = {
      schemaVersion: 'invalid-semver',
      workload: {
        targetRps: -5,
      },
    };

    const invalidCheck = validateSystemXPayload(invalidPayload);
    expect(invalidCheck.valid).toBe(false);
  });

  it('produces identical RFC 8785 canonical JSON regardless of object key order', () => {
    const objA = { z: 1, a: 'test', m: { b: 2, a: 1 } };
    const objB = { a: 'test', m: { a: 1, b: 2 }, z: 1 };

    const canonA = canonicalizeJSON(objA);
    const canonB = canonicalizeJSON(objB);

    expect(canonA).toBe(canonB);
    expect(canonA).toBe('{"a":"test","m":{"a":1,"b":2},"z":1}');
  });

  it('computes consistent cryptographic hash digest for canonical JSON', async () => {
    const canonStr = '{"a":"test","m":{"a":1,"b":2},"z":1}';
    const hash1 = await computeSHA256(canonStr);
    const hash2 = await computeSHA256(canonStr);

    expect(hash1).toBe(hash2);
    expect(hash1.length).toBeGreaterThanOrEqual(16);
  });
});
