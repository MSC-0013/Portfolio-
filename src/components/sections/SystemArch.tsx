'use client';

import React, { useState } from 'react';
import { ArrowDown, Cpu, Key, Database, Zap, Activity, CheckCircle2 } from 'lucide-react';

interface ArchNode {
  id: string;
  name: string;
  subtitle: string;
  role: string;
  decisions: string[];
  tradeoffs: string;
  invariants: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ARCH_NODES: ArchNode[] = [
  {
    id: 'gateway',
    name: '01 / Edge Gateway & Ingress',
    subtitle: 'Fastify / Envoy / NGINX',
    role: 'TLS termination, distributed rate-limiting, and request correlation ID injection.',
    decisions: [
      'Token bucket algorithm for rate-limiting bursts while bounding global throughput.',
      'Injecting W3C TraceContext headers (traceparent) at ingress for end-to-end distributed observability.',
    ],
    tradeoffs: 'Edge buffering absorbs spikes but adds 1-2ms to absolute round-trip latency.',
    invariants: 'All ingress requests carry an immutable X-Request-ID.',
    icon: Zap,
  },
  {
    id: 'auth',
    name: '02 / Authentication & Authorization',
    subtitle: 'Cryptographic JWT + Cached RBAC',
    role: 'Stateless signature verification with hierarchical role-based permissions.',
    decisions: [
      'Asymmetric Ed25519 or RS256 token verification without contacting an identity service on every request.',
      'Short-lived access tokens (15m) paired with Redis revocation blacklists for emergency offboarding.',
    ],
    tradeoffs: 'Asymmetric validation requires CPU cycles; mitigated via fast cryptographic libraries.',
    invariants: 'Zero unauthenticated requests reach inner service boundaries.',
    icon: Key,
  },
  {
    id: 'service',
    name: '03 / Core Business Logic Layer',
    subtitle: 'Node.js / TypeScript / Fastify Microservices',
    role: 'Domain logic, transactional boundaries, validation, and idempotent dispatch.',
    decisions: [
      'Strict schema compilation via Ajv/TypeBox on all request bodies before execution.',
      'Idempotency keys on state-mutating requests (POST/PUT) stored in Redis with atomic SETNX.',
    ],
    tradeoffs: 'Strict validation incurs memory overhead on large JSON structures.',
    invariants: 'Every mutation is idempotent under retry with the same idempotency key.',
    icon: Cpu,
  },
  {
    id: 'storage',
    name: '04 / Storage & Distributed State',
    subtitle: 'MySQL / MongoDB + Redis Cache-Aside + Kafka',
    role: 'ACID transaction boundaries, read-optimized document views, and distributed caching.',
    decisions: [
      'Cache-aside with TTL jitter to eliminate thundering-herd cache stampedes.',
      'Outbox pattern: Database mutations and Kafka event emissions commit atomically in the same local transaction.',
    ],
    tradeoffs: 'The Outbox pattern requires an asynchronous CDC relay worker (e.g. Debezium).',
    invariants: 'Events are never emitted for database transactions that rollback.',
    icon: Database,
  },
  {
    id: 'observability',
    name: '05 / Observability & Telemetry',
    subtitle: 'OpenTelemetry + Prometheus + Distributed Tracing',
    role: 'Continuous metric aggregation, P95/P99 latency tracking, and error budgeting.',
    decisions: [
      'Structured JSON logging with trace context correlation.',
      'Red-line SLO alerting based on burn rates rather than raw error thresholds.',
    ],
    tradeoffs: 'Trace sampling (e.g. 10%) is required at high throughput to manage telemetry storage costs.',
    invariants: 'Every production failure produces an observable trace and correlated stack trace.',
    icon: Activity,
  },
];

export default function SystemArch() {
  const [selectedNode, setSelectedNode] = useState<ArchNode>(ARCH_NODES[2]); // Default to core service

  return (
    <section id="architecture" className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-[#080808] py-20 text-neutral-900 dark:text-white transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col justify-between border-b border-neutral-200 dark:border-neutral-800 pb-8 sm:flex-row sm:items-end">
          <div>
            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              05 / Systems Philosophy
            </div>
            <h2 className="mt-2 font-sans text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
              How I Think About Systems
            </h2>
          </div>
          <p className="mt-4 max-w-md font-mono text-xs text-neutral-600 dark:text-neutral-400 sm:mt-0">
            Interactive request lifecycle: click any stage to inspect architectural rationale, concurrency invariants, and trade-offs.
          </p>
        </div>

        {/* Architecture Grid */}
        <div className="mt-12 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Left Column: Visual Pipeline Flow */}
          <div className="space-y-3 lg:col-span-5">
            {ARCH_NODES.map((node, index) => {
              const isSelected = selectedNode.id === node.id;
              const Icon = node.icon;

              return (
                <React.Fragment key={node.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedNode(node)}
                    className={`w-full flex items-center justify-between rounded-sm border p-4 text-left transition-all ${
                      isSelected
                        ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-100 dark:bg-neutral-900 shadow-md ring-1 ring-neutral-400'
                        : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950/60 hover:border-neutral-400 dark:hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`rounded p-2 transition-colors ${
                          isSelected
                            ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-black'
                            : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-mono text-xs font-bold text-neutral-900 dark:text-white">{node.name}</div>
                        <div className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">{node.subtitle}</div>
                      </div>
                    </div>

                    <span
                      className={`font-mono text-[10px] uppercase font-semibold ${
                        isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-400 dark:text-neutral-500'
                      }`}
                    >
                      {isSelected ? 'Active' : 'Inspect'}
                    </span>
                  </button>

                  {index < ARCH_NODES.length - 1 && (
                    <div className="flex justify-center py-0.5">
                      <ArrowDown className="h-4 w-4 text-neutral-400 dark:text-neutral-700" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Right Column: Deep Architectural Rationale Inspector */}
          <div className="rounded-sm border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 sm:p-8 lg:col-span-7 shadow-sm">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <div className="flex items-center space-x-2">
                {React.createElement(selectedNode.icon, { className: 'h-5 w-5 text-neutral-800 dark:text-neutral-200' })}
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                  {selectedNode.name}
                </h3>
              </div>
              <span className="font-mono text-[10px] text-neutral-500 dark:text-neutral-400">{selectedNode.subtitle}</span>
            </div>

            <div className="mt-6 space-y-6">
              {/* Core Role */}
              <div>
                <div className="font-mono text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase">
                  Primary Architectural Role:
                </div>
                <p className="mt-1 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 font-sans">
                  {selectedNode.role}
                </p>
              </div>

              {/* Technical Decisions */}
              <div>
                <div className="font-mono text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase">
                  Key Technical Decisions:
                </div>
                <ul className="mt-2 space-y-2">
                  {selectedNode.decisions.map((d, i) => (
                    <li key={i} className="flex items-start space-x-2 text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Architectural Trade-off */}
              <div className="rounded border border-neutral-200 dark:border-neutral-800/80 bg-neutral-50 dark:bg-neutral-900/60 p-3.5">
                <div className="font-mono text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 uppercase">
                  Engineered Trade-off:
                </div>
                <p className="mt-1 font-mono text-xs text-neutral-600 dark:text-neutral-400">
                  {selectedNode.tradeoffs}
                </p>
              </div>

              {/* Concurrency & Safety Invariant */}
              <div className="rounded border border-emerald-300 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/10 p-3.5">
                <div className="font-mono text-[11px] font-semibold text-emerald-800 dark:text-emerald-400 uppercase">
                  Enforced System Invariant:
                </div>
                <p className="mt-1 font-mono text-xs text-emerald-900 dark:text-emerald-200">
                  {selectedNode.invariants}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
