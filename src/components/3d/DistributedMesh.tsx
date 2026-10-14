'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DistributedMeshProps {
  pointerParallax?: { x: number; y: number };
}

export default function DistributedMesh({ pointerParallax = { x: 0, y: 0 } }: DistributedMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const pulsesRef = useRef<THREE.InstancedMesh>(null);

  // Define 3D coordinates for a 5-node distributed consensus cluster
  const nodes = useMemo(() => [
    { id: 'leader', pos: new THREE.Vector3(0, 0, 0), size: 0.35, isLeader: true },
    { id: 'repA', pos: new THREE.Vector3(-2.2, 1.2, 0.4), size: 0.22, isLeader: false },
    { id: 'repB', pos: new THREE.Vector3(2.2, 1.4, -0.3), size: 0.22, isLeader: false },
    { id: 'repD', pos: new THREE.Vector3(-1.8, -1.6, -0.4), size: 0.22, isLeader: false },
    { id: 'repE', pos: new THREE.Vector3(1.9, -1.5, 0.5), size: 0.22, isLeader: false },
  ], []);

  // Compute connection line pairs
  const lineGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const leaderPos = nodes[0].pos;

    // Leader star connections
    for (let i = 1; i < nodes.length; i++) {
      points.push(leaderPos, nodes[i].pos);
    }
    // Inter-follower peer gossip connections
    points.push(nodes[1].pos, nodes[2].pos);
    points.push(nodes[1].pos, nodes[3].pos);
    points.push(nodes[2].pos, nodes[4].pos);
    points.push(nodes[3].pos, nodes[4].pos);

    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [nodes]);

  // Pulse animation along 4 primary paths from leader to followers
  const pulsePaths = useMemo(() => {
    return [
      { start: nodes[0].pos, end: nodes[1].pos },
      { start: nodes[0].pos, end: nodes[2].pos },
      { start: nodes[0].pos, end: nodes[3].pos },
      { start: nodes[0].pos, end: nodes[4].pos },
    ];
  }, [nodes]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Subtle group rotation and parallax tilt
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        pointerParallax.x * 0.4 + Math.sin(t * 0.2) * 0.1,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -pointerParallax.y * 0.4 + Math.cos(t * 0.2) * 0.08,
        0.05
      );
    }

    // Animate event pulses traveling along paths
    if (pulsesRef.current) {
      pulsePaths.forEach((path, i) => {
        const speed = 0.8 + (i % 2) * 0.2;
        const progress = ((t * speed + i * 0.25) % 1.0);
        const currentPos = new THREE.Vector3().lerpVectors(path.start, path.end, progress);

        dummy.position.copy(currentPos);
        const scale = Math.sin(progress * Math.PI) * 0.08 + 0.03;
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();

        pulsesRef.current!.setMatrixAt(i, dummy.matrix);
      });
      pulsesRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Inter-node Connection Lines */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#383838" transparent opacity={0.65} linewidth={1} />
      </lineSegments>

      {/* Nodes */}
      {nodes.map((node) => (
        <group key={node.id} position={node.pos}>
          {/* Inner core */}
          <mesh>
            <sphereGeometry args={[node.size, 24, 24]} />
            <meshBasicMaterial
              color={node.isLeader ? '#ffffff' : '#888888'}
              wireframe={false}
            />
          </mesh>

          {/* Wireframe outer perimeter */}
          <mesh>
            <sphereGeometry args={[node.size * 1.35, 12, 12]} />
            <meshBasicMaterial
              color={node.isLeader ? '#ffffff' : '#444444'}
              wireframe={true}
              transparent
              opacity={node.isLeader ? 0.35 : 0.18}
            />
          </mesh>
        </group>
      ))}

      {/* Traveling Event Pulses */}
      <instancedMesh ref={pulsesRef} args={[undefined, undefined, pulsePaths.length]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial color="#ffffff" />
      </instancedMesh>
    </group>
  );
}
