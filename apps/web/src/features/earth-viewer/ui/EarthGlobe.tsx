'use client';

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { EARTH_CONFIG } from '@features/earth-viewer/model';
import { GlobeLines } from '@features/earth-viewer/ui/GlobeLines';
import { FlightDots } from '@features/earth-viewer/ui/FlightDots';
import { FlightTrack } from '@features/earth-viewer/ui/FlightTrack';
import { FlightHUD } from '@features/earth-viewer/ui/FlightHUD';
import { useFlights } from '@/shared/hooks/useFlights';
import type { IFlightState } from '@/shared/types/flight';
import { Button, Logo } from '@/shared/ui';

interface IEarthGroupProps {
  states: IFlightState[];
  selectedFlight: IFlightState | null;
  onSelect: (flight: IFlightState | null) => void;
  isRotating: boolean;
}

function EarthGroup({ states, selectedFlight, onSelect, isRotating }: IEarthGroupProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    if (groupRef.current && isRotating) {
      groupRef.current.rotation.y += delta * EARTH_CONFIG.rotation.speed;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 지구 본체 - 어두운 네이비 */}
      <mesh>
        <sphereGeometry args={[EARTH_CONFIG.radius, EARTH_CONFIG.segments, EARTH_CONFIG.segments]} />
        <meshBasicMaterial color={EARTH_CONFIG.colors.ocean} />
      </mesh>

      {/* 위경도 격자선 */}
      {/* <mesh>
        <sphereGeometry args={[EARTH_CONFIG.radius + 0.003, 24, 12]} />
        <meshBasicMaterial
          color={EARTH_CONFIG.colors.wireframe}
          wireframe
          transparent
          opacity={EARTH_CONFIG.material.wireframeOpacity}
        />
      </mesh> */}

      {/* 대기층 글로우 (BackSide로 안쪽에서 바깥쪽으로 빛남) */}
      <mesh>
        <sphereGeometry args={[EARTH_CONFIG.radius + 0.1, EARTH_CONFIG.segments, EARTH_CONFIG.segments]} />
        <meshBasicMaterial
          color={EARTH_CONFIG.colors.glow}
          transparent
          opacity={EARTH_CONFIG.material.glowOpacity}
          side={THREE.BackSide}
        />
      </mesh>

      {/* GeoJSON 대륙 경계선 */}
      <GlobeLines />

      {/* 실시간 항공기 */}
      <FlightDots states={states} onSelect={onSelect} />

      {/* 선택된 항공기 동선 */}
      {selectedFlight && <FlightTrack state={selectedFlight} />}
    </group>
  );
}

export function EarthGlobe() {
  const flightData = useFlights();
  const states = flightData?.states ?? [];
  const [selectedFlight, setSelectedFlight] = useState<IFlightState | null>(null);
  const [isRotating, setIsRotating] = useState(true);

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: EARTH_CONFIG.camera.position, fov: EARTH_CONFIG.camera.fov }}
        gl={{ antialias: true }}
        style={{ width: '100%', height: '100%' }}
        onPointerMissed={() => setSelectedFlight(null)}
      >
        <color attach="background" args={[EARTH_CONFIG.colors.background]} />
        <ambientLight intensity={EARTH_CONFIG.lights.ambient.intensity} />

        {/* 별 배경 */}
        <Stars
          radius={EARTH_CONFIG.stars.radius}
          depth={EARTH_CONFIG.stars.depth}
          count={EARTH_CONFIG.stars.count}
          factor={EARTH_CONFIG.stars.factor}
          saturation={EARTH_CONFIG.stars.saturation}
          // fade
          speed={EARTH_CONFIG.stars.speed}
        />

        <EarthGroup
          states={states}
          selectedFlight={selectedFlight}
          onSelect={setSelectedFlight}
          isRotating={isRotating}
        />

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

      <Logo className="absolute top-4 left-4 z-10" />

      <FlightHUD data={flightData} />

      <Button
        onClick={() => setIsRotating((v) => !v)}
        className="absolute bottom-4 right-4 z-10 font-mono"
      >
        {isRotating ? '⏸ 회전 정지' : '▶ 회전 시작'}
      </Button>
    </div>
  );
}
