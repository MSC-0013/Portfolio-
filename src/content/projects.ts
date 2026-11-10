export interface ProjectCaseStudy {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  demonstrationType: string;
  demonstrationNotice: string;
  summary: string;
  problemStatement: string;
  architectureOverview: string;
  technicalDecisions: {
    decision: string;
    rationale: string;
    tradeoff: string;
  }[];
  systemInvariants: {
    rule: string;
    testProof: string;
  }[];
  metrics: {
    label: string;
    value: string;
    context: string;
  }[];
  implementedEngine: string[];
  conceptsModelled: string[];
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
    category: 'Discrete-Event Scheduling · Queue Contention · Fault Injection',
    demonstrationType: 'Interactive Educational Simulator',
    demonstrationNotice:
      'Browser simulation executing a deterministic virtual clock state machine (Mulberry32 PRNG). Models request queue backpressure, worker pool exhaustion, and drop-tail rejection.',
    summary:
      'A deterministic discrete-event simulation engine designed to model system capacity limits, virtual worker contention, queue backpressure, and cascading failure propagation before deploying to production.',
    problemStatement:
      'Production failure modes (such as thread starvation, worker pool exhaustion, and drop-tail buffer bloat) are notoriously risky and expensive to isolate on live clusters. Traditional load tests generate raw traffic without isolating the deterministic tipping points where queue latencies spike exponentially under Poisson arrival distributions.',
    architectureOverview:
      'Built around a priority-queued virtual clock event loop. Incoming events advance virtual time rather than relying on browser frames. A bounded FIFO request queue buffers arrivals. If worker concurrency is fully saturated, requests buffer up to capacity, after which drop-tail or backpressure policies take effect.',
    technicalDecisions: [
      {
        decision: 'Virtual-Clock Event Loop over Real-Time Animation Delays',
        rationale:
          'Real-time timers drift under browser thread load and produce non-deterministic results across client devices.',
        tradeoff:
          'Requires custom discrete-event priority scheduling logic rather than standard reactive state updates.',
      },
      {
        decision: 'Seeded PRNG (Mulberry32) for Exponential Inter-Arrivals',
        rationale:
          'Enables 100% reproducible benchmark scenarios. An engineer can share an identical seed and observe identical p95/p99 latency curves.',
        tradeoff:
          'Precludes true hardware entropy, which is intentionally avoided for test harness determinism.',
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
      {
        rule: 'Chronological Execution: E_n.time <= E_{n+1}.time',
        testProof: 'Holds across 100,000+ scheduled events in Vitest deterministic suite',
      },
      {
        rule: 'Bounded Queue Invariant: QueueDepth <= QueueCapacity at all times',
        testProof: 'Zero buffer overflow leaks under 10x saturation bursts',
      },
      {
        rule: 'Deterministic Replay: Identical (Seed, λ, μ, Workers) → Identical Latency',
        testProof: 'Bit-exact match verified across consecutive simulator runs',
      },
    ],
    metrics: [
      {
        label: 'Throughput Ceiling',
        value: '600 req/s',
        context: '12 concurrent workers, mean service time 1/μ = 20ms (saturation limit kμ = 12 × 50)',
      },
      {
        label: 'Simulated p99 Latency',
        value: '108.4 ms',
        context: 'Offered load ρ = 0.80 (480 req/s, exponential queue wait + service)',
      },
      {
        label: 'Queue Recovery Time',
        value: '1.4 s',
        context: 'Measured duration for buffer to return to baseline depth post-failure restoration',
      },
    ],
    implementedEngine: [
      'TypeScript Strict',
      'Virtual Clock Priority Queue',
      'Mulberry32 PRNG',
      'Exponential Service Sampling',
    ],
    conceptsModelled: [
      'Bounded Queue Overload Policies',
      'Worker Concurrency Saturation',
      'Cascading Failure Propagation',
    ],
    githubUrl: 'https://github.com/SoumyashreeRout/BLACKBOX-X',
    demoPath: '/projects/blackbox-x',
    limitations: [
      'The browser engine simulates virtual workers on a single JavaScript event loop; it does not test multi-core OS kernel context switching.',
      'Network transit latency is currently modeled as an exponential variable rather than a multi-hop routing graph.',
    ],
    futureWork: [
      'WebAssembly execution core for sub-millisecond multi-million event simulations.',
      'OpenTelemetry trace exporter to output simulated Jaeger span graphs.',
    ],
  },
  {
    id: '02',
    slug: 'quorum-lab',
    title: 'QUORUM LAB',
    subtitle: 'Distributed Consistency & Consensus Environment',
    category: 'Replication Protocols · Raft Consensus · Split-Brain Mitigation',
    demonstrationType: 'Interactive Educational Simulator',
    demonstrationNotice:
      'Multi-node state machine in TypeScript demonstrating Quorum mathematical intersection (W + R > N), Raft leader election, and split-brain partition mitigation.',
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
        decision: 'Selection-Aware Set Intersection Calculation',
        rationale:
          'Computes the actual intersection I = S_w ∩ S_r between queried read nodes and acknowledged write nodes, exposing the exact stale version returned when quorums fail to overlap.',
        tradeoff:
          'Requires tracking the historical global state across all nodes.',
      },
    ],
    systemInvariants: [
      {
        rule: 'Quorum Overlap: If W + R > N, Read Set and Write Set intersect on ≥ 1 replica',
        testProof: 'Mathematically guaranteed non-empty intersection for all eligible set pairs',
      },
      {
        rule: 'Raft Majority Threshold: Q = floor(N/2) + 1 (Q = 3 for N = 5)',
        testProof: 'Minority partition (2 < 3) strictly rejects uncommitted log entries',
      },
      {
        rule: 'Single Leader per Term: At most one valid leader can exist in any term',
        testProof: 'Enforced via term-incremented majority vote collection in Vitest suite',
      },
    ],
    metrics: [
      {
        label: 'Cluster Size (N)',
        value: '5 Replicas',
        context: 'Tolerates up to f = 2 failures (f = ⌊(N-1)/2⌋)',
      },
      {
        label: 'Majority Quorum (Q)',
        value: '3 / 5 Nodes',
        context: 'Required for leader election & log entry commitment',
      },
      {
        label: 'Disjoint Quorum Risk',
        value: '30%',
        context: 'For W=2, R=2 on N=5: C(3,2)/C(5,2) = 3/10 stale read probability without intersection',
      },
    ],
    implementedEngine: [
      'TypeScript Strict',
      'Raft Term & State Machine',
      'Selection-Aware Set Intersection',
      'Monotonic Version Tracking',
    ],
    conceptsModelled: [
      'Split-Brain Partition Divergence',
      'Majority Consensus vs Multi-Master',
      'Replicated Log Lifecycle',
    ],
    githubUrl: 'https://github.com/SoumyashreeRout/QUORUM-LAB',
    demoPath: '/projects/quorum-lab',
    limitations: [
      'Log compaction (snapshots) is not implemented in the browser simulation.',
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
    category: 'API Ingress Contracts · RFC 8785 Canonical JSON · SHA-256 Provenance',
    demonstrationType: 'Interactive Educational Simulator',
    demonstrationNotice:
      'Executes schema validation using compiled Ajv (Draft-07), applies RFC 8785 Canonical JSON normalization, and calculates SHA-256 cryptographic digests via SubtleCrypto.',
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
      {
        rule: 'Schema Conformance: All accepted payloads strictly satisfy SYSTEM_X_SCHEMA',
        testProof: 'Ajv rejects unknown keys, invalid bounds, and malformed types',
      },
      {
        rule: 'Canonical Invariance: Hash(JCS(A)) == Hash(JCS(B)) iff Semantic(A) == Semantic(B)',
        testProof: 'Verified across permutations of nested object key orders',
      },
      {
        rule: 'Deterministic Artifact Manifest: Every execution outputs immutable run proof',
        testProof: 'Downloadable JSON manifest contains RFC 8785 digest and execution seed',
      },
    ],
    metrics: [
      {
        label: 'Wire Format Reduction',
        value: '~56%',
        context: 'Binary protobuf wire serialization vs formatted JSON benchmark payload',
      },
      {
        label: 'Schema Check Latency',
        value: '< 0.8 ms',
        context: 'Compiled Ajv Draft-07 validator execution on 1KB sample manifest',
      },
      {
        label: 'Digest Standard',
        value: 'SHA-256',
        context: 'RFC 8785 canonical byte normalization via Web Crypto SubtleCrypto',
      },
    ],
    implementedEngine: [
      'TypeScript Strict',
      'Ajv (Draft-07)',
      'RFC 8785 Canonical JSON',
      'Web Crypto SHA-256',
    ],
    conceptsModelled: [
      'Protocol Buffers Wire Compression',
      'Zero-Trust API Ingress Contracts',
      'Cryptographic Execution Audit Trails',
    ],
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
