// 지구 3D 모델 설정 및 상수

export const EARTH_CONFIG = {
  // 기본 구성
  radius: 2,
  segments: 64,

  // 색상
  colors: {
    ocean: '#1a6ba0',
    specular: '#4fc3f7',
    emissive: '#0a2a4a',
    wireframe: '#4fc3f7',
    background: '#0b0e11',
  },

  // 재질 속성
  material: {
    shininess: 15,
    emissiveIntensity: 0.3,
    wireframeOpacity: 0.06,
    atmosphereOpacity: 0.08,
  },

  // 카메라
  camera: {
    position: [0, 0, 5.5] as [number, number, number],
    fov: 45,
  },

  // 회전
  rotation: {
    speed: 0.08,
  },

  // 조명
  lights: {
    ambient: { intensity: 0.15 },
    directional: [
      { position: [5, 3, 5] as [number, number, number], intensity: 1.8, color: '#ffffff' },
      { position: [-5, -2, -3] as [number, number, number], intensity: 0.15, color: '#4fc3f7' },
    ],
  },

  // 별 배경
  stars: {
    radius: 100,
    depth: 50,
    count: 6000,
    factor: 4,
    saturation: 0,
    speed: 0.5,
  },

  // OrbitControls
  controls: {
    enableZoom: true,
    enablePan: false,
    minDistance: 3.5,
    maxDistance: 12,
    autoRotate: false,
    zoomSpeed: 0.6,
    rotateSpeed: 0.5,
  },
};
