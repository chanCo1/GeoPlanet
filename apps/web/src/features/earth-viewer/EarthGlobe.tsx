'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

function EarthMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);

  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.08;
    }
    if (wireRef.current) {
      wireRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <>
      {/* 지구 본체 */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshPhongMaterial
          color={new THREE.Color('#1a6ba0')}
          specular={new THREE.Color('#4fc3f7')}
          shininess={15}
          emissive={new THREE.Color('#0a2a4a')}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* 위경도 격자선 */}
      <mesh ref={wireRef}>
        <sphereGeometry args={[2.01, 24, 24]} />
        <meshBasicMaterial
          color="#4fc3f7"
          wireframe
          transparent
          opacity={0.06}
        />
      </mesh>

      {/* 대기층 글로우 */}
      {/* <mesh>
        <sphereGeometry args={[2.15, 64, 64]} />
        <meshBasicMaterial
          color="#1a6ba0"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh> */}
    </>
  );
}

export function EarthGlobe() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 45 }}
      gl={{ antialias: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={['#0b0e11']} />

      {/* 조명 */}
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 3, 5]} intensity={1.8} color="#ffffff" />
      <directionalLight position={[-5, -2, -3]} intensity={0.15} color="#4fc3f7" />

      {/* 별 배경 */}
      <Stars radius={100} depth={50} count={6000} factor={4} saturation={0} fade speed={0.5} />

      <EarthMesh />

      {/* 마우스 회전 / 줌 */}
      <OrbitControls
        enableZoom
        enablePan={false}
        minDistance={3.5}
        maxDistance={12}
        autoRotate={false}
        zoomSpeed={0.6}
        rotateSpeed={0.5}
      />
    </Canvas>
  );
}
