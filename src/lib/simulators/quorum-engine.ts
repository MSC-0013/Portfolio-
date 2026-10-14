/**
 * QUORUM LAB: Distributed Consistency & Consensus Simulation Engine (Refined v2.1)
 * Educational Simulator (Type A)
 * 
 * Accurately models and separates:
 * 1. Quorum-based Replication:
 *    - Selection-aware Quorum (W + R > N guarantees intersection across all pairs)
 *    - Displays actual write set (S_w), read set (S_r), and set intersection (I = S_w ∩ S_r)
 * 2. Raft Consensus Lifecycle:
 *    - Node State: Follower, Candidate, Leader
 *    - Log Entry lifecycle: RECEIVED -> APPENDED -> REPLICATED -> COMMITTED -> APPLIED
 *    - Minority leader cannot commit without majority quorum Q = floor(N/2) + 1
 * 3. Split-Brain Architectural Comparison:
 *    - Unsafe multi-master vs Linearizable Raft majority commitment
 */

export interface RaftLogEntry {
  index: number;
  term: number;
  command: string;
  status: 'RECEIVED' | 'APPENDED' | 'REPLICATED' | 'COMMITTED' | 'APPLIED';
}

export interface ClusterNode {
  id: string;
  name: string;
  role: 'LEADER' | 'FOLLOWER' | 'CANDIDATE' | 'ISOLATED';
  term: number;
  alive: boolean;
  partitionGroup: 1 | 2; // 1 = Minority (A, B), 2 = Majority (C, D, E)
  store: Record<string, { value: string; version: number; term: number }>;
  votedFor: string | null;
  log: RaftLogEntry[];
  commitIndex: number;
  lastApplied: number;
}

export interface QuorumOperationResult {
  operation: 'READ' | 'WRITE' | 'ELECTION' | 'PARTITION_SPLIT_TEST';
  success: boolean;
  message: string;
  writeSet?: string[];
  readSet?: string[];
  intersectionSet?: string[];
  queriedNodes: string[];
  acknowledgedNodes: string[];
  quorumMet: boolean;
  staleReadDetected?: boolean;
  splitBrainDetected?: boolean;
  linearizabilityPreserved?: boolean;
  dataHistory?: Record<string, { value: string; version: number; status?: string }>;
}

export class QuorumLabCluster {
  public nodes: ClusterNode[];
  public N: number = 5;
  public W: number = 3;
  public R: number = 3;
  public currentTerm: number = 1;
  public activeLeaderId: string | null = 'node-c';
  public isPartitionActive: boolean = false;
  public lastWriteSet: string[] = [];

  constructor() {
    this.nodes = [
      { id: 'node-a', name: 'Node-A', role: 'FOLLOWER', term: 1, alive: true, partitionGroup: 1, store: {}, votedFor: null, log: [], commitIndex: 0, lastApplied: 0 },
      { id: 'node-b', name: 'Node-B', role: 'FOLLOWER', term: 1, alive: true, partitionGroup: 1, store: {}, votedFor: null, log: [], commitIndex: 0, lastApplied: 0 },
      { id: 'node-c', name: 'Node-C', role: 'LEADER', term: 1, alive: true, partitionGroup: 2, store: {}, votedFor: null, log: [], commitIndex: 0, lastApplied: 0 },
      { id: 'node-d', name: 'Node-D', role: 'FOLLOWER', term: 1, alive: true, partitionGroup: 2, store: {}, votedFor: null, log: [], commitIndex: 0, lastApplied: 0 },
      { id: 'node-e', name: 'Node-E', role: 'FOLLOWER', term: 1, alive: true, partitionGroup: 2, store: {}, votedFor: null, log: [], commitIndex: 0, lastApplied: 0 },
    ];
  }

  // Quorum mathematical majority threshold
  public get majorityThreshold(): number {
    return Math.floor(this.N / 2) + 1; // 3 for N=5
  }

  public setQuorumSettings(w: number, r: number) {
    this.W = Math.max(1, Math.min(this.N, w));
    this.R = Math.max(1, Math.min(this.N, r));
  }

