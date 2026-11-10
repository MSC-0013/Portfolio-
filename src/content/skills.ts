export interface EvidenceSkillGroup {
  groupTitle: string;
  badge: string;
  description: string;
  skills: {
    name: string;
    context: string;
  }[];
}

export const EVIDENCE_SKILLS: EvidenceSkillGroup[] = [
  {
    groupTitle: 'Used in Production at PractmoMind',
    badge: 'Production Experience',
    description: 'Technologies deployed, instrumented, and maintained in live services.',
    skills: [
      { name: 'Node.js & Fastify', context: 'High-throughput REST & WebSocket services with <15ms p95 latency' },
      { name: 'TypeScript', context: 'Strict type contracts across service boundaries and database access layers' },
      { name: 'MySQL & MongoDB', context: 'Relational ACID transaction models, composite indexing, and migration pipelines' },
      { name: 'Redis', context: 'Cache-aside with TTL jitter (1.8ms p95), session stores, and distributed locking' },
      { name: 'Docker', context: 'Optimized multi-stage container images (160MB footprint)' },
      { name: 'GitHub Actions', context: 'Automated CI/CD pipelines enforcing typechecking, linting, and unit tests' },
      { name: 'OpenTelemetry', context: 'W3C traceparent propagation, distributed spans, and latency monitoring' },
    ],
  },
  {
    groupTitle: 'Built & Tested in My Systems Projects',
    badge: 'Implemented & Benchmarked',
    description: 'Core algorithmic engines designed, modeled, and tested with Vitest suites.',
    skills: [
      { name: 'Raft Consensus State Machine', context: 'Leader elections, term tracking, and majority log commitment rules' },
      { name: 'Quorum Consistency (W + R > N)', context: 'Selection-aware quorum set intersection and stale read detection' },
      { name: 'Discrete-Event Scheduling', context: 'Virtual-clock event loop, priority queues, and Mulberry32 PRNG' },
      { name: 'Queue Overload Policies', context: 'Bounded buffer backpressure and drop-tail rejection models' },
      { name: 'RFC 8785 Canonical JSON (JCS)', context: 'Deterministic lexicographical key ordering for reproducible hashing' },
      { name: 'SHA-256 Digest Validation', context: 'Web Crypto SubtleCrypto state verification and run manifest emission' },
      { name: 'Ajv (Draft-07)', context: 'Strict compiled schema validation rejecting out-of-spec payloads in <0.8ms' },
    ],
  },
  {
    groupTitle: 'Actively Exploring & Deep-Diving',
    badge: 'Active Study & Prototyping',
    description: 'Technologies and protocols under targeted research and experimental prototyping.',
    skills: [
      { name: 'Apache Kafka', context: 'Partition rebalancing algorithms, consumer offset commit semantics, and lag monitoring' },
      { name: 'Protocol Buffers & gRPC', context: 'Binary wire-format serialization efficiency and IDL schema contract generation' },
      { name: 'Kubernetes Internals', context: 'Declarative controller reconciliation, pod scheduling constraints, and service meshes' },
    ],
  },
];
