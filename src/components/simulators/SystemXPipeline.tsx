'use client';

import React, { useState } from 'react';
import {
  processSystemXPipeline,
  PipelineArtifact,
  SchemaValidationResult,
} from '@/lib/simulators/systemx-engine';
import { CheckCircle2, XCircle, ArrowRight, Download, FileCode, Hash, ShieldCheck } from 'lucide-react';

const SAMPLE_VALID_PAYLOAD = {
  schemaVersion: '1.0.0',
  experimentId: 'exp-kafka-failover-09',
  workload: {
    model: 'poisson',
    targetRps: 1500,
    durationSeconds: 120,
  },
  environment: {
    clusterId: 'eu-west-sim-cluster',
    nodes: 8,
  },
  invariants: ['no_split_brain', 'p99_latency_sub_50ms', 'monotonic_versioning'],
};

const SAMPLE_INVALID_PAYLOAD = {
  schemaVersion: '1.0.0',
  experimentId: 'exp-invalid-test',
  workload: {
    model: 'poisson',
    targetRps: -50, // INVALID: below minimum 10
    durationSeconds: 120,
  },
  environment: {
    clusterId: 'eu-west-sim-cluster',
    // MISSING: nodes field
  },
  invariants: [], // INVALID: minItems 1
};

export default function SystemXPipeline() {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(SAMPLE_VALID_PAYLOAD, null, 2));
  const [pipelineState, setPipelineState] = useState<{
    validation: SchemaValidationResult;
    artifact?: PipelineArtifact;
    canonicalString?: string;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRunPipeline = async () => {
    setIsProcessing(true);
    try {
      const parsed = JSON.parse(jsonInput);
      const res = await processSystemXPipeline(parsed, 42);
      setPipelineState(res);
    } catch (err: unknown) {
      setPipelineState({
        validation: {
          valid: false,
          issues: [{ field: 'JSON_SYNTAX', message: err instanceof Error ? err.message : 'Invalid JSON Syntax' }],
          schemaVersion: 'draft-07',
        },
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadManifest = () => {
    if (!pipelineState?.artifact) return;
    const blob = new Blob([JSON.stringify(pipelineState.artifact, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `experiment-manifest-${pipelineState.artifact.configuration.seed}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full rounded-sm border border-neutral-800 bg-[#0c0c0c] p-4 sm:p-6 text-neutral-200">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-3 border-b border-neutral-800/80 pb-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-semibold text-neutral-100 uppercase tracking-wider">
              SYSTEM-X: Contract Validation & Provenance
            </span>
            <span className="rounded bg-neutral-800 px-2 py-0.5 font-mono text-[10px] text-neutral-300">
              Type A: Educational Simulator
            </span>
          </div>
          <p className="mt-1 font-mono text-xs text-neutral-400">
            Enforces Ajv JSON Schema validation, RFC 8785 Canonical JSON normalization, and SHA-256 state hashing.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRunPipeline}
          disabled={isProcessing}
          className="inline-flex items-center space-x-1.5 self-start sm:self-auto rounded-sm bg-neutral-100 px-4 py-1.5 font-mono text-xs font-semibold text-black hover:bg-white transition-colors"
        >
          <span>Run Pipeline</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Preset Buttons */}
      <div className="mb-4 flex flex-wrap gap-2 font-mono text-xs">
        <span className="text-neutral-400 py-1">Presets:</span>
        <button
          type="button"
          onClick={() => setJsonInput(JSON.stringify(SAMPLE_VALID_PAYLOAD, null, 2))}
          className="rounded border border-neutral-700 bg-neutral-900 px-2.5 py-1 text-neutral-300 hover:bg-neutral-800"
        >
          Valid Experiment Payload
        </button>
        <button
          type="button"
          onClick={() => setJsonInput(JSON.stringify(SAMPLE_INVALID_PAYLOAD, null, 2))}
          className="rounded border border-neutral-700 bg-neutral-900 px-2.5 py-1 text-red-400 hover:bg-neutral-800"
        >
          Invalid Schema Preset (Fails Validation)
        </button>
      </div>

      {/* Editor & Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: JSON Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between font-mono text-xs text-neutral-400">
            <div className="flex items-center space-x-1.5">
              <FileCode className="h-3.5 w-3.5 text-neutral-400" />
              <span>Experiment Ingress Payload (JSON):</span>
            </div>
          </div>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            rows={14}
            className="w-full rounded border border-neutral-800 bg-neutral-950 p-3 font-mono text-xs text-neutral-200 focus:border-neutral-600 focus:outline-none"
            spellCheck={false}
          />
        </div>

        {/* Right: Validation & Digest Pipeline */}
        <div className="space-y-4">
          {pipelineState ? (
            <>
              {/* Validation Card */}
              <div
                className={`rounded border p-3 font-mono text-xs ${
                  pipelineState.validation.valid
                    ? 'border-emerald-900/60 bg-emerald-950/20'
                    : 'border-red-900/60 bg-red-950/20'
                }`}
              >
                <div className="flex items-center space-x-2 font-semibold">
                  {pipelineState.validation.valid ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span className="text-emerald-400 uppercase">Stage 1: Ajv Schema Validation PASSED</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-red-400" />
                      <span className="text-red-400 uppercase">Stage 1: Schema Validation REJECTED</span>
                    </>
                  )}
                </div>

                {!pipelineState.validation.valid && (
                  <div className="mt-2 space-y-1 text-[11px] text-red-300">
                    {pipelineState.validation.issues.map((issue, idx) => (
                      <div key={idx}>
                        • [{issue.field}]: {issue.message}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cryptographic SHA-256 Digest Card */}
              {pipelineState.artifact && (
                <div className="rounded border border-neutral-800 bg-neutral-950 p-3 font-mono text-xs space-y-2">
                  <div className="flex items-center space-x-2 text-neutral-200 font-semibold">
                    <Hash className="h-4 w-4 text-neutral-400" />
                    <span>Stage 2 & 3: RFC 8785 Canonical JSON & SHA-256</span>
                  </div>

                  <div className="rounded bg-neutral-900 p-2 text-[10px] break-all text-neutral-300">
                    <div className="text-neutral-400 mb-1">SHA-256 Content Digest:</div>
                    <span className="text-emerald-400 font-mono font-bold">
                      {pipelineState.artifact.input.contentHash}
                    </span>
                  </div>

                  <p className="text-[10px] text-neutral-400 leading-normal">
                    {pipelineState.artifact.input.integrityDisclosure}
                  </p>
                </div>
              )}

              {/* Wire Format Efficiency Comparison */}
              {pipelineState.artifact && (
                <div className="rounded border border-neutral-800 bg-neutral-950 p-3 font-mono text-xs">
                  <div className="text-neutral-300 font-semibold mb-2">Wire-Format Comparison:</div>
                  <div className="grid grid-cols-3 gap-2 text-[11px]">
                    <div className="rounded bg-neutral-900 p-2 text-center">
                      <div className="text-neutral-400 text-[10px]">Formatted JSON</div>
                      <div className="text-neutral-100 font-semibold">
                        {pipelineState.artifact.wireFormatComparison.rawJsonBytes} B
                      </div>
                    </div>
                    <div className="rounded bg-neutral-900 p-2 text-center">
                      <div className="text-neutral-400 text-[10px]">Canonical JSON</div>
                      <div className="text-neutral-100 font-semibold">
                        {pipelineState.artifact.wireFormatComparison.canonicalJsonBytes} B
                      </div>
                    </div>
                    <div className="rounded bg-neutral-900 p-2 text-center border border-emerald-900/40">
                      <div className="text-emerald-400 text-[10px]">ProtoBuf Wire</div>
                      <div className="text-emerald-400 font-semibold">
                        {pipelineState.artifact.wireFormatComparison.mockProtoBufBytes} B
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-center text-[10px] text-neutral-400">
                    Binary Wire Savings: ~{pipelineState.artifact.wireFormatComparison.wireSavingsPercent}% vs Raw JSON
                  </div>
                </div>
              )}

              {/* Download Manifest Action */}
              {pipelineState.artifact && (
                <button
                  type="button"
                  onClick={handleDownloadManifest}
                  className="w-full inline-flex items-center justify-center space-x-2 rounded-sm border border-neutral-700 bg-neutral-900 py-2 font-mono text-xs text-neutral-200 hover:bg-neutral-800 transition-colors"
                >
                  <Download className="h-3.5 w-3.5 text-neutral-400" />
                  <span>Download Run Manifest (JSON)</span>
                </button>
              )}
            </>
          ) : (
            <div className="flex h-full min-h-[220px] flex-col items-center justify-center rounded border border-neutral-800/80 bg-neutral-950/40 p-6 text-center font-mono text-xs text-neutral-400">
              <ShieldCheck className="h-8 w-8 text-neutral-600 mb-2" />
              <span>Click &quot;Run Pipeline&quot; to test schema verification and SHA-256 state hashing.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
