export interface ExperienceRole {
  role: string;
  company: string;
  location: string;
  period: string;
  current: boolean;
  summary: string;
  themes: {
    title: string;
    description: string;
    highlights: string[];
  }[];
  stack: string[];
}

export interface EducationEntry {
  degree: string;
  field: string;
  institution: string;
  period: string;
  details: string;
}

export const WORK_EXPERIENCE: ExperienceRole[] = [
  {
    role: 'Junior Software Engineer',
    company: 'PractmoMind',
    location: 'Bhubaneswar, India',
    period: 'January 2026 – Present',
    current: true,
    summary:
      'Designing and developing scalable backend services, optimizing relational and document data storage, and implementing containerized CI/CD delivery pipelines.',
    themes: [
      {
        title: 'Backend Engineering',
        description:
          'API contract design, service boundaries, authentication & authorization primitives.',
        highlights: [
          'Engineered low-latency REST and WebSocket services using Fastify and Node.js with strict request validation.',
          'Implemented token-based authentication and role-based access control (RBAC) across modular service boundaries.',
          'Built resilient HTTP/gRPC client wrappers with exponential backoff and circuit-breaker patterns.',
        ],
      },
      {
        title: 'Database & Storage Engineering',
        description:
          'Schema modeling, transactional consistency, indexing strategies, and caching tiers.',
        highlights: [
          'Designed relational schemas in MySQL and document structures in MongoDB with migration scripts.',
          'Integrated Redis multi-tier caching with cache-aside and TTL-based invalidation strategies.',
          'Optimized database queries and composite indexes, reducing p95 execution times under high read load.',
        ],
      },
      {
        title: 'Reliability & Asynchronous Processing',
        description:
          'Idempotent event consumers, distributed task queues, and telemetry instrumentation.',
        highlights: [
          'Architected decoupled asynchronous event processing using Redis Streams and Kafka consumer groups.',
          'Enforced deduplication and idempotency keys to guarantee at-least-once message processing without state corruption.',
          'Instrumented distributed traces and error budgets using OpenTelemetry.',
        ],
      },
      {
        title: 'Software Delivery & Infrastructure',
        description:
          'Containerized microservices, automated deployment pipelines, and operational visibility.',
        highlights: [
          'Constructed optimized multi-stage Dockerfiles reducing production image footprints.',
          'Configured GitHub Actions workflows for automated linting, typechecking, unit testing, and preview deployments.',
          'Managed container deployment manifests with health checks, graceful termination, and rolling updates.',
        ],
      },
    ],
    stack: [
      'Node.js',
      'Fastify',
      'TypeScript',
      'Redis',
      'Kafka',
      'MySQL',
      'MongoDB',
      'Docker',
      'GitHub Actions',
      'OpenTelemetry',
    ],
  },
];

export const EDUCATION: EducationEntry = {
  degree: 'Bachelor of Technology (B.Tech)',
  field: 'Computer Science & Engineering (Artificial Intelligence & Machine Learning)',
  institution: 'Gandhi Engineering College',
  period: '2022 – 2026',
  details:
    'Core coursework in Distributed Systems, Operating Systems, Computer Networks, Database Management Systems, Algorithm Design, and Concurrent Programming.',
};
