export interface SkillCategory {
  category: string;
  description: string;
  skills: {
    name: string;
    level: 'Core' | 'Advanced' | 'Practicing';
    notes: string;
  }[];
}

export const TECHNICAL_SKILLS: SkillCategory[] = [
  {
    category: 'Backend & Systems Programming',
    description: 'High-throughput runtime environments, type-safe API layers, and concurrent architectures.',
    skills: [
      { name: 'TypeScript / Node.js', level: 'Core', notes: 'Asynchronous event loop, worker threads, strict types' },
      { name: 'Fastify & Express', level: 'Core', notes: 'Schema compilation, plugins, high-performance routing' },
      { name: 'Python', level: 'Advanced', notes: 'Data processing scripts, simulation models, automation' },
      { name: 'REST & WebSockets', level: 'Core', notes: 'Stateful bidirectional streams, contract definition' },
      { name: 'gRPC & Protocol Buffers', level: 'Practicing', notes: 'Binary serialization, IDL schema contracts' },
      { name: 'JWT & RBAC', level: 'Core', notes: 'Stateless auth tokens, cryptographic signature validation' },
    ],
  },
  {
    category: 'Distributed Systems & Messaging',
    description: 'Scalable consensus, event propagation, fault-tolerant replication, and idempotency.',
    skills: [
      { name: 'Apache Kafka', level: 'Advanced', notes: 'Event streaming, consumer groups, offset management' },
      { name: 'Redis & Redis Streams', level: 'Core', notes: 'Pub/Sub, atomic operations, distributed caching' },
      { name: 'Consensus & Quorums', level: 'Advanced', notes: 'W + R > N balance, Raft term election invariants' },
      { name: 'Idempotency & Deduplication', level: 'Core', notes: 'Deterministic retry keys, at-least-once delivery' },
      { name: 'Network Partition Handling', level: 'Advanced', notes: 'Split-brain mitigation, linearizability guarantees' },
    ],
  },
  {
    category: 'Data & Storage Engineering',
    description: 'Relational data modeling, ACID transactions, document stores, and cache topologies.',
    skills: [
      { name: 'MySQL / PostgreSQL', level: 'Core', notes: 'Normalized schemas, indexing, foreign keys, transactions' },
      { name: 'MongoDB', level: 'Core', notes: 'Document hierarchies, aggregation pipelines, replica sets' },
      { name: 'Redis Cache-Aside', level: 'Core', notes: 'TTL invalidation, eviction policies, distributed locking' },
      { name: 'Database Migrations', level: 'Core', notes: 'Version-controlled non-breaking schema evolution' },
    ],
  },
  {
    category: 'Infrastructure, DevOps & Observability',
    description: 'Reproducible build containers, automated pipelines, and telemetric visibility.',
    skills: [
      { name: 'Docker', level: 'Core', notes: 'Multi-stage builds, rootless containers, compose clusters' },
      { name: 'Kubernetes', level: 'Practicing', notes: 'Pods, Deployments, Services, ConfigMaps, health probes' },
      { name: 'GitHub Actions CI/CD', level: 'Core', notes: 'Automated test runners, linting gates, preview deploys' },
      { name: 'OpenTelemetry', level: 'Advanced', notes: 'Distributed traces, span context propagation, metrics' },
      { name: 'Linux & Bash', level: 'Core', notes: 'Process monitoring, network diagnostics, shell automation' },
    ],
  },
];
