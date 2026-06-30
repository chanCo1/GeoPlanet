// 지구 3D 모델 설정 및 상수

// 카스퍼스키 사이버맵 스타일 세계 지도 데이터 (Natural Earth - 공개 도메인)
export const GEO_URL =
  "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson";

export const EARTH_CONFIG = {
  // 기본 구성
  radius: 2,
  segments: 64,

  // 색상 (카스퍼스키 사이버맵 스타일)
  colors: {
    ocean: "#2b3139", // 매우 어두운 네이비 - 바다
    land: "#1e2329", // 대륙 내부 채우기 색상
    border: "#2dbdb6", // 형광 민트 시안 - 대륙 경계선
    glow: "#707a8a", // 파란 대기층 글로우
    wireframe: "#0a2a50", // 어두운 파란 위경도 격자
    background: "#030508", // 극도로 어두운 우주 배경
    dot: "#fcd535",
  },

  // 재질 속성
  material: {
    wireframeOpacity: 0.2,
    borderOpacity: 0.85,
    glowOpacity: 0.07,
  },

  // 카메라
  camera: {
    position: [0, 0, 7] as [number, number, number],
    fov: 45,
  },

  // 회전
  rotation: {
    speed: 0.08,
  },

  // 조명
  lights: {
    ambient: { intensity: 0.4 },
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
    minDistance: 3,
    maxDistance: 12,
    autoRotate: false,
    zoomSpeed: 0.6,
    rotateSpeed: 0.5,
  },
};
