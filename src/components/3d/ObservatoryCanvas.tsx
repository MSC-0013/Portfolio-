'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import DistributedMesh from './DistributedMesh';
import FallbackSvgMesh from './FallbackSvgMesh';

export default function ObservatoryCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [webGLAvailable, setWebGLAvailable] = useState(true);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // 1. Check prefers-reduced-motion
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);

      // 2. Test basic WebGL availability
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

  // IntersectionObserver to pause rendering when scrolled out of view
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
    // Clamp to subtle max tilt
    setPointer({
      x: Math.max(-0.6, Math.min(0.6, x)),
      y: Math.max(-0.6, Math.min(0.6, y)),
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
      className="relative flex h-full min-h-[360px] sm:min-h-[440px] w-full items-center justify-center overflow-hidden"
    >
      {/* Monospace Scene Telemetry Indicator */}
      <div className="absolute top-3 right-3 z-10 flex items-center space-x-2 rounded-sm border border-neutral-800 bg-neutral-950/80 px-2.5 py-1 font-mono text-[10px] text-neutral-400 backdrop-blur-xs">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>TOPOLOGY: DISTRIBUTED REPLICAS</span>
      </div>

      <Suspense fallback={<FallbackSvgMesh />}>
        <Canvas
          frameloop={isInView ? 'always' : 'never'}
          camera={{ position: [0, 0, 5.2], fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          className="h-full w-full"
        >
          <ambientLight intensity={0.6} />
          <DistributedMesh pointerParallax={pointer} />
        </Canvas>
      </Suspense>
    </div>
  );
}
