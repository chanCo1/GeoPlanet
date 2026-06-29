# GeoPlanet 프로젝트 메모리

## 프로젝트 설정
- **모노레포 타입**: pnpm Workspaces + Turborepo
- **TypeScript**: Strict 모드 루트에서 활성화, 모든 앱이 상속
- **패키지 관리자**: pnpm (모든 스크립트는 pnpm 사용)
- **문서 언어**: 모든 MD 파일은 **한글로만 작성**

## 프론트엔드 (apps/web)
- **프레임워크**: Next.js 14 (App Router)
- **스타일링**: Tailwind CSS + PostCSS
- **상태**: Zustand + React Query (@tanstack/react-query)
- **3D 그래픽**: @react-three/fiber, @react-three/drei, Three.js
- **애니메이션**: GSAP
- **아키텍처**: FSD (Feature-Driven Design) 6계층 구조:
  - app/ (Next.js App Router)
  - pages/ (레거시 페이지)
  - widgets/ (복합 컴포넌트)
  - features/ (기능 모듈)
  - entities/ (도메인 엔티티)
  - shared/ (유틸리티, UI, 훅, 타입)
- **경로 별칭**: @/* → src/*, @features/* → src/features/* 등
- **개발 포트**: 3000
- **테스트**: Jest + React Testing Library (TDD 방식)

## 백엔드 (apps/server)
- **프레임워크**: NestJS
- **WebSocket**: Socket.io via @nestjs/platform-socket.io
- **스케줄링**: @nestjs/schedule
- **검증**: class-validator, class-transformer
- **아키텍처**: 모듈식 (auth, users, gateway 등)
- **경로 별칭**: @/* → src/*, @modules/* → src/modules/* 등
- **개발 포트**: 3001
- **테스트**: Jest + @nestjs/testing (TDD 방식)

## 루트 설정
- **turbo.json**: build/dev/lint/type-check 작업 파이프라인
- **tsconfig.json**: 루트 strict TypeScript 설정 (모든 앱 상속)
- **package.json**: Turborepo 스크립트 (pnpm run dev, pnpm run build)

## 핵심 스크립트
- `pnpm install` - 의존성 설치
- `pnpm dev` - 모든 앱 개발 모드 실행 (Turborepo)
- `pnpm build` - 모든 앱 빌드 (Turborepo)
- `pnpm type-check` - 모든 앱 타입 체킹
- `pnpm test` - 모든 앱 테스트 실행

## 가이드 파일 (.claude/rules/ - 200줄 이하)
- **architecture.md** (181줄) - FSD 계층 & 모듈 규칙
- **commits.md** (137줄) - Conventional Commits 형식
- **coding-standards-frontend.md** (165줄) - React/TypeScript 표준
- **coding-standards-backend.md** (168줄) - NestJS/TypeScript 표준
- **conditional-rules.md** (185줄) - 조건별 적용 규칙
- **documentation.md** (200줄) - 문서 작성 규칙 (한글 필수)
- **tdd-frontend.md** (195줄) - 프론트엔드 TDD 규칙
- **tdd-backend.md** (200줄) - 백엔드 TDD 규칙
- **CLAUDE.md** - 메인 프로젝트 가이드

## 핵심 규칙 요약

### 1. 문서 작성 (필수)
- ✅ 모든 MD: **한글로만 작성**
- ✅ .claude/ 파일: **200줄 이하**
- ✅ 초과 시: 파일 분리 (예: frontend/backend)

### 2. TDD (필수)
- ❌ 테스트 없이 코드 추가 금지
- ✅ RED → GREEN → REFACTOR 순서
- ✅ 테스트 통과 후에만 커밋

### 3. 조건부 규칙
- 의존성 추가: pnpm만 사용
- 다른 앱 코드: packages/ 공유 패키지
- 프로덕션 배포: type-check, lint, test, build 모두 통과
- FSD: 아래로만 임포트 (위로 절대 불가)

### 4. 커밋 규칙
- 형식: `<type>(<scope>): <subject>`
- 타입: feat, fix, docs, style, refactor, perf, test, chore, ci
- 범위: web/*, server/*, repo 등
