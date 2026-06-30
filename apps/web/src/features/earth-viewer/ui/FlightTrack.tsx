'use client';

import { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { EARTH_CONFIG } from '@features/earth-viewer/model';
import type { IFlightState } from '@/shared/types/flight';

const TRACK_R = EARTH_CONFIG.radius + 0.025;
const STEP = 0.004;   // 라디안/포인트 (≈ 25km)
const PAST = 20;      // 과거 포인트 수
const FUTURE = 40;    // 미래 포인트 수
const WORLD_UP = new THREE.Vector3(0, 1, 0);

function latLngToVec3(lat: number, lng: number, r: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  );
}

function computeTrack(state: IFlightState): { past: THREE.Vector3[]; future: THREE.Vector3[] } {
  const { latitude: lat, longitude: lng, trueTrack } = state;
  if (lat === null || lng === null) return { past: [], future: [] };

  const pos = latLngToVec3(lat, lng, TRACK_R);
  const normal = pos.clone().normalize();

  const east = new THREE.Vector3().crossVectors(WORLD_UP, normal);
  if (east.lengthSq() < 0.0001) east.set(1, 0, 0);
  east.normalize();
  const north = new THREE.Vector3().crossVectors(normal, east).normalize();

  const trackRad = ((trueTrack ?? 0) * Math.PI) / 180;
  const forward = new THREE.Vector3()
    .addScaledVector(north, Math.cos(trackRad))
    .addScaledVector(east, Math.sin(trackRad))
    .normalize();

  // 대원(great circle) 위의 t 라디안 지점 계산
  // p(t) = (cos(t) * normal + sin(t) * forward) * R
  const toPoint = (t: number) =>
    new THREE.Vector3()
      .addScaledVector(normal, Math.cos(t))
      .addScaledVector(forward, Math.sin(t))
      .multiplyScalar(TRACK_R);

  const past: THREE.Vector3[] = [];
  for (let i = PAST; i >= 0; i--) past.push(toPoint(-i * STEP));

  const future: THREE.Vector3[] = [];
  for (let i = 0; i <= FUTURE; i++) future.push(toPoint(i * STEP));

  return { past, future };
}

interface IProps {
  state: IFlightState;
}

export function FlightTrack({ state }: IProps) {
  const { past, future } = useMemo(() => computeTrack(state), [state]);

  const pastLine = useMemo(() => {
    if (!past.length) return null;
    const geo = new THREE.BufferGeometry().setFromPoints(past);
    const mat = new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.2 });
    return new THREE.Line(geo, mat);
  }, [past]);

  const futureLine = useMemo(() => {
    if (!future.length) return null;
    const geo = new THREE.BufferGeometry().setFromPoints(future);
    const mat = new THREE.LineBasicMaterial({
      color: EARTH_CONFIG.colors.border,
      transparent: true,
      opacity: 0.8,
    });
    return new THREE.Line(geo, mat);
  }, [future]);

  // geometry / material 정리
  useEffect(() => () => {
    pastLine?.geometry.dispose();
    (pastLine?.material as THREE.Material | undefined)?.dispose();
  }, [pastLine]);

  useEffect(() => () => {
    futureLine?.geometry.dispose();
    (futureLine?.material as THREE.Material | undefined)?.dispose();
  }, [futureLine]);

  if (!pastLine || !futureLine) return null;

  return (
    <group>
      <primitive object={pastLine} />
      <primitive object={futureLine} />
    </group>
  );
}