  public togglePartition(active: boolean) {
    this.isPartitionActive = active;
    if (active) {
      const leader = this.nodes.find(n => n.id === this.activeLeaderId);
      if (leader && leader.partitionGroup === 1) {
        leader.role = 'FOLLOWER';
        this.activeLeaderId = null;
      }
    }
  }

  /**
   * Model 1: Selection-Aware Quorum Write
   */
  public executeQuorumWrite(key: string, value: string, targetNodeIds: string[]): QuorumOperationResult {
    const validTargets = this.nodes.filter(n => n.alive && targetNodeIds.includes(n.id));
    const acks: string[] = [];

    // Monotonic version calculation
    let maxVersion = 0;
    this.nodes.forEach(n => {
      if ((n.store[key]?.version || 0) > maxVersion) {
        maxVersion = n.store[key].version;
      }
    });
    const newVersion = maxVersion + 1;

    for (const node of validTargets) {
      if (acks.length < this.W) {
        node.store[key] = { value, version: newVersion, term: this.currentTerm };
        acks.push(node.id);
      }
    }

    this.lastWriteSet = [...acks];
    const quorumMet = acks.length >= this.W;
    const isOverlapping = (this.W + this.R) > this.N;

    return {
      operation: 'WRITE',
      success: quorumMet,
      message: quorumMet
        ? `Write acknowledged by Write Set {${acks.map(id => id.replace('node-', '').toUpperCase()).join(', ')}} (W=${this.W}, Version ${newVersion}). Formula: W(${this.W}) + R(${this.R}) ${isOverlapping ? '>' : '<='} N(${this.N}).`
        : `Write failed: Only ${acks.length} replicas acknowledged (W=${this.W} required).`,
      writeSet: acks,
      queriedNodes: targetNodeIds,
      acknowledgedNodes: acks,
      quorumMet,
    };
  }

  /**
   * Model 1: Selection-Aware Quorum Read
   * Calculates actual set intersection I = S_w ∩ S_r
   */
  public executeQuorumRead(key: string, targetNodeIds: string[]): QuorumOperationResult {
    const validTargets = this.nodes.filter(n => n.alive && targetNodeIds.includes(n.id));
    const readSet: string[] = [];
    const readResults: { node: string; version: number; value: string }[] = [];

    for (const node of validTargets) {
      if (readSet.length < this.R) {
        readSet.push(node.id);
        const data = node.store[key] || { value: '<uninitialized>', version: 0, term: 0 };
        readResults.push({ node: node.id, version: data.version, value: data.value });
      }
    }

    const quorumMet = readSet.length >= this.R;
    
    // Explicit mathematical intersection calculation: S_w ∩ S_r
    const intersection = this.lastWriteSet.filter(id => readSet.includes(id));

    let globalMaxVersion = 0;
    let globalLatestValue = '';
    this.nodes.forEach(n => {
      if ((n.store[key]?.version || 0) > globalMaxVersion) {
        globalMaxVersion = n.store[key].version;
        globalLatestValue = n.store[key].value;
      }
    });

    const readMax = readResults.reduce(
      (prev, cur) => (cur.version > prev.version ? cur : prev),
      { version: 0, value: '<uninitialized>', node: '' }
    );
    const staleRead = globalMaxVersion > 0 && readMax.version < globalMaxVersion;

    const intersectionNames = intersection.map(id => id.replace('node-', '').toUpperCase()).join(', ');
    const writeSetNames = this.lastWriteSet.map(id => id.replace('node-', '').toUpperCase()).join(', ');
    const readSetNames = readSet.map(id => id.replace('node-', '').toUpperCase()).join(', ');

    return {
      operation: 'READ',
      success: quorumMet,
      message: quorumMet
        ? staleRead
          ? `STALE READ: Read Set {${readSetNames}} has EMPTY INTERSECTION with Write Set {${writeSetNames}} (I = ∅). Returned v${readMax.version} ("${readMax.value}") instead of latest v${globalMaxVersion} ("${globalLatestValue}"). Reason: W(${this.W}) + R(${this.R}) = ${this.W + this.R} <= N(${this.N}) permits disjoint quorums.`
          : `CONSISTENT READ: Read Set {${readSetNames}} intersected Write Set {${writeSetNames}} on {${intersectionNames || 'overlap'}}. Returned latest version v${readMax.version} ("${readMax.value}").`
        : `Read failed: Only ${readSet.length} replicas responded (R=${this.R} required).`,
      writeSet: this.lastWriteSet,
      readSet,
      intersectionSet: intersection,
      queriedNodes: targetNodeIds,
      acknowledgedNodes: readSet,
      quorumMet,
      staleReadDetected: staleRead,
    };
  }

