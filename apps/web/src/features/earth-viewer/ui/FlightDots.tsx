'use client';

import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { EARTH_CONFIG } from '@features/earth-viewer/model';
import type { IFlightState } from '@/shared/types/flight';

const MAX_FLIGHTS = 20000;
const DOT_RADIUS = EARTH_CONFIG.radius + 0.02;
const PLANE_W = 0.036; // 아이콘 가로 (날개폭)
const PLANE_H = 0.048; // 아이콘 세로 (동체 길이)
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

/**
 * 항공기 인스턴스 행렬 계산
 *   X = right, Y = 구 법선(하늘 방향), Z = 진행 방향(기수)
 */
function buildMatrix(
  lat: number,
  lng: number,
  trueTrack: number | null,
  out: THREE.Matrix4,
): void {
  const pos = latLngToVec3(lat, lng, DOT_RADIUS);
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

  const right = new THREE.Vector3().crossVectors(normal, forward).normalize();

  out.makeBasis(right, normal, forward);
  out.setPosition(pos);
}

/**
 * Canvas 2D API로 비행기 실루엣 텍스처 생성
 *
 * Three.js 텍스처는 캔버스 Y를 반전하므로
 * → 캔버스 상단(작은 Y) = UV Y=1 = 3D +Z(앞) = 기수 방향
 */
function createAirplaneTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = EARTH_CONFIG.colors.dot;

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.44;

  // 기수가 캔버스 상단(작은 Y)을 향하도록 그림
  ctx.beginPath();
  ctx.moveTo(cx,               cy - r * 0.90); // 기수 끝
  ctx.lineTo(cx + r * 0.10,   cy - r * 0.25); // 동체 오른쪽 앞
  ctx.lineTo(cx + r * 0.80,   cy + r * 0.08); // 오른쪽 날개 끝
  ctx.lineTo(cx + r * 0.10,   cy + r * 0.15); // 오른쪽 날개 루트 뒤
  ctx.lineTo(cx + r * 0.35,   cy + r * 0.72); // 오른쪽 꼬리날개 끝
  ctx.lineTo(cx + r * 0.10,   cy + r * 0.58); // 오른쪽 꼬리날개 안쪽
  ctx.lineTo(cx - r * 0.10,   cy + r * 0.58); // 왼쪽 꼬리날개 안쪽
  ctx.lineTo(cx - r * 0.35,   cy + r * 0.72); // 왼쪽 꼬리날개 끝
  ctx.lineTo(cx - r * 0.10,   cy + r * 0.15); // 왼쪽 날개 루트 뒤
  ctx.lineTo(cx - r * 0.80,   cy + r * 0.08); // 왼쪽 날개 끝
  ctx.lineTo(cx - r * 0.10,   cy - r * 0.25); // 동체 왼쪽 앞
  ctx.closePath();
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

interface IProps {
  states: IFlightState[];
  onSelect: (flight: IFlightState | null) => void;
}

export function FlightDots({ states, onSelect }: IProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const matrix = useMemo(() => new THREE.Matrix4(), []);
  const validRef = useRef<IFlightState[]>([]);

  // PlaneGeometry: 기본은 XY 평면 → rotateX(90°)로 XZ 평면(구 표면에 평행)으로 변환
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(PLANE_W, PLANE_H);
    geo.rotateX(Math.PI / 2);
    return geo;
  }, []);

  const texture = useMemo(() => createAirplaneTexture(), []);

  useEffect(() => {
    if (!meshRef.current) return;

    const valid = states.filter(
      (s) => s.latitude !== null && s.longitude !== null && !s.onGround,
    );
    validRef.current = valid;
    const count = Math.min(valid.length, MAX_FLIGHTS);

    for (let i = 0; i < count; i++) {
      const s = valid[i];
      buildMatrix(s.latitude!, s.longitude!, s.trueTrack, matrix);
      meshRef.current.setMatrixAt(i, matrix);
    }

    meshRef.current.count = count;
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [states, matrix]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, MAX_FLIGHTS]}
      onClick={(e) => {
        e.stopPropagation();
        if (e.instanceId !== undefined) {
          onSelect(validRef.current[e.instanceId] ?? null);
        }
      }}
    >
      <primitive object={geometry} attach="geometry" />
      <meshBasicMaterial
        map={texture}
        transparent
        alphaTest={0.1}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
