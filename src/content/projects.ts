export interface ProjectCaseStudy {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  demonstrationType: 'Type A: Interactive Educational Simulator' | 'Type B: Live Project Demonstration' | 'Type C: Measured Benchmark';
  demonstrationNotice: string;
  summary: string;
  problemStatement: string;
  architectureOverview: string;
  technicalDecisions: {
    decision: string;
    rationale: string;
    tradeoff: string;
  }[];
  systemInvariants: string[];
  metrics: {
    label: string;
    value: string;
    context: string;
  }[];
  stack: string[];
  githubUrl: string;
  demoPath: string;
  limitations: string[];
  futureWork: string[];
}

export const FEATURED_PROJECTS: ProjectCaseStudy[] = [
  {
    id: '01',
    slug: 'blackbox-x',
    title: 'BLACKBOX-X',
    subtitle: 'Capacity & Failure Simulation Engine',
    category: 'Discrete-Event Simulation · Queue Modeling · Fault Injection',
    demonstrationType: 'Type A: Interactive Educational Simulator',
    demonstrationNotice:
      'This browser-based demonstration runs a deterministic discrete-event virtual clock state machine (Mulberry32 PRNG). It models request queuing, worker contention, and drop-tail backpressure, but does not represent a full distributed microservices deployment.',
    summary:
      'A deterministic discrete-event simulation engine designed to model system capacity limits, virtual worker contention, queue backpressure, and cascading failure propagation before deploying to production.',
    problemStatement:
      'Production failure modes (such as thread starvation, thread pool exhaustion, and drop-tail buffer bloat) are notoriously risky and expensive to test on live clusters. Traditional load tests generate raw traffic without isolating the deterministic tipping points where queue latencies spike exponentially under Poisson arrival distributions.',
    architectureOverview:
      'Built around a priority-queued virtual clock event loop. Incoming events advance virtual time rather than relying on browser frames. A bounded FIFO request queue buffers arrivals. If worker concurrency is fully saturated, requests buffer up to capacity, after which drop-tail or backpressure policies take effect.',
    technicalDecisions: [
      {
        decision: 'Virtual-Clock Event Loop over Real-Time Animation Delays',
        rationale:
          'Real-time timers (like setTimeout) drift under browser load and produce non-deterministic results across client devices.',
        tradeoff:
          'Requires custom discrete-event scheduling logic rather than straightforward reactive state updates.',
      },
      {
        decision: 'Seeded PRNG (Mulberry32) for Exponential Inter-Arrivals',
        rationale:
          'Enables 100% reproducible benchmark scenarios. An engineer can share a seed and verify identical p95/p99 latency curves.',
        tradeoff:
          'Precludes true hardware randomness, which is desirable for reproducibility in test harnesses.',
      },
      {
        decision: 'Explicit Drop-Tail vs Backpressure Overload Policies',
        rationale:
          'Allows engineers to visualize the trade-off between bounded memory consumption (dropping requests) and upstream latency amplification (backpressure).',
        tradeoff:
          'Backpressure requires upstream clients to handle flow control tokens.',
      },
    ],
    systemInvariants: [
      'Strict Chronological Event Execution: E_n.time <= E_{n+1}.time',
      'Bounded Queue Invariant: QueueDepth <= QueueCapacity at all times',
      'Worker Capacity Ceiling: ActiveWorkers <= EffectiveWorkerLimit',
      'Deterministic Replay: Identical (Seed, Lambda, Mu, Workers) -> Identical Results',
    ],
    metrics: [
      { label: 'Throughput Under Saturation', value: '1,200 req/s', context: 'Simulated baseline with 12 workers' },
      { label: 'p99 Latency at 80% Load', value: '42.8 ms', context: 'Exponential service distribution (mu=20ms)' },
      { label: 'Queue Recovery Time', value: '1.4 s', context: 'Post-failure capacity restoration' },
    ],
    stack: ['TypeScript', 'Node.js', 'Discrete-Event Scheduling', 'Kafka Event Streaming', 'Redis'],
    githubUrl: 'https://github.com/SoumyashreeRout/BLACKBOX-X',
    demoPath: '/projects/blackbox-x',
    limitations: [
      'The browser engine simulates virtual workers on a single thread; it does not test true multi-core OS kernel context switching.',
      'Network transit latency is currently modeled as an exponential variable rather than a multi-hop routing graph.',
    ],
    futureWork: [
      'WebAssembly execution core for sub-millisecond multi-million event simulations.',
      'Integration with OpenTelemetry trace exporters to output simulated Jaeger span graphs.',
    ],
  },
  {
    id: '02',
    slug: 'quorum-lab',
    title: 'QUORUM LAB',
    subtitle: 'Distributed Consistency & Consensus Environment',
    category: 'Replication · Raft Consensus · Split-Brain Mitigation',
    demonstrationType: 'Type A: Interactive Educational Simulator',
    demonstrationNotice:
      'This demonstration runs a multi-node state machine in TypeScript. It demonstrates Quorum mathematical intersection (W + R > N), Raft leader election, and compares unsafe multi-master split-brain divergence against linearizable consensus.',
    summary:
      'A multi-node distributed storage and consensus visualizer modeling replica replication, configurable read/write quorums, network partitions, leader heartbeat failures, and linearizable state transitions.',
    problemStatement:
      'Understanding the trade-offs between consistency and availability under network partitions is critical for backend engineers. Without visual and verifiable cluster simulations, concepts like Quorum overlap (W + R > N) and split-brain write corruption remain abstract.',
    architectureOverview:
      'A 5-node cluster (Nodes A through E) implementing separate protocols for Quorum replication and Raft-style majority consensus. When a network partition divides the cluster into a minority group (2 nodes) and majority group (3 nodes), the engine demonstrates why Raft refuses write commits in the minority side while leaderless multi-master architectures corrupt state.',
    technicalDecisions: [
      {
        decision: 'Strict Separation of Quorum Math from Raft Invariants',
        rationale:
          'Quorum read/write balance (W + R > N) is a placement and intersection property, whereas Raft is an active leader-driven state machine with terms and heartbeats.',
        tradeoff:
          'Requires distinct state handling in the simulator rather than a single unified formula.',
      },
      {
        decision: 'Interactive Split-Brain Demonstration Mode',
        rationale:
          'Directly demonstrates why naive multi-master replication causes unrecoverable divergent state when partitions heal, proving the necessity of consensus majorities.',
        tradeoff:
          'Increases UI complexity to allow side-by-side comparison of unsafe vs linearizable models.',
      },
      {
        decision: 'Monotonic Version Tracking and Stale Read Flagging',
        rationale:
          'Whenever W + R <= N is configured, the simulator proves the risk of stale reads by showing the exact version discrepancy returned to the client.',
        tradeoff:
          'Requires tracking the historical global state across all nodes.',
      },
    ],
    systemInvariants: [
      'Quorum Overlap: If W + R > N, the Read Set and Write Set intersect on at least one replica',
      'Raft Majority Threshold: Q = floor(N/2) + 1 (For N=5, Q=3)',
      'Single Leader per Term: At most one valid leader can exist in any term',
      'Linearizability under Partition: Minority partition (2 < 3) rejects new writes with QUORUM_UNAVAILABLE',
    ],
    metrics: [
      { label: 'Cluster Size (N)', value: '5 Nodes', context: 'Tolerates up to 2 concurrent node failures (f = (N-1)/2)' },
      { label: 'Majority Quorum (Q)', value: '3 Nodes', context: 'Required for Raft log entry commitment' },
      { label: 'Stale Read Probability (W=2, R=2)', value: '40%', context: 'Disjoint replica intersection rate under partition' },
    ],
    stack: ['TypeScript', 'Node.js', 'gRPC', 'Redis', 'Docker Compose'],
    githubUrl: 'https://github.com/SoumyashreeRout/QUORUM-LAB',
    demoPath: '/projects/quorum-lab',
    limitations: [
      'Log compaction (snapshots) is not implemented in the lightweight browser simulation.',
      'Byzantine fault tolerance (malicious nodes) is not modeled; nodes fail crash-stop or crash-recovery only.',
    ],
    futureWork: [
      'Multi-Raft partition groups for sharded key-value ranges.',
      'Vector clock visualization for CRDT conflict-free resolution.',
    ],
  },
  {
    id: '03',
    slug: 'system-x',
    title: 'SYSTEM-X',
    subtitle: 'Integration & Experimentation API Layer',
    category: 'API Contracts · RFC 8785 Canonical JSON · SHA-256 Provenance',
    demonstrationType: 'Type A: Interactive Educational Simulator',
    demonstrationNotice:
      'This demonstration runs real schema validation using Ajv (Draft-07), applies RFC 8785 Canonical JSON normalization, and calculates SHA-256 cryptographic digests using the Web Crypto API. Protocol buffer serialization is an illustrative binary wire-size comparison.',
    summary:
      'An integration API layer that connects simulation engines with reproducible verification environments through strict schema validation, canonical JSON serialization, and cryptographic state hashing.',
    problemStatement:
      'In high-throughput simulation systems, experiment payloads from heterogeneous sources can cause silent corruption if schemas drift. Furthermore, re-running simulations requires verified input integrity; uncanonicalized JSON strings produce divergent hashes even when semantic data is identical.',
    architectureOverview:
      'The pipeline enforces a 4-stage lifecycle: Ingress Schema Validation via Ajv, RFC 8785 canonical key ordering, cryptographic SHA-256 digest creation via Web Crypto, and verifiable run manifest emission.',
    technicalDecisions: [
      {
        decision: 'RFC 8785 Canonical JSON (JCS) before Hashing',
        rationale:
          'JSON key order is non-deterministic across languages. RFC 8785 guarantees identical byte representations for equivalent semantic objects.',
        tradeoff:
          'Requires lexicographical sorting of object keys on ingress.',
      },
      {
        decision: 'Ajv Schema Compilation with Strict Boundary Rules',
        rationale:
          'Rejects unknown properties and enforces minimum/maximum integer boundaries before any execution logic runs.',
        tradeoff:
          'Requires maintaining formal JSON Schema definitions alongside TypeScript interfaces.',
      },
      {
        decision: 'Explicit Cryptographic Integrity vs Authorship Disclosure',
        rationale:
          'Clearly documents that SHA-256 confirms data tamper detection, while digital signatures (e.g. Ed25519) are required for non-repudiation.',
        tradeoff:
          'Avoids false security claims in technical documentation.',
      },
    ],
    systemInvariants: [
      'Schema Conformance: All accepted payloads strictly satisfy SYSTEM_X_SCHEMA',
      'Canonical Invariance: Hash(Canonical(A)) == Hash(Canonical(B)) iff Semantic(A) == Semantic(B)',
      'Deterministic Artifact Manifest: Every execution produces a downloadable immutable manifest',
    ],
    metrics: [
      { label: 'Wire Payload Reduction', value: '~56%', context: 'Binary protobuf wire serialization vs formatted JSON' },
      { label: 'Schema Validation Latency', value: '< 0.8 ms', context: 'Compiled Ajv validator' },
      { label: 'Hash Digest Format', value: 'SHA-256 (256-bit)', context: 'FIPS 180-4 compliant state digest' },
    ],
    stack: ['TypeScript', 'Ajv', 'REST', 'gRPC', 'JSON Schema', 'MinIO'],
    githubUrl: 'https://github.com/SoumyashreeRout/SYSTEM-X',
    demoPath: '/projects/system-x',
    limitations: [
      'The browser demo calculates digests client-side; upload to persistent MinIO buckets is simulated in the sandbox.',
      'Protocol buffer wire packing is calculated using standard varint encoding models.',
    ],
    futureWork: [
      'Asymmetric cryptographic signatures (Ed25519) for tamper-proof run certificates.',
      'Native gRPC-Web gateway connection to live backend worker clusters.',
    ],
  },
];
