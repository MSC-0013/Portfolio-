'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import DistributedMesh from './DistributedMesh';
import FallbackSvgMesh from './FallbackSvgMesh';
import { Activity, ShieldCheck, RefreshCw } from 'lucide-react';

export default function ObservatoryCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [webGLAvailable, setWebGLAvailable] = useState(true);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [topologyMode, setTopologyMode] = useState<'mesh' | 'star' | 'ring'>('mesh');

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

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className="relative flex h-full min-h-[400px] sm:min-h-[480px] w-full items-center justify-center overflow-hidden select-none"
    >
      {/* 3D Top Telemetry HUD */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2 rounded-xs border border-neutral-700/60 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 px-2.5 py-1 font-mono text-[10px] text-neutral-800 dark:text-neutral-300 backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold">3D OBSERVATORY: 7 NODES</span>
        </div>

        <div className="flex items-center space-x-1 font-mono text-[10px] rounded-xs border border-neutral-700/60 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 p-0.5 backdrop-blur-md">
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
        </div>
      </div>

      {/* 3D Bottom Parallax Hint HUD */}
      <div className="absolute bottom-3 left-3 z-10 hidden sm:flex items-center space-x-1.5 rounded-xs border border-neutral-700/60 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 px-2 py-0.5 font-mono text-[9px] text-neutral-500 dark:text-neutral-400 backdrop-blur-md">
        <Activity className="h-3 w-3 text-emerald-500" />
        <span>MOVE CURSOR TO TILT 3D PERSPECTIVE</span>
      </div>

      <Suspense fallback={<FallbackSvgMesh />}>
        <Canvas
          frameloop={isInView ? 'always' : 'never'}
          camera={{ position: [0, 0, 5.6], fov: 46 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          className="h-full w-full cursor-grab active:cursor-grabbing"
        >
          <ambientLight intensity={0.7} />
          <DistributedMesh pointerParallax={pointer} topologyMode={topologyMode} />
        </Canvas>
      </Suspense>
    </div>
  );
}