  /**
   * Model 2: Raft Replicated Log Lifecycle
   * Tracks: RECEIVED -> APPENDED -> REPLICATED -> COMMITTED -> APPLIED
   */
  public submitRaftCommand(command: string): {
    entry: RaftLogEntry;
    lifecycle: Array<{ state: RaftLogEntry['status']; message: string }>;
    committed: boolean;
  } {
    const leader = this.nodes.find(n => n.id === this.activeLeaderId && n.alive);
    if (!leader) {
      const entry: RaftLogEntry = { index: 0, term: this.currentTerm, command, status: 'RECEIVED' };
      return {
        entry,
        lifecycle: [{ state: 'RECEIVED', message: 'No active leader available in current cluster partition.' }],
        committed: false,
      };
    }

    const nextIndex = leader.log.length + 1;
    const entry: RaftLogEntry = {
      index: nextIndex,
      term: this.currentTerm,
      command,
      status: 'RECEIVED',
    };

    const lifecycle: Array<{ state: RaftLogEntry['status']; message: string }> = [
      { state: 'RECEIVED', message: `Leader ${leader.name} received client proposal "${command}".` },
    ];

    // 1. Leader Appends Locally
    entry.status = 'APPENDED';
    leader.log.push({ ...entry });
    lifecycle.push({
      state: 'APPENDED',
      message: `Leader ${leader.name} appended entry #${nextIndex} to its local uncommitted log.`,
    });

    // 2. Replicate to reachable peers
    const reachablePeers = this.nodes.filter(n => {
      if (!n.alive) return false;
      if (this.isPartitionActive && n.partitionGroup !== leader.partitionGroup) return false;
      return true;
    });

    reachablePeers.forEach(peer => {
      if (peer.id !== leader.id) {
        peer.log.push({ ...entry, status: 'REPLICATED' });
      }
    });

    lifecycle.push({
      state: 'REPLICATED',
      message: `Entry replicated to ${reachablePeers.length}/${this.N} nodes.`,
    });

    // 3. Majority Commitment check: Q = floor(N/2) + 1 = 3
    const isMajority = reachablePeers.length >= this.majorityThreshold;

    if (isMajority) {
      entry.status = 'COMMITTED';
      leader.commitIndex = nextIndex;
      lifecycle.push({
        state: 'COMMITTED',
        message: `Majority threshold reached (${reachablePeers.length} >= ${this.majorityThreshold}). Entry committed!`,
      });

      // 4. Apply to State Machine
      entry.status = 'APPLIED';
      leader.lastApplied = nextIndex;
      leader.store[command] = { value: 'COMMITTED_STATE', version: nextIndex, term: this.currentTerm };
      lifecycle.push({
        state: 'APPLIED',
        message: `Entry applied to leader state machine. Client receives success acknowledgment.`,
      });

      return { entry, lifecycle, committed: true };
    } else {
      lifecycle.push({
        state: 'APPENDED',
        message: `COMMIT FAILED: Replicated to only ${reachablePeers.length} nodes (Minority partition). ${this.majorityThreshold} required for Raft commitment. Entry remains uncommitted.`,
      });
      return { entry, lifecycle, committed: false };
    }
  }

