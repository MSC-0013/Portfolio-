'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';

export interface ClusterTelemetry {
  crashedNodes: string[];
  leaderId: string;
  term: number;
  hasQuorum: boolean;
  activeCount: number;
}

interface DistributedMeshProps {
  pointerParallax?: { x: number; y: number };
  topologyMode?: 'mesh' | 'star' | 'ring';
  onTelemetryChange?: (telemetry: ClusterTelemetry) => void;
  resetSignal?: number;
}

interface NodeConfig {
  id: string;
  name: string;
  baseRole: 'LEADER' | 'REPLICA';
}

const INITIAL_NODES: NodeConfig[] = [
  { id: 'node-c', name: 'Node-C', baseRole: 'LEADER' },
  { id: 'node-a', name: 'Node-A', baseRole: 'REPLICA' },
  { id: 'node-b', name: 'Node-B', baseRole: 'REPLICA' },
  { id: 'node-d', name: 'Node-D', baseRole: 'REPLICA' },
  { id: 'node-e', name: 'Node-E', baseRole: 'REPLICA' },
];

export default function DistributedMesh({
  pointerParallax = { x: 0, y: 0 },
  topologyMode = 'mesh',
  onTelemetryChange,
  resetSignal = 0,
}: DistributedMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Group>(null);
  const lineGeoRef = useRef<THREE.BufferGeometry>(null);

  // Cluster Consensus State
  const [crashedNodes, setCrashedNodes] = useState<string[]>([]);
  const [leaderId, setLeaderId] = useState<string>('node-c');
  const [term, setTerm] = useState<number>(4);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Reset trigger from HUD
  useEffect(() => {
    if (resetSignal > 0) {
      setCrashedNodes([]);
      setLeaderId('node-c');
      setTerm((prev) => prev + 1);
    }
  }, [resetSignal]);

  // Topology target coordinates
  const targetPositions = useMemo(() => {
    const targets: Record<string, THREE.Vector3> = {};

    if (topologyMode === 'star') {
      // Leader in center, 4 followers arranged orthogonally
      targets['node-c'] = new THREE.Vector3(0, 0, 0.1);
      targets['node-a'] = new THREE.Vector3(-1.9, 0, 0);
      targets['node-b'] = new THREE.Vector3(0, 1.7, 0);
      targets['node-d'] = new THREE.Vector3(1.9, 0, 0);
      targets['node-e'] = new THREE.Vector3(0, -1.7, 0);
    } else if (topologyMode === 'ring') {
      // 5-node pentagon ring
      const r = 1.85;
      INITIAL_NODES.forEach((n, i) => {
        const theta = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        const x = r * Math.cos(theta);
        const y = r * Math.sin(theta);
        const z = Math.sin(theta * 2) * 0.25;
        targets[n.id] = new THREE.Vector3(x, y, z);
      });
    } else {
      // Default organic distributed mesh with 3D depth
      targets['node-c'] = new THREE.Vector3(0, 0.1, 0.35); // Center leader with depth
      targets['node-a'] = new THREE.Vector3(-1.75, 1.15, 0.1);
      targets['node-b'] = new THREE.Vector3(1.75, 1.2, -0.2);
      targets['node-d'] = new THREE.Vector3(-1.45, -1.25, -0.3);
      targets['node-e'] = new THREE.Vector3(1.45, -1.2, 0.2);
    }

    return targets;
  }, [topologyMode]);

  // Persistent dynamic 3D positions for smooth lerping
  const dynamicPositions = useRef<Record<string, THREE.Vector3>>({
    'node-c': new THREE.Vector3(0, 0.1, 0.35),
    'node-a': new THREE.Vector3(-1.75, 1.15, 0.1),
    'node-b': new THREE.Vector3(1.75, 1.2, -0.2),
    'node-d': new THREE.Vector3(-1.45, -1.25, -0.3),
    'node-e': new THREE.Vector3(1.45, -1.2, 0.2),
  });

  // Calculate active nodes & majority quorum status
  const activeCount = INITIAL_NODES.length - crashedNodes.length;
  const hasQuorum = activeCount >= 3; // Majority of 5 is >= 3

  // Notify parent component of live telemetry
  useEffect(() => {
    onTelemetryChange?.({
      crashedNodes,
      leaderId,
      term,
      hasQuorum,
      activeCount,
    });
  }, [crashedNodes, leaderId, term, hasQuorum, activeCount, onTelemetryChange]);

  // Click node handler: crash or revive
  const handleNodeClick = (e: ThreeEvent<MouseEvent>, clickedId: string) => {
    e.stopPropagation();

    setCrashedNodes((prev) => {
      const isCrashed = prev.includes(clickedId);
      const nextCrashed = isCrashed
        ? prev.filter((id) => id !== clickedId)
        : [...prev, clickedId];

      // If crashed node was leader, elect a new leader among remaining healthy nodes
      if (!isCrashed && clickedId === leaderId) {
        const remainingHealthy = INITIAL_NODES.filter(
          (n) => !nextCrashed.includes(n.id)
        );
        if (remainingHealthy.length >= 3) {
          // Majority election succeeds
          setLeaderId(remainingHealthy[0].id);
          setTerm((t) => t + 1);
        } else if (remainingHealthy.length > 0) {
          // No quorum, cannot complete term election but assign provisional candidate
          setLeaderId(remainingHealthy[0].id);
        } else {
          setLeaderId('');
        }
      } else if (isCrashed && leaderId === '') {
        // Recovered node can become leader if no leader exists
        setLeaderId(clickedId);
      }

      return nextCrashed;
    });
  };

  // Connection line pair indices
  const connectionPairs = useMemo(() => {
    // Inter-node links across the 5 nodes
    return [
      ['node-c', 'node-a'],
      ['node-c', 'node-b'],
      ['node-c', 'node-d'],
      ['node-c', 'node-e'],
      ['node-a', 'node-b'],
      ['node-a', 'node-d'],
      ['node-b', 'node-e'],
      ['node-d', 'node-e'],
    ];
  }, []);

  // Buffer array for line segment vertices (8 lines * 2 points * 3 coords = 48 floats)
  const linePositions = useMemo(() => new Float32Array(connectionPairs.length * 2 * 3), [connectionPairs]);

  // 3D Pulses data structures
  const pulsesCount = 6;
  const pulseMeshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // 3D Frame Loop: smooth morphing, parallax tilt, line geometry sync, and pulse packets
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // 1. Damped position lerping for all 5 nodes
    INITIAL_NODES.forEach((node) => {
      const current = dynamicPositions.current[node.id];
      const target = targetPositions[node.id];
      if (current && target) {
        current.lerp(target, 0.08);
      }
    });

    // 2. Update line segment vertices dynamically from dynamicPositions
    if (lineGeoRef.current) {
      let offset = 0;
      connectionPairs.forEach(([id1, id2]) => {
        const p1 = dynamicPositions.current[id1];
        const p2 = dynamicPositions.current[id2];
        if (p1 && p2) {
          linePositions[offset++] = p1.x;
          linePositions[offset++] = p1.y;
          linePositions[offset++] = p1.z;
          linePositions[offset++] = p2.x;
          linePositions[offset++] = p2.y;
          linePositions[offset++] = p2.z;
        }
      });
      lineGeoRef.current.setAttribute(
        'position',
        new THREE.BufferAttribute(linePositions, 3)
      );
    }

    // 3. Gentle parallax and continuous orbital rotation
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        pointerParallax.x * 0.55 + Math.sin(t * 0.3) * 0.1,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -pointerParallax.y * 0.55 + Math.cos(t * 0.25) * 0.08,
        0.05
      );
    }

    // 4. Orbital rings around current leader
    if (ringRef.current && leaderId && dynamicPositions.current[leaderId]) {
      const leaderPos = dynamicPositions.current[leaderId];
      ringRef.current.position.copy(leaderPos);
      ringRef.current.rotation.z = t * 0.35;
      ringRef.current.rotation.x = Math.PI / 3 + Math.sin(t * 0.2) * 0.1;
    }

    // 5. Animate traveling log replication pulse packets (only if cluster has quorum and leader is active)
    if (pulseMeshRef.current && hasQuorum && leaderId && !crashedNodes.includes(leaderId)) {
      const leaderPos = dynamicPositions.current[leaderId];
      const healthyFollowers = INITIAL_NODES.filter(
        (n) => n.id !== leaderId && !crashedNodes.includes(n.id)
      );

      for (let i = 0; i < pulsesCount; i++) {
        if (healthyFollowers.length > 0) {
          const targetFollower = healthyFollowers[i % healthyFollowers.length];
          const followerPos = dynamicPositions.current[targetFollower.id];
          const progress = ((t * 1.1 + (i * 1.0) / pulsesCount) % 1.0);

          if (leaderPos && followerPos) {
            const currentPos = new THREE.Vector3().lerpVectors(leaderPos, followerPos, progress);
            dummy.position.copy(currentPos);
            const scale = Math.sin(progress * Math.PI) * 0.08 + 0.04;
            dummy.scale.set(scale, scale, scale);
            dummy.updateMatrix();
            pulseMeshRef.current.setMatrixAt(i, dummy.matrix);
          }
        } else {
          // Hide pulse
          dummy.scale.set(0, 0, 0);
          dummy.updateMatrix();
          pulseMeshRef.current.setMatrixAt(i, dummy.matrix);
        }
      }
      pulseMeshRef.current.instanceMatrix.needsUpdate = true;
    } else if (pulseMeshRef.current) {
      // Hide all pulses when leader is down or quorum is lost
      for (let i = 0; i < pulsesCount; i++) {
        dummy.scale.set(0, 0, 0);
        dummy.updateMatrix();
        pulseMeshRef.current.setMatrixAt(i, dummy.matrix);
      }
      pulseMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 3D Directional & Point Lighting for Rich Depth & High Contrast */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 5, 6]} intensity={1.5} />
      <directionalLight position={[-4, -3, 2]} intensity={0.6} />
      <pointLight position={[0, 0, 4]} intensity={2.0} color="#ffffff" distance={10} />

      {/* Dynamic Orbital Rings around Leader Node */}
      {hasQuorum && leaderId && (
        <group ref={ringRef}>
          <mesh>
            <ringGeometry args={[0.55, 0.58, 48]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.65} side={THREE.DoubleSide} />
          </mesh>
          <mesh rotation={[Math.PI / 4, 0, 0]}>
            <ringGeometry args={[0.78, 0.81, 48]} />
            <meshBasicMaterial color="#94a3b8" transparent opacity={0.4} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {/* Dynamic 3D Inter-Node Connection Lines */}
      <lineSegments>
        <bufferGeometry ref={lineGeoRef} />
        <lineBasicMaterial
          color={hasQuorum ? '#525252' : '#7f1d1d'}
          transparent
          opacity={hasQuorum ? 0.75 : 0.4}
          linewidth={1.5}
        />
      </lineSegments>

      {/* 5 Distinct Nodes */}
      {INITIAL_NODES.map((node) => {
        const isLeader = node.id === leaderId;
        const isCrashed = crashedNodes.includes(node.id);
        const isHovered = hoveredNode === node.id;
        const pos = dynamicPositions.current[node.id] || targetPositions[node.id];

        // Dimensions
        const coreRadius = isLeader ? 0.36 : 0.24;
        const cageRadius = coreRadius * 1.5;

        // Visual Colors
        const coreColor = isCrashed
          ? '#ef4444' // Hazard Red
          : isLeader
          ? '#ffffff' // High-contrast Brilliant White
          : '#cbd5e1'; // Metallic Silver Follower

        const cageColor = isCrashed
          ? '#991b1b'
          : isLeader
          ? '#ffffff'
          : '#64748b';

        return (
          <group
            key={node.id}
            position={pos}
            onClick={(e) => handleNodeClick(e, node.id)}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredNode(node.id);
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              setHoveredNode(null);
              document.body.style.cursor = 'default';
            }}
          >
            {/* Inner Solid Shaded Sphere with True 3D Specular Shading */}
            <mesh>
              <sphereGeometry args={[coreRadius, 32, 32]} />
              <meshStandardMaterial
                color={coreColor}
                roughness={0.15}
                metalness={0.85}
                emissive={isCrashed ? '#7f1d1d' : isLeader ? '#333333' : '#000000'}
                emissiveIntensity={isCrashed ? 0.8 : isLeader ? 0.4 : 0.0}
              />
            </mesh>

            {/* Outer Protective Wireframe Geometric Cage */}
            <mesh>
              <icosahedronGeometry args={[cageRadius, 1]} />
              <meshBasicMaterial
                color={cageColor}
                wireframe={true}
                transparent
                opacity={isHovered ? 0.9 : isLeader ? 0.55 : 0.3}
              />
            </mesh>

            {/* Extra Outer Pulsing Halo when Hovered or Leader */}
            {(isLeader || isHovered) && !isCrashed && (
              <mesh>
                <dodecahedronGeometry args={[cageRadius * 1.25, 0]} />
                <meshBasicMaterial
                  color="#ffffff"
                  wireframe
                  transparent
                  opacity={isHovered ? 0.7 : 0.25}
                />
              </mesh>
            )}

            {/* Crashed X Indicator Halo */}
            {isCrashed && (
              <mesh>
                <ringGeometry args={[coreRadius * 1.6, coreRadius * 1.8, 24]} />
                <meshBasicMaterial color="#ef4444" transparent opacity={0.8} side={THREE.DoubleSide} />
              </mesh>
            )}
          </group>
        );
      })}

      {/* Traveling 3D Log Replication Pulse Packets */}
      <instancedMesh ref={pulseMeshRef} args={[undefined, undefined, pulsesCount]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </instancedMesh>
    </group>
  );
}
