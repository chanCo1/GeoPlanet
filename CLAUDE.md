# GeoPlanet 프로젝트 가이드

## 🏗️ 프로젝트 구조

**pnpm Workspaces**와 **Turborepo**를 사용하는 모노레포입니다.

### 워크스페이스 레이아웃
```
GeoPlanet/
├── apps/
│   ├── web/          # Next.js 14 프론트엔드 (FSD 아키텍처)
│   └── server/       # NestJS 백엔드
├── packages/         # 공유 패키지 (향후 사용)
├── tsconfig.json     # 루트 TypeScript 설정 (Strict 모드)
├── turbo.json        # Turborepo 파이프라인 설정
└── package.json      # 루트 워크스페이스 설정
```

## 🎯 주요 명령어

```bash
# 의존성 설치
pnpm install
# 개발 모드 - 모든 앱 동시 실행
pnpm dev
# 프로덕션 빌드
pnpm build
# 린팅
pnpm lint
# 타입 체크
pnpm type-check
```

## 📦 프론트엔드 (apps/web)

### 아키텍처: Feature-Driven Design (FSD)

프론트엔드는 **FSD**를 엄격한 계층 분리로 따릅니다:

```
src/
├── app/              # Next.js App Router 레이아웃 & 페이지
├── pages/            # 레거시 페이지 컴포넌트 (필요시)
├── widgets/          # 여러 기능을 조합한 복합 위젯
├── features/         # 기능 모듈 (독립적인 비즈니스 로직)
├── entities/         # 도메인 엔티티 (핵심 데이터 모델)
└── shared/           # 공유 유틸리티, UI 컴포넌트, 훅
    ├── ui/           # 재사용 가능한 UI 컴포넌트
    ├── hooks/        # 커스텀 React 훅
    ├── utils/        # 유틸리티 함수
    └── types/        # 타입 정의
```

### 기술 스택
- **프레임워크**: Next.js 14 (App Router)
- **스타일링**: Tailwind CSS
- **상태 관리**: Zustand
- **데이터 페칭**: @tanstack/react-query
- **서버 통신**: Axios
- **3D 그래픽**: @react-three/fiber, @react-three/drei, Three.js
- **애니메이션**: GSAP

### TypeScript
- **Strict 모드**: 전역 적용
- **경로 별칭**: `@/*` → `src/*`, `@features/*` → `src/features/*` 등
- **엄격한 타입 체킹**: 모든 파일은 완전히 타입 지정되어야 함

## 🔌 백엔드 (apps/server)

### 아키텍처

구조화된 모듈 구조를 가진 모듈식 NestJS 애플리케이션:

```
src/
├── modules/          # 기능 모듈
│   └── gateway/      # WebSocket 게이트웨이
├── common/           # 공유 유틸리티, 데코레이터, 필터
├── config/           # 설정 파일
├── main.ts           # 애플리케이션 부트스트랩
└── app.module.ts     # 루트 모듈
```

### 기술 스택
- **프레임워크**: NestJS
- **실시간**: Socket.io WebSocket 지원
- **스케줄링**: @nestjs/schedule (크론 작업)
- **검증**: class-validator, class-transformer

### TypeScript
- **Strict 모드**: 전역 적용
- **경로 별칭**: `@/*` → `src/*`, `@modules/*` → `src/modules/*` 등
- **데코레이터**: 전체 데코레이터 지원 필요

## 🔧 개발 워크플로우

### 로컬 개발

1. **의존성 설치**:
   ```bash
   pnpm install
   ```

2. **개발 서버 시작**:
   ```bash
   pnpm dev
   ```
   - 프론트엔드: http://localhost:3000
   - 백엔드: http://localhost:3001

3. **타입 체킹 실행**:
   ```bash
   pnpm type-check
   ```

### 프로덕션 빌드

```bash
pnpm build
```

실행 내용:
- 프론트엔드: `next build` (`.next/`로 출력)
- 백엔드: `nest build` (`dist/`로 출력)

## ✅ 코드 품질 표준

### TypeScript Strict 모드

모든 코드는 TypeScript Strict 모드 설정을 준수해야 함:
- ✅ 암묵적 `any` 금지
- ✅ Strict null 체크
- ✅ Strict 함수 타입
- ✅ 사용하지 않는 변수/파라미터 금지
- ✅ 명시적 반환 타입

### 명명 규칙

- **컴포넌트**: PascalCase (예: `UserProfile.tsx`)
- **유틸리티**: camelCase (예: `formatDate.ts`)
- **타입/인터페이스**: PascalCase (예: `IUserData`)
- **상수**: UPPER_SNAKE_CASE (예: `API_BASE_URL`)

### 모듈 경계 (FSD)

프론트엔드의 계층 경계를 존중:
- ✅ `shared/`는 어디서나 임포트 가능
- ✅ `entities/`는 `features/`, `widgets/`, `pages/`, `app/`에서만 임포트 가능
- ✅ `features/`는 `widgets/`, `pages/`, `app/`에서만 임포트 가능
- ✅ `widgets/`는 `pages/`, `app/`에서만 임포트 가능
- ✅ `pages/`는 `app/`에서만 임포트 가능
- ❌ 순환 임포트 금지
- ❌ 상향 의존성 금지

## 🚀 Turborepo 파이프라인

작업은 의존성 그래프로 최적화됨:

```json
{
  "build": {
    "dependsOn": ["^build"],    // 먼저 의존성 빌드
    "outputs": ["dist/**", ".next/**"],
    "cache": true
  },
  "dev": {
    "cache": false,
    "persistent": true          // 계속 실행
  }
}
```

## 📝 환경 변수

각 앱에서 `.env.local` 파일 생성:

### 프론트엔드 (apps/web/.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 백엔드 (apps/server/.env.local)
```
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

## 🔍 린팅 & 타입 체킹

- **프론트엔드**: Next.js 프리셋과 함께 ESLint
- **백엔드**: TypeScript 프리셋과 함께 ESLint
- **둘 다**: 완전한 TypeScript 타입 체킹

규칙은 각 앱 레벨의 `.eslintrc.json`에 정의됨.

## 📚 추가 리소스

`.claude/rules/`에서 확인 (모두 200줄 이하):
- 아키텍처 가이드
- 커밋 규칙
- 코딩 표준 (프론트/백)
- TDD 규칙 (프론트/백)
- 조건부 규칙
- 문서화 규칙
