'use client';

import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { EARTH_CONFIG, GEO_URL } from '@features/earth-viewer/model';

type TPos = [number, number];

interface IGeoFeature {
  geometry:
    | { type: 'Polygon'; coordinates: TPos[][] }
    | { type: 'MultiPolygon'; coordinates: TPos[][][] };
}

interface IGeoData {
  features: IGeoFeature[];
}

const CANVAS_W = 4096;
const CANVAS_H = 2048;

// GeoJSON → Canvas 2D 텍스처 생성 (Equirectangular 투영)
function buildEarthTexture(data: IGeoData): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
  const ctx = canvas.getContext('2d')!;

  const toX = (lon: number) => ((lon + 180) / 360) * CANVAS_W;
  const toY = (lat: number) => ((90 - lat) / 180) * CANVAS_H;

  // 바다 배경
  ctx.fillStyle = EARTH_CONFIG.colors.ocean;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // 대륙 채우기 + 경계선
  for (const feature of data.features) {
    const { geometry } = feature;
    const polygons =
      geometry.type === 'Polygon'
        ? [geometry.coordinates]
        : geometry.coordinates;

    for (const polygon of polygons) {
      ctx.beginPath();
      for (const ring of polygon) {
        ctx.moveTo(toX(ring[0][0]), toY(ring[0][1]));
        for (let i = 1; i < ring.length; i++) {
          ctx.lineTo(toX(ring[i][0]), toY(ring[i][1]));
        }
        ctx.closePath();
      }
      // evenodd: 섬 속 호수 등 holes 자동 처리
      ctx.fillStyle = EARTH_CONFIG.colors.land;
      ctx.fill('evenodd');

      // 1. 외곽 glow (번지는 효과)
      ctx.strokeStyle = EARTH_CONFIG.colors.border;
      ctx.shadowColor = EARTH_CONFIG.colors.border;
      ctx.shadowBlur = 10;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 1;
      ctx.stroke();

      // 2. 선명한 선 (중심)
      ctx.shadowBlur = 4;
      ctx.lineWidth = 0.1;
      ctx.globalAlpha = 0.9;
      ctx.stroke();

      // 리셋
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  // mipmap 비활성화로 확대 시 선명도 유지
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  return tex;
}

export function GlobeLines() {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    let mounted = true;
    let tex: THREE.CanvasTexture | null = null;

    fetch(GEO_URL)
      .then(res => res.json())
      .then((data: IGeoData) => {
        if (!mounted) return;
        tex = buildEarthTexture(data);
        setTexture(tex);
      });

    return () => {
      mounted = false;
      tex?.dispose();
    };
  }, []);

  if (!texture) return null;

  return (
    <mesh>
      <sphereGeometry
        args={[EARTH_CONFIG.radius + 0.003, EARTH_CONFIG.segments, EARTH_CONFIG.segments]}
      />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}
