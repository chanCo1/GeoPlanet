# GeoPlanet 프로젝트 메모리

## 프로젝트 설정
- **모노레포**: pnpm Workspaces + Turborepo
- **패키지 관리자**: pnpm (npm/yarn 금지)
- **TypeScript**: Strict 모드 전역 적용
- **문서 언어**: 모든 MD 파일은 한글로만 작성

## 프론트엔드 (apps/web)
- **프레임워크**: Next.js 14 (App Router)
- **스타일링**: Tailwind CSS
- **상태**: Zustand (클라이언트) + React Query (서버)
- **3D**: @react-three/fiber, @react-three/drei, Three.js
- **애니메이션**: GSAP
- **아키텍처**: FSD (shared → entities → features → widgets → app)
- **포트**: 3000

## 백엔드 (apps/server)
- **프레임워크**: NestJS
- **WebSocket**: Socket.io
- **검증**: class-validator, class-transformer
- **포트**: 3001

## 핵심 스크립트
```bash
pnpm install       # 의존성 설치
pnpm dev           # 전체 개발 서버 (3000 + 3001)
pnpm build         # 전체 빌드
pnpm type-check    # 타입 체크
pnpm test          # 전체 테스트
```

## 규칙 파일 구조 (.claude/rules/)

경로별 YAML paths 헤더로 해당 작업 시에만 로드됨:

```
.claude/rules/
├── shared/            # paths: ["/"] → 항상 로드
│   ├── architecture.md    # FSD + NestJS 아키텍처
│   ├── commits.md         # 커밋 규칙 (ADD/UPD/FIX/DEL)
│   ├── typing.md          # 타입 정의, 네이밍 규칙
│   ├── error-handling.md  # 프론트/백 에러 처리
│   ├── testing.md         # 테스트 구조 + TDD 원칙
│   ├── env.md             # 환경 변수 관리
│   └── deployment.md      # 배포 체크리스트
├── frontend/          # paths: ["/apps/web/**"]
│   ├── coding-standards.md  # React, FSD 임포트 규칙
│   ├── state-management.md  # Zustand, React Query
│   ├── tdd.md               # 프론트엔드 테스트 패턴
│   └── performance.md       # 렌더링, 번들 최적화
└── backend/           # paths: ["/apps/server/**"]
    ├── coding-standards.md  # NestJS 구조 규칙
    └── tdd.md               # 백엔드 테스트 패턴
```

**총 13개 파일 / 1,035줄** (기존 16개 / 2,500+ 줄 → 58% 축소)

## 핵심 규칙 요약

### 컴포넌트 분리
- 2개 이상 중복 사용되는 UI는 컴포넌트로 분리
- 2개 이상 중복 사용되는 함수도 유틸함수로 분리하여 적용

### 커밋
- 형식: `<type>: <subject>`
- 타입: `ADD` / `UPD` / `FIX` / `DEL`
- Claude 작성 시 `Co-Authored-By: Claude <noreply@anthropic.com>` 필수

### FSD 계층
- 아래로만 임포트 (위로 절대 금지)
- feature 내 구조는 단순할수록 좋음 (과도한 폴더 계층화 금지)

### TDD
- RED → GREEN → REFACTOR 순서
- 테스트 없이 커밋 금지

### 배포 전
- `pnpm type-check && pnpm lint && pnpm test && pnpm build` 모두 통과

## 구현된 기능

### 3D 지구 Globe (features/earth-viewer)
- `ui/EarthGlobe.tsx` - Three.js 컴포넌트
- `model.ts` - EARTH_CONFIG 설정 상수
- `index.ts` - 공개 API
- 기능: 자동 회전, 마우스 드래그, 줌, 별 배경
