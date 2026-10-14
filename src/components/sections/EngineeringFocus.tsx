'use client';

import React from 'react';
import { Server, Network, Database, ShieldCheck, Cpu, Activity, GitBranch } from 'lucide-react';

const FOCUS_AREAS = [
  {
    number: '01',
    title: 'Backend Engineering',
    tagline: 'High-throughput runtime services, API contracts, and concurrent execution.',
    description:
      'Designing low-latency REST and WebSocket interfaces, token-based authentication boundaries, and modular microservices with strict schema validation.',
    technologies: ['Node.js', 'Fastify', 'Express.js', 'TypeScript', 'REST', 'WebSockets'],
    metric: '< 15ms p95 latency on core service endpoints',
    icon: Server,
  },
  {
    number: '02',
    title: 'Distributed Systems',
    tagline: 'Consensus protocols, event propagation, and network partition resiliency.',
    description:
      'Exploring Quorum intersection math (W + R > N), Raft leader election invariants, idempotent event consumers, and split-brain mitigation.',
    technologies: ['Apache Kafka', 'Redis Streams', 'gRPC', 'Raft Consensus', 'Quorums'],
    metric: 'Zero silent data loss under minority network partitions',
    icon: Network,
  },
  {
    number: '03',
    title: 'Data & Storage Systems',
    tagline: 'Relational modeling, document stores, and cache-aside invalidation.',
    description:
      'Structuring normalized schemas, managing composite indexing strategies, optimizing heavy joins, and preventing cache stampedes with distributed TTL locks.',
    technologies: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Database Migrations'],
    metric: 'Sub-millisecond cache hit rates via Redis cache-aside tiers',
    icon: Database,
  },
  {
    number: '04',
    title: 'Infrastructure & Observability',
    tagline: 'Containerized deployment, automated CI/CD, and distributed tracing.',
    description:
      'Building minimal multi-stage Docker images, configuring Kubernetes pods and health probes, and instrumenting OpenTelemetry span context across services.',
    technologies: ['Docker', 'Kubernetes', 'GitHub Actions', 'OpenTelemetry', 'Linux'],
    metric: '100% reproducible container manifests & automated CI verification',
    icon: ShieldCheck,
  },
];

export default function EngineeringFocus() {
  return (
    <section id="engineering" className="border-b border-neutral-200 bg-white py-20 text-neutral-900 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col justify-between border-b border-neutral-200 pb-8 sm:flex-row sm:items-end">
          <div>
            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-500">
              02 / Core Competencies
            </div>
            <h2 className="mt-2 font-sans text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
              Engineering Focus
            </h2>
          </div>
          <p className="mt-4 max-w-md font-mono text-xs text-neutral-600 sm:mt-0">
            Architecting reliable systems from low-level data access layers to multi-node distributed topologies.
          </p>
        </div>

        {/* 4 Large Typographic Cards */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {FOCUS_AREAS.map((area) => {
            const Icon = area.icon;
            return (
              <div
                key={area.number}
                className="group relative flex flex-col justify-between rounded-sm border border-neutral-200 bg-neutral-50/50 p-6 sm:p-8 transition-all hover:border-neutral-900 hover:bg-white hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-neutral-200/80 pb-4">
                    <span className="font-mono text-xs font-bold text-neutral-400 group-hover:text-black">
                      {area.number}
                    </span>
                    <Icon className="h-5 w-5 text-neutral-500 group-hover:text-black transition-colors" />
                  </div>

                  <h3 className="mt-6 font-sans text-xl font-bold text-neutral-900">
                    {area.title}
                  </h3>
                  <div className="mt-1 font-mono text-xs font-medium text-neutral-500">
                    {area.tagline}
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-neutral-600 font-sans">
                    {area.description}
                  </p>
                </div>

                <div className="mt-8 space-y-4">
                  {/* Metric Tag */}
                  <div className="rounded border border-neutral-200 bg-white p-2.5 font-mono text-xs text-neutral-800">
                    <span className="text-neutral-500 mr-2">Target Metric:</span>
                    <span className="font-semibold">{area.metric}</span>
                  </div>

                  {/* Technology Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {area.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-xs border border-neutral-300 bg-neutral-100 px-2 py-1 font-mono text-[11px] text-neutral-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
