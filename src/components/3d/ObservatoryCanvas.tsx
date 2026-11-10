'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import DistributedMesh, { ClusterTelemetry } from './DistributedMesh';
import FallbackSvgMesh from './FallbackSvgMesh';
import { Activity, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function ObservatoryCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [webGLAvailable, setWebGLAvailable] = useState(true);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [topologyMode, setTopologyMode] = useState<'mesh' | 'star' | 'ring'>('mesh');
  const [resetCounter, setResetCounter] = useState(0);

  // Live cluster telemetry state
  const [telemetry, setTelemetry] = useState<ClusterTelemetry>({
    crashedNodes: [],
    leaderId: 'node-c',
    term: 4,
    hasQuorum: true,
    activeCount: 5,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);

      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
          setWebGLAvailable(false);
        }
      } catch {
        setWebGLAvailable(false);
      }

      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    setPointer({
      x: Math.max(-0.8, Math.min(0.8, x)),
      y: Math.max(-0.8, Math.min(0.8, y)),
    });
  };

  if (reducedMotion || !webGLAvailable) {
    return (
      <div ref={containerRef} className="h-full w-full">
        <FallbackSvgMesh />
      </div>
    );
  }

  const leaderLabel = telemetry.leaderId
    ? telemetry.leaderId.replace('node-', 'Node-').toUpperCase()
    : 'NONE';

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className="relative flex h-full min-h-[420px] sm:min-h-[490px] w-full items-center justify-center overflow-hidden select-none"
    >
      {/* 3D Top Telemetry HUD */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        <div className="flex items-center space-x-2 rounded-xs border border-neutral-300 dark:border-neutral-800 bg-white/90 dark:bg-neutral-950/90 px-2.5 py-1 font-mono text-[10px] text-neutral-800 dark:text-neutral-300 backdrop-blur-md shadow-xs">
          <span
            className={`h-2 w-2 rounded-full ${
              telemetry.hasQuorum ? 'bg-emerald-500 animate-pulse' : 'bg-red-500 animate-ping'
            }`}
          />
          <span className="font-bold tracking-wider">
            QUORUM CLUSTER (N=5): {telemetry.activeCount}/5 ALIVE
          </span>
          <span className="text-neutral-400 dark:text-neutral-600">|</span>
          <span className="text-[9px] text-neutral-600 dark:text-neutral-400">
            LEADER: {leaderLabel} (TERM {telemetry.term})
          </span>
        </div>

        {/* Topology Selectors & Reset */}
        <div className="flex items-center space-x-1 font-mono text-[10px] rounded-xs border border-neutral-300 dark:border-neutral-800 bg-white/90 dark:bg-neutral-950/90 p-0.5 backdrop-blur-md shadow-xs">
          <button
            type="button"
            onClick={() => setTopologyMode('mesh')}
            className={`rounded-xs px-2 py-0.5 transition-colors ${
              topologyMode === 'mesh'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black font-bold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Mesh
          </button>
          <button
            type="button"
            onClick={() => setTopologyMode('star')}
            className={`rounded-xs px-2 py-0.5 transition-colors ${
              topologyMode === 'star'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black font-bold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Star
          </button>
          <button
            type="button"
            onClick={() => setTopologyMode('ring')}
            className={`rounded-xs px-2 py-0.5 transition-colors ${
              topologyMode === 'ring'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black font-bold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Ring
          </button>

          {telemetry.crashedNodes.length > 0 && (
            <button
              type="button"
              onClick={() => setResetCounter((c) => c + 1)}
              className="inline-flex items-center space-x-1 rounded-xs bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 px-2 py-0.5 font-bold hover:bg-red-200 dark:hover:bg-red-900 transition-colors ml-1"
              title="Reset crashed nodes"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Quorum Warning / Status Banner */}
      {!telemetry.hasQuorum && (
        <div className="absolute top-14 left-3 right-3 z-10 flex items-center justify-center space-x-2 rounded-xs border border-red-400/80 bg-red-500/10 dark:bg-red-950/70 p-2 font-mono text-[10px] font-bold text-red-600 dark:text-red-300 backdrop-blur-md">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          <span>MAJORITY QUORUM BROKEN (&lt; 3 NODES) · WRITE REPLICATION BLOCKED</span>
        </div>
      )}

      {/* 3D Bottom Interactive Instruction HUD */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center space-x-1.5 rounded-xs border border-neutral-300 dark:border-neutral-800 bg-white/90 dark:bg-neutral-950/90 px-2.5 py-1 font-mono text-[9px] text-neutral-600 dark:text-neutral-400 backdrop-blur-md">
          <Activity className="h-3 w-3 text-emerald-500 shrink-0" />
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">
            CLICK ANY NODE TO CRASH / REVIVE
          </span>
          <span className="text-neutral-400">·</span>
          <span>TRIGGERS RAFT ELECTION & QUORUM CHECK</span>
        </div>

        <div className="hidden sm:flex items-center space-x-1 rounded-xs border border-neutral-300 dark:border-neutral-800 bg-white/90 dark:bg-neutral-950/90 px-2 py-1 font-mono text-[9px] text-neutral-500 backdrop-blur-md">
          <span>PARALLAX ACTIVE</span>
        </div>
      </div>

      <Suspense fallback={<FallbackSvgMesh />}>
        <Canvas
          frameloop={isInView ? 'always' : 'never'}
          camera={{ position: [0, 0, 6.0], fov: 42 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          className="h-full w-full"
        >
          <DistributedMesh
            pointerParallax={pointer}
            topologyMode={topologyMode}
            onTelemetryChange={setTelemetry}
            resetSignal={resetCounter}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
