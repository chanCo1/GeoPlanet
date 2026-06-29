# ✅ 설정 체크리스트

GeoPlanet 개발 환경 구축 완료 상태를 확인하세요.

## 🎯 기본 설정 완료

- [x] pnpm 워크스페이스 구성
- [x] Turborepo 파이프라인 설정
- [x] TypeScript Strict 모드 (루트)
- [x] .gitignore 설정
- [x] ESLint 설정 (각 앱)

## 📦 프론트엔드 (apps/web)

- [x] Next.js 14 (App Router)
- [x] Tailwind CSS + PostCSS
- [x] Zustand 스토어
- [x] React Query 설정
- [x] Three.js 라이브러리
- [x] GSAP 애니메이션
- [x] FSD 구조 (6계층)
  - [x] src/app/ - Next.js 라우터
  - [x] src/pages/ - 페이지 템플릿
  - [x] src/widgets/ - 복합 위젯
  - [x] src/features/ - 기능 모듈
  - [x] src/entities/ - 도메인 모델
  - [x] src/shared/ - 공유 계층

## 🔌 백엔드 (apps/server)

- [x] NestJS 프레임워크
- [x] Socket.io WebSocket
- [x] @nestjs/schedule (스케줄링)
- [x] class-validator (검증)
- [x] Gateway 모듈 (WebSocket)
- [x] CORS 설정
- [x] 헬스 체크 엔드포인트

## 📚 문서 및 가이드

- [x] CLAUDE.md - 프로젝트 가이드
- [x] README.md - 프로젝트 개요
- [x] README-setup.md - 설정 가이드
- [x] STRUCTURE.txt - 구조 시각화
- [x] .claude/rules/ - 모든 규칙 (200줄 이하)
  - [x] architecture.md - FSD/모듈 구조
  - [x] commits.md - Conventional Commits
  - [x] coding-standards-frontend.md
  - [x] coding-standards-backend.md
  - [x] conditional-rules.md
  - [x] documentation.md
  - [x] tdd-frontend.md
  - [x] tdd-backend.md

## 🚀 다음 단계

### 1단계: 로컬 설정

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local
cp apps/server/.env.example apps/server/.env.local
```

### 2단계: 개발 서버 시작

```bash
pnpm dev
```

### 3단계: 검증

```bash
pnpm type-check
pnpm lint
pnpm test
```

## 📋 개발 규칙 확인

- [x] **한글 문서**: 모든 .md는 한글로만 작성
- [x] **200줄 제한**: .claude/ 내 모든 파일은 200줄 이하
- [x] **TDD 필수**: 테스트 먼저 작성
- [x] **FSD 준수**: 계층 아래로만 임포트
- [x] **Conventional Commits**: 커밋 메시지 형식
- [x] **TypeScript Strict**: 전역 적용

## 🔍 환경 변수

**필수 설정**:
- [ ] apps/web/.env.local 생성
- [ ] apps/server/.env.local 생성

**프론트엔드** (apps/web/.env.local):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ENABLE_3D_MAP=true
```

**백엔드** (apps/server/.env.local):
```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## 💡 주요 명령어

```bash
pnpm install          # 의존성 설치
pnpm dev              # 개발 모드 (모든 앱)
pnpm build            # 프로덕션 빌드
pnpm type-check      # TypeScript 타입 검사
pnpm lint            # 린팅
pnpm test            # 테스트 실행
```

## ✨ 준비 상태

| 항목 | 상태 | 비고 |
|------|------|------|
| 환경 구축 | ✅ | 완료 |
| 문서 | ✅ | 한글 + 200줄 제한 |
| 규칙 | ✅ | TDD, FSD, 조건부 규칙 |
| 의존성 | ⏳ | `pnpm install` 필요 |
| 개발 | 🚀 | 시작 가능 |

---

**상태**: 🟢 배포 가능 (의존성 설치 후)

시작: `pnpm install && pnpm dev`
