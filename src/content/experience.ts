export interface ExperienceHighlight {
  bullet: string;
  metric: string;
}

export interface ExperienceRole {
  role: string;
  company: string;
  location: string;
  period: string;
  current: boolean;
  summary: string;
  highlights: ExperienceHighlight[];
  stack: string[];
}

export interface EducationEntry {
  degree: string;
  institution: string;
  period: string;
}

export const WORK_EXPERIENCE: ExperienceRole[] = [
  {
    role: 'Junior Software Engineer',
    company: 'PractmoMind',
    location: 'Bhubaneswar, India',
    period: 'January 2026 – Present',
    current: true,
    summary:
      'Developing low-latency backend microservices, optimizing database query pipelines, and configuring containerized delivery workflows.',
    highlights: [
      {
        bullet:
          'Engineered core REST and WebSocket service boundaries using Fastify and TypeScript with strict input validation, maintaining < 15ms p95 response latency across peak traffic.',
        metric: '< 15ms p95 latency',
      },
      {
        bullet:
          'Implemented Redis cache-aside strategies with TTL jitter to eliminate thundering-herd stampedes, dropping hot-query p95 latency from 85ms to 1.8ms (cache-hit latency < 2ms) and offloading 70%+ of read traffic.',
        metric: '1.8ms cache-hit latency',
      },
      {
        bullet:
          'Refactored relational MySQL schema models and composite indexes across high-volume transaction tables, reducing slow query occurrences by 60%.',
        metric: '60% slow query reduction',
      },
      {
        bullet:
          'Architected decoupled asynchronous event processing with Redis Streams and consumer groups, enforcing deterministic idempotency keys to process 50k+ daily events with 0 duplicate writes.',
        metric: '50k+ daily events at 0 duplicates',
      },
      {
        bullet:
          'Constructed multi-stage Docker builds reducing production image footprints from 850MB to 160MB (81% reduction), integrated with GitHub Actions CI gates running automated tests in under 2 minutes.',
        metric: '81% image footprint reduction',
      },
    ],
    stack: [
      'Node.js',
      'Fastify',
      'TypeScript',
      'Redis',
      'MySQL',
      'MongoDB',
      'Docker',
      'GitHub Actions',
      'OpenTelemetry',
    ],
  },
];

export const EDUCATION: EducationEntry = {
  degree: 'B.Tech in Computer Science & Engineering (AI & Machine Learning)',
  institution: 'Gandhi Engineering College',
  period: '2022 – 2026',
};
