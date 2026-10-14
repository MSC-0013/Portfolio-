'use client';

import React, { useState, useMemo } from 'react';
import { QuorumLabCluster, QuorumOperationResult } from '@/lib/simulators/quorum-engine';
import { Network, Split, Vote, CheckCircle, AlertOctagon, RotateCcw } from 'lucide-react';

export default function QuorumSimulator() {
  const [activeTab, setActiveTab] = useState<'quorum' | 'split-brain' | 'election'>('quorum');
  const [w, setW] = useState(3);
  const [r, setR] = useState(3);
  const [log, setLog] = useState<string[]>([
    'QUORUM LAB initialized with N=5 nodes (Node-A to Node-E).',
    'Configured Quorum: W=3, R=3. Condition: W + R = 6 > 5 (Overlapping Quorum).',
  ]);

  const cluster = useMemo(() => new QuorumLabCluster(), []);
  const [lastOpResult, setLastOpResult] = useState<QuorumOperationResult | null>(null);
  const [splitComparison, setSplitComparison] = useState<{
    unsafeModel: QuorumOperationResult;
    raftModel: QuorumOperationResult;
  } | null>(null);

  const addLog = (msg: string) => {
    setLog(prev => [msg, ...prev.slice(0, 9)]);
  };

  const handleQuorumWrite = () => {
    cluster.setQuorumSettings(w, r);
    // Write to first W nodes
    const targetNodes = cluster.nodes.slice(0, w).map(n => n.id);
    const res = cluster.executeQuorumWrite('user:session_token', 'token_auth_9921', targetNodes);
    setLastOpResult(res);
    addLog(`[WRITE] ${res.message}`);
  };

  const handleQuorumRead = () => {
    cluster.setQuorumSettings(w, r);
    // Read from last R nodes (to test intersection)
    const targetNodes = cluster.nodes.slice(cluster.N - r, cluster.N).map(n => n.id);
    const res = cluster.executeQuorumRead('user:session_token', targetNodes);
    setLastOpResult(res);
    addLog(`[READ] ${res.message}`);
  };

  const handleRunSplitBrainTest = () => {
    cluster.togglePartition(true);
    const comparison = cluster.simulateSplitBrainComparison(
      'account_balance',
      'MINORITY_UPDATE_$500',
      'MAJORITY_UPDATE_$1200'
    );
    setSplitComparison(comparison);
    addLog('[SPLIT-BRAIN TEST] Ran side-by-side comparison between Unsafe Multi-Master and Raft Consensus under partition.');
  };

  const handleTriggerElection = (candidateId: string) => {
    const res = cluster.triggerRaftElection(candidateId);
    setLastOpResult(res);
    addLog(`[RAFT ELECTION] ${res.message}`);
  };

  const handleResetCluster = () => {
    cluster.togglePartition(false);
    cluster.nodes.forEach(n => {
      n.alive = true;
      n.store = {};
      n.role = n.id === 'node-c' ? 'LEADER' : 'FOLLOWER';
      n.term = 1;
    });
    setW(3);
    setR(3);
    setLastOpResult(null);
    setSplitComparison(null);
    setLog(['Cluster reset to baseline: N=5, Leader=Node-C, W=3, R=3.']);
  };

  const isOverlapping = (w + r) > 5;

  return (
    <div className="w-full rounded-sm border border-neutral-800 bg-[#0c0c0c] p-4 sm:p-6 text-neutral-200">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-3 border-b border-neutral-800/80 pb-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-semibold text-neutral-100 uppercase tracking-wider">
              QUORUM LAB: Consistency & Consensus Engine
            </span>
            <span className="rounded bg-neutral-800 px-2 py-0.5 font-mono text-[10px] text-neutral-300">
              Type A: Educational Simulator
            </span>
          </div>
          <p className="mt-1 font-mono text-xs text-neutral-400">
            Interactive multi-node sandbox comparing Quorum Intersection (W + R &gt; N), Raft terms, and Split-Brain partition behavior.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetCluster}
          className="inline-flex items-center space-x-1.5 self-start sm:self-auto rounded-sm border border-neutral-700 bg-neutral-900 px-3 py-1.5 font-mono text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Cluster</span>
        </button>
      </div>

      {/* Cluster Nodes Visualizer */}
      <div className="mb-6 rounded border border-neutral-800/80 bg-neutral-950 p-4">
        <div className="flex items-center justify-between mb-3 font-mono text-xs">
          <span className="text-neutral-400 uppercase tracking-wider">Active Cluster Nodes (N=5):</span>
          <span className="text-neutral-400">Majority Threshold Q = 3</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {cluster.nodes.map((node) => {
            const isPartitionGroup1 = node.partitionGroup === 1;
            return (
              <div
                key={node.id}
                className={`rounded border p-3 font-mono transition-all ${
                  node.role === 'LEADER'
                    ? 'border-neutral-200 bg-neutral-900 shadow-sm'
                    : 'border-neutral-800 bg-neutral-950/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-100">{node.name}</span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[9px] uppercase font-bold ${
                      node.role === 'LEADER'
                        ? 'bg-neutral-100 text-black'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {node.role}
                  </span>
                </div>

                <div className="mt-2 space-y-1 text-[11px] text-neutral-400">
                  <div>Term: 0x{node.term.toString().padStart(2, '0')}</div>
                  <div className="flex items-center space-x-1">
                    <span>Partition:</span>
                    <span className={isPartitionGroup1 ? 'text-amber-400 font-medium' : 'text-emerald-400 font-medium'}>
                      Group {node.partitionGroup} {isPartitionGroup1 ? '(Minority 2)' : '(Majority 3)'}
                    </span>
                  </div>
                  <div className="truncate text-[10px] text-neutral-400">
                    Store: {Object.keys(node.store).length} keys
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex space-x-2 border-b border-neutral-800 mb-6 font-mono text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('quorum')}
          className={`flex items-center space-x-1.5 border-b-2 px-3 py-2 transition-colors ${
            activeTab === 'quorum'
              ? 'border-neutral-100 text-neutral-100 font-semibold'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Network className="h-3.5 w-3.5" />
          <span>01. Quorum Intersection (W + R &gt; N)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('split-brain')}
          className={`flex items-center space-x-1.5 border-b-2 px-3 py-2 transition-colors ${
            activeTab === 'split-brain'
              ? 'border-neutral-100 text-neutral-100 font-semibold'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Split className="h-3.5 w-3.5" />
          <span>02. Partition & Split-Brain Comparison</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('election')}
          className={`flex items-center space-x-1.5 border-b-2 px-3 py-2 transition-colors ${
            activeTab === 'election'
              ? 'border-neutral-100 text-neutral-100 font-semibold'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Vote className="h-3.5 w-3.5" />
          <span>03. Raft Leader Election</span>
        </button>
      </div>

      {/* Tab 1: Quorum Math Controls */}
      {activeTab === 'quorum' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded border border-neutral-800 bg-neutral-950 p-3 space-y-2 font-mono text-xs">
              <label htmlFor="write-quorum-input" className="text-neutral-400">Write Quorum (W): {w} / 5</label>
              <input
                id="write-quorum-input"
                type="range"
                min="1"
                max="5"
                value={w}
                onChange={(e) => setW(Number(e.target.value))}
                className="w-full accent-neutral-300"
              />
            </div>

            <div className="rounded border border-neutral-800 bg-neutral-950 p-3 space-y-2 font-mono text-xs">
              <label htmlFor="read-quorum-input" className="text-neutral-400">Read Quorum (R): {r} / 5</label>
              <input
                id="read-quorum-input"
                type="range"
                min="1"
                max="5"
                value={r}
                onChange={(e) => setR(Number(e.target.value))}
                className="w-full accent-neutral-300"
              />
            </div>

            <div className="rounded border border-neutral-800 bg-neutral-950 p-3 flex flex-col justify-center font-mono text-xs">
              <div className="text-neutral-400">Quorum Condition:</div>
              <div className="mt-1 flex items-center space-x-1.5 font-bold">
                <span className={isOverlapping ? 'text-emerald-400' : 'text-amber-400'}>
                  W({w}) + R({r}) = {w + r} {isOverlapping ? '> 5 (SAFE)' : '<= 5 (RISK)'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleQuorumWrite}
              className="rounded-sm bg-neutral-100 px-4 py-2 font-mono text-xs font-semibold text-black hover:bg-white"
            >
              Write Key (user:session_token)
            </button>
            <button
              type="button"
              onClick={handleQuorumRead}
              className="rounded-sm border border-neutral-700 bg-neutral-900 px-4 py-2 font-mono text-xs font-semibold text-neutral-200 hover:bg-neutral-800"
            >
              Read Key (From Disjoint Nodes)
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Split-Brain Comparison */}
      {activeTab === 'split-brain' && (
        <div className="space-y-4">
          <div className="rounded border border-neutral-800 bg-neutral-950 p-4 font-mono text-xs text-neutral-300 space-y-2">
            <div className="text-neutral-100 font-semibold">SCENARIO: 2 vs 3 NODE NETWORK PARTITION</div>
            <p className="text-neutral-400 leading-relaxed">
              A network fault partitions the cluster into <span className="text-amber-400 font-bold">Group 1 (Node-A, Node-B)</span> and <span className="text-emerald-400 font-bold">Group 2 (Node-C, Node-D, Node-E)</span>.
              Observe how naive multi-master systems silently corrupt state while Raft protects linearizability.
            </p>
            <button
              type="button"
              onClick={handleRunSplitBrainTest}
              className="mt-2 inline-flex items-center space-x-2 rounded-sm bg-neutral-100 px-4 py-2 font-mono text-xs font-semibold text-black hover:bg-white"
            >
              <Split className="h-3.5 w-3.5" />
              <span>Simulate Split-Brain Comparison</span>
            </button>
          </div>

          {splitComparison && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Unsafe Multi-Master */}
              <div className="rounded border border-red-900/60 bg-red-950/20 p-4 font-mono text-xs">
                <div className="flex items-center space-x-1.5 text-red-400 font-bold uppercase mb-2">
                  <AlertOctagon className="h-4 w-4" />
                  <span>Model A: Unsafe Multi-Master</span>
                </div>
                <p className="text-neutral-300 text-[11px] mb-3">
                  Both partitions accept writes without requiring majority agreement:
                </p>
                <div className="space-y-1.5 rounded bg-black/60 p-2.5 text-[11px]">
                  <div className="text-amber-400">Minority Group 1: stored &quot;MINORITY_UPDATE_$500&quot;</div>
                  <div className="text-emerald-400">Majority Group 2: stored &quot;MAJORITY_UPDATE_$1200&quot;</div>
                  <div className="text-red-400 font-bold mt-2">
                    RESULT: State Divergence upon heal (Write conflict & data loss).
                  </div>
                </div>
              </div>

              {/* Raft Consensus */}
              <div className="rounded border border-emerald-900/60 bg-emerald-950/20 p-4 font-mono text-xs">
                <div className="flex items-center space-x-1.5 text-emerald-400 font-bold uppercase mb-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Model B: Raft Linearizable Consensus</span>
                </div>
                <p className="text-neutral-300 text-[11px] mb-3">
                  Enforces strict majority threshold Q = floor(5/2) + 1 = 3:
                </p>
                <div className="space-y-1.5 rounded bg-black/60 p-2.5 text-[11px]">
                  <div className="text-amber-400">Minority Group 1: REJECTED (2/5 &lt; 3)</div>
                  <div className="text-emerald-400">Majority Group 2: COMMITTED (3/5 &gt;= 3)</div>
                  <div className="text-emerald-400 font-bold mt-2">
                    RESULT: Zero Split-Brain Divergence (Linearizability Preserved).
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Raft Election */}
      {activeTab === 'election' && (
        <div className="space-y-4 font-mono text-xs">
          <div className="rounded border border-neutral-800 bg-neutral-950 p-4 space-y-2">
            <div className="text-neutral-100 font-semibold">RAFT TERM ELECTION CONTROLS</div>
            <p className="text-neutral-400">
              Trigger a leader election on any node to test term increment and majority vote collection.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {cluster.nodes.map((node) => (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => handleTriggerElection(node.id)}
                  className="rounded border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-neutral-200 hover:bg-neutral-800"
                >
                  Elect {node.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Live Cluster Event Log */}
      <div className="mt-6 rounded border border-neutral-800 bg-neutral-950 p-3 font-mono text-xs">
        <div className="text-neutral-400 uppercase tracking-wider mb-2">Live Cluster Event Stream:</div>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {log.map((entry, idx) => (
            <div key={idx} className="text-[11px] text-neutral-300">
              <span className="text-neutral-400 mr-2">&gt;</span>
              {entry}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
