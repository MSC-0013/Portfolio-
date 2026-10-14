'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DistributedMeshProps {
  pointerParallax?: { x: number; y: number };
  topologyMode?: 'mesh' | 'star' | 'ring';
}

export default function DistributedMesh({
  pointerParallax = { x: 0, y: 0 },
  topologyMode = 'mesh',
}: DistributedMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ringGroupRef = useRef<THREE.Group>(null);
  const pulsesRef = useRef<THREE.InstancedMesh>(null);

  // 7 3D Nodes representing Leader, Replicas, Edge Ingress, and Storage
  const nodes = useMemo(() => [
    { id: 'leader', pos: new THREE.Vector3(0, 0.2, 0), size: 0.38, isLeader: true, label: 'LEADER' },
    { id: 'repA', pos: new THREE.Vector3(-2.2, 1.3, 0.6), size: 0.22, isLeader: false, label: 'REPLICA-A' },
    { id: 'repB', pos: new THREE.Vector3(2.2, 1.4, -0.4), size: 0.22, isLeader: false, label: 'REPLICA-B' },
    { id: 'repC', pos: new THREE.Vector3(-1.9, -1.4, -0.5), size: 0.22, isLeader: false, label: 'REPLICA-C' },
    { id: 'repD', pos: new THREE.Vector3(1.8, -1.5, 0.7), size: 0.22, isLeader: false, label: 'REPLICA-D' },
    { id: 'edgeGateway', pos: new THREE.Vector3(0, 2.5, -0.8), size: 0.26, isLeader: false, label: 'EDGE-GATEWAY' },
    { id: 'storage', pos: new THREE.Vector3(0, -2.4, 0.5), size: 0.25, isLeader: false, label: 'DATA-STORE' },
  ], []);

  // Compute 3D inter-node connection geometry
  const lineGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const leaderPos = nodes[0].pos;

    // Leader star connections
    for (let i = 1; i < nodes.length; i++) {
      points.push(leaderPos, nodes[i].pos);
    }

    if (topologyMode === 'mesh' || topologyMode === 'ring') {
      // Mesh peer connections
      points.push(nodes[1].pos, nodes[2].pos);
      points.push(nodes[1].pos, nodes[3].pos);
      points.push(nodes[2].pos, nodes[4].pos);
      points.push(nodes[3].pos, nodes[4].pos);
      points.push(nodes[5].pos, nodes[1].pos);
      points.push(nodes[5].pos, nodes[2].pos);
      points.push(nodes[6].pos, nodes[3].pos);
      points.push(nodes[6].pos, nodes[4].pos);
    }

    return new THREE.BufferGeometry().setFromPoints(points);
  }, [nodes, topologyMode]);

  // Traveling 3D event pulse pathways
  const pulsePaths = useMemo(() => {
    return [
      { start: nodes[5].pos, end: nodes[0].pos, speed: 1.2 }, // Ingress -> Leader
      { start: nodes[0].pos, end: nodes[1].pos, speed: 0.9 }, // Leader -> Replica A
      { start: nodes[0].pos, end: nodes[2].pos, speed: 1.0 }, // Leader -> Replica B
      { start: nodes[0].pos, end: nodes[3].pos, speed: 0.8 }, // Leader -> Replica C
      { start: nodes[0].pos, end: nodes[4].pos, speed: 1.1 }, // Leader -> Replica D
      { start: nodes[0].pos, end: nodes[6].pos, speed: 1.3 }, // Leader -> Store
    ];
  }, [nodes]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // 3D group smooth parallax and continuous idle rotation
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        pointerParallax.x * 0.65 + Math.sin(t * 0.25) * 0.15,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -pointerParallax.y * 0.65 + Math.cos(t * 0.25) * 0.12,
        0.05
      );
    }

    // Outer orbital rings slow spin
    if (ringGroupRef.current) {
      ringGroupRef.current.rotation.z = t * 0.1;
      ringGroupRef.current.rotation.x = Math.PI / 3 + Math.sin(t * 0.15) * 0.05;
    }

    // Animate traveling 3D pulse packets
    if (pulsesRef.current) {
      pulsePaths.forEach((path, i) => {
        const progress = ((t * path.speed + i * 0.2) % 1.0);
        const currentPos = new THREE.Vector3().lerpVectors(path.start, path.end, progress);

        dummy.position.copy(currentPos);
        const scale = Math.sin(progress * Math.PI) * 0.09 + 0.035;
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();

        pulsesRef.current!.setMatrixAt(i, dummy.matrix);
      });
      pulsesRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 3D Depth Orbital Rings around Leader Node */}
      <group ref={ringGroupRef} position={[0, 0.2, 0]}>
        <mesh>
          <ringGeometry args={[1.5, 1.52, 64]} />
          <meshBasicMaterial color="#4a4a4a" transparent opacity={0.35} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <ringGeometry args={[2.8, 2.82, 64]} />
          <meshBasicMaterial color="#333333" transparent opacity={0.25} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Inter-node 3D Connection Lines */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#4f4f4f" transparent opacity={0.7} linewidth={1} />
      </lineSegments>

      {/* 3D Nodes */}
      {nodes.map((node) => (
        <group key={node.id} position={node.pos}>
          {/* Inner solid sphere core */}
          <mesh>
            <sphereGeometry args={[node.size, 24, 24]} />
            <meshBasicMaterial
              color={node.isLeader ? '#ffffff' : '#999999'}
            />
          </mesh>

          {/* Wireframe outer perimeter halo */}
          <mesh>
            <sphereGeometry args={[node.size * 1.45, 14, 14]} />
            <meshBasicMaterial
              color={node.isLeader ? '#ffffff' : '#555555'}
              wireframe={true}
              transparent
              opacity={node.isLeader ? 0.45 : 0.25}
            />
          </mesh>

          {/* Leader Extra Geodesic Core */}
          {node.isLeader && (
            <mesh>
              <icosahedronGeometry args={[node.size * 1.85, 1]} />
              <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.25} />
            </mesh>
          )}
        </group>
      ))}

      {/* Traveling 3D Event Pulses */}
      <instancedMesh ref={pulsesRef} args={[undefined, undefined, pulsePaths.length]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </instancedMesh>
    </group>
  );
}
