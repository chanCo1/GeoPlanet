'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { EARTH_CONFIG } from '@features/earth-viewer/model';

function EarthMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);

  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * EARTH_CONFIG.rotation.speed;
    }
    if (wireRef.current) {
      wireRef.current.rotation.y += delta * EARTH_CONFIG.rotation.speed;
    }
  });

  return (
    <>
      {/* 지구 본체 */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[EARTH_CONFIG.radius, EARTH_CONFIG.segments, EARTH_CONFIG.segments]} />
        <meshPhongMaterial
          color={new THREE.Color(EARTH_CONFIG.colors.ocean)}
          specular={new THREE.Color(EARTH_CONFIG.colors.specular)}
          shininess={EARTH_CONFIG.material.shininess}
          emissive={new THREE.Color(EARTH_CONFIG.colors.emissive)}
          emissiveIntensity={EARTH_CONFIG.material.emissiveIntensity}
        />
      </mesh>

      {/* 위경도 격자선 */}
      <mesh ref={wireRef}>
        <sphereGeometry args={[EARTH_CONFIG.radius + 0.01, 24, 24]} />
        <meshBasicMaterial
          color={EARTH_CONFIG.colors.wireframe}
          wireframe
          transparent
          opacity={EARTH_CONFIG.material.wireframeOpacity}
        />
      </mesh>

      {/* 대기층 글로우 */}
      {/* <mesh>
        <sphereGeometry args={[EARTH_CONFIG.radius + 0.15, EARTH_CONFIG.segments, EARTH_CONFIG.segments]} />
        <meshBasicMaterial
          color={EARTH_CONFIG.colors.ocean}
          transparent
          opacity={EARTH_CONFIG.material.atmosphereOpacity}
          side={THREE.BackSide}
        />
      </mesh> */}
    </>
  );
}

export function EarthGlobe() {
  return (
    <Canvas
      camera={{ position: EARTH_CONFIG.camera.position, fov: EARTH_CONFIG.camera.fov }}
      gl={{ antialias: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={[EARTH_CONFIG.colors.background]} />

      {/* 조명 */}
      <ambientLight intensity={EARTH_CONFIG.lights.ambient.intensity} />
      {EARTH_CONFIG.lights.directional.map((light, idx) => (
        <directionalLight
          key={idx}
          position={light.position}
          intensity={light.intensity}
          color={light.color}
        />
      ))}

      {/* 별 배경 */}
      <Stars
        radius={EARTH_CONFIG.stars.radius}
        depth={EARTH_CONFIG.stars.depth}
        count={EARTH_CONFIG.stars.count}
        factor={EARTH_CONFIG.stars.factor}
        saturation={EARTH_CONFIG.stars.saturation}
        fade
        speed={EARTH_CONFIG.stars.speed}
      />

      <EarthMesh />

      {/* 마우스 회전 / 줌 */}
      <OrbitControls
        enableZoom={EARTH_CONFIG.controls.enableZoom}
        enablePan={EARTH_CONFIG.controls.enablePan}
        minDistance={EARTH_CONFIG.controls.minDistance}
        maxDistance={EARTH_CONFIG.controls.maxDistance}
        autoRotate={EARTH_CONFIG.controls.autoRotate}
        zoomSpeed={EARTH_CONFIG.controls.zoomSpeed}
        rotateSpeed={EARTH_CONFIG.controls.rotateSpeed}
      />
    </Canvas>
  );
}
