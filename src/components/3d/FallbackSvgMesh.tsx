'use client';

import React from 'react';

export default function FallbackSvgMesh() {
  return (
    <div className="relative flex h-full min-h-[380px] w-full items-center justify-center p-6" aria-label="Distributed Systems Topology Diagram">
      <svg
        viewBox="0 0 500 400"
        className="h-full max-h-[380px] w-full max-w-[480px] stroke-neutral-700"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Grid Accent */}
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#262626" />
        </pattern>
        <rect width="500" height="400" fill="url(#grid)" opacity="0.3" />

        {/* Inter-Node Connections */}
        <line x1="250" y1="200" x2="120" y2="120" stroke="#404040" strokeWidth="1.5" strokeDasharray="4 4" />
        <line x1="250" y1="200" x2="380" y2="120" stroke="#404040" strokeWidth="1.5" strokeDasharray="4 4" />
        <line x1="250" y1="200" x2="140" y2="300" stroke="#404040" strokeWidth="1.5" strokeDasharray="4 4" />
        <line x1="250" y1="200" x2="360" y2="300" stroke="#404040" strokeWidth="1.5" strokeDasharray="4 4" />
        <line x1="120" y1="120" x2="380" y2="120" stroke="#262626" strokeWidth="1" />
        <line x1="140" y1="300" x2="360" y2="300" stroke="#262626" strokeWidth="1" />

        {/* Central Leader Node (Node-C) */}
        <circle cx="250" cy="200" r="28" fill="#171717" stroke="#e5e5e5" strokeWidth="2" />
        <circle cx="250" cy="200" r="12" fill="#f5f5f5" />
        <text x="250" y="242" textAnchor="middle" fill="#f5f5f5" fontSize="11" fontFamily="monospace">
          LEADER (Node-C)
        </text>
        <text x="250" y="256" textAnchor="middle" fill="#a3a3a3" fontSize="9" fontFamily="monospace">
          Term: 0x04 | Quorum: Active
        </text>

        {/* Follower Replica A */}
        <circle cx="120" cy="120" r="18" fill="#0d0d0d" stroke="#737373" strokeWidth="1.5" />
        <text x="120" y="152" textAnchor="middle" fill="#d4d4d4" fontSize="10" fontFamily="monospace">
          Replica-A
        </text>

        {/* Follower Replica B */}
        <circle cx="380" cy="120" r="18" fill="#0d0d0d" stroke="#737373" strokeWidth="1.5" />
        <text x="380" y="152" textAnchor="middle" fill="#d4d4d4" fontSize="10" fontFamily="monospace">
          Replica-B
        </text>

        {/* Follower Replica D */}
        <circle cx="140" cy="300" r="18" fill="#0d0d0d" stroke="#737373" strokeWidth="1.5" />
        <text x="140" y="332" textAnchor="middle" fill="#d4d4d4" fontSize="10" fontFamily="monospace">
          Replica-D
        </text>

        {/* Follower Replica E */}
        <circle cx="360" cy="300" r="18" fill="#0d0d0d" stroke="#737373" strokeWidth="1.5" />
        <text x="360" y="332" textAnchor="middle" fill="#d4d4d4" fontSize="10" fontFamily="monospace">
          Replica-E
        </text>

        {/* Telemetry Annotation */}
        <rect x="15" y="15" width="160" height="42" rx="4" fill="#0f0f0f" stroke="#262626" />
        <text x="25" y="32" fill="#10b981" fontSize="9" fontFamily="monospace">
          ● TOPOLOGY: 5-NODE CLUSTER
        </text>
        <text x="25" y="47" fill="#a3a3a3" fontSize="8" fontFamily="monospace">
          Consensus: Majority (3/5)
        </text>
      </svg>
    </div>
  );
}
