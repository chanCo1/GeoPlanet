'use client';

import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { EARTH_CONFIG } from '@features/earth-viewer/model';
import type { IFlightState } from '@/shared/types/flight';

const MAX_FLIGHTS = 20000;
const DOT_RADIUS = EARTH_CONFIG.radius + 0.015;

function latLngToVec3(lat: number, lng: number, r: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  );
}

interface IProps {
  states: IFlightState[];
}

export function FlightDots({ states }: IProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (!meshRef.current) return;

    const valid = states.filter(
      (s) => s.latitude !== null && s.longitude !== null && !s.onGround,
    );
    const count = Math.min(valid.length, MAX_FLIGHTS);

    for (let i = 0; i < count; i++) {
      const s = valid[i];
      const pos = latLngToVec3(s.latitude!, s.longitude!, DOT_RADIUS);
      dummy.position.copy(pos);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.count = count;
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [states, dummy]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, MAX_FLIGHTS]}>
      <sphereGeometry args={[0.008, 4, 4]} />
      <meshBasicMaterial color={EARTH_CONFIG.colors.border} />
    </instancedMesh>
  );
}