  /**
   * Model 3: Raft Leader Election
   */
  public triggerRaftElection(candidateId: string): QuorumOperationResult {
    const candidate = this.nodes.find(n => n.id === candidateId && n.alive);
    if (!candidate) {
      return {
        operation: 'ELECTION',
        success: false,
        message: `Node ${candidateId} is unavailable.`,
        queriedNodes: [],
        acknowledgedNodes: [],
        quorumMet: false,
      };
    }

    this.currentTerm++;
    candidate.term = this.currentTerm;
    candidate.role = 'CANDIDATE';
    candidate.votedFor = candidate.id;

    const reachableNodes = this.nodes.filter(n => {
      if (!n.alive) return false;
      if (this.isPartitionActive && n.partitionGroup !== candidate.partitionGroup) return false;
      return true;
    });

    const votes: string[] = [candidate.id];
    for (const node of reachableNodes) {
      if (node.id !== candidate.id) {
        node.term = this.currentTerm;
        node.votedFor = candidate.id;
        votes.push(node.id);
      }
    }

    const majority = this.majorityThreshold;
    const wonElection = votes.length >= majority;

    if (wonElection) {
      candidate.role = 'LEADER';
      this.activeLeaderId = candidate.id;
      this.nodes.forEach(n => {
        if (n.id !== candidate.id && n.role === 'LEADER') {
          n.role = 'FOLLOWER';
        }
      });
    } else {
      candidate.role = 'FOLLOWER';
    }

    return {
      operation: 'ELECTION',
      success: wonElection,
      message: wonElection
        ? `Node ${candidate.name} elected LEADER for Term ${this.currentTerm} with ${votes.length}/${this.N} votes (Majority threshold ${majority} met).`
        : `Node ${candidate.name} FAILED election: Received ${votes.length} votes. Partition prevents majority (${majority} required).`,
      queriedNodes: reachableNodes.map(n => n.id),
      acknowledgedNodes: votes,
      quorumMet: wonElection,
    };
  }

  /**
   * Model 4: Split-Brain Comparison (Unsafe Multi-Master vs Raft Consensus)
   */
  public simulateSplitBrainComparison(key: string, valMinority: string, valMajority: string): {
    unsafeModel: QuorumOperationResult;
    raftModel: QuorumOperationResult;
  } {
    const unsafeData: Record<string, { value: string; version: number }> = {};
    const minorityNodes = this.nodes.filter(n => n.partitionGroup === 1);
    const majorityNodes = this.nodes.filter(n => n.partitionGroup === 2);

    minorityNodes.forEach(n => {
      n.store[key] = { value: valMinority, version: 1, term: this.currentTerm };
      unsafeData[n.name] = { value: valMinority, version: 1 };
    });
    majorityNodes.forEach(n => {
      n.store[key] = { value: valMajority, version: 1, term: this.currentTerm };
      unsafeData[n.name] = { value: valMajority, version: 1 };
    });

    const unsafeResult: QuorumOperationResult = {
      operation: 'PARTITION_SPLIT_TEST',
      success: false,
      message: `SPLIT-BRAIN CONFLICT: Unsafe multi-master accepted writes in both partitions without consensus checks. Group 1 stored "${valMinority}", Group 2 stored "${valMajority}". Reconciling requires application-level overwrite rules or CRDT merges.`,
      queriedNodes: this.nodes.map(n => n.id),
      acknowledgedNodes: this.nodes.map(n => n.id),
      quorumMet: false,
      splitBrainDetected: true,
      linearizabilityPreserved: false,
      dataHistory: unsafeData,
    };

    const raftData: Record<string, { value: string; version: number; status?: string }> = {};
    majorityNodes.forEach(n => {
      n.store[key] = { value: valMajority, version: 2, term: this.currentTerm };
      raftData[n.name] = { value: valMajority, version: 2, status: 'COMMITTED (3/3 majority)' };
    });
    minorityNodes.forEach(n => {
      raftData[n.name] = { value: 'UNCOMMITTED (Rejected: No Majority)', version: 0, status: 'REJECTED' };
    });

    const raftResult: QuorumOperationResult = {
      operation: 'PARTITION_SPLIT_TEST',
      success: true,
      message: `LINEARIZABILITY PRESERVED: Raft consensus strictly rejects uncommitted log entries on the minority partition (2/5 < 3). Majority partition (3/5 >= 3) safely commits "${valMajority}". Zero split-brain divergence.`,
      queriedNodes: this.nodes.map(n => n.id),
      acknowledgedNodes: majorityNodes.map(n => n.id),
      quorumMet: true,
      splitBrainDetected: false,
      linearizabilityPreserved: true,
      dataHistory: raftData,
    };

    return { unsafeModel: unsafeResult, raftModel: raftResult };
  }
}
