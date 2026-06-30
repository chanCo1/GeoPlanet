---
paths:
  - "/"
---

# 아키텍처 가이드

## 프론트엔드 아키텍처: Feature-Driven Design (FSD)

### 계층 정의

#### 1. **공유 계층** (`src/shared/`)
기초 계층 - 다른 계층에 대한 의존성 없음.

```
shared/
├── ui/               # 순수 UI 컴포넌트 (Button, Card, Modal 등)
├── hooks/            # 커스텀 React 훅 (useWindowSize, useAsync 등)
├── utils/            # 순수 유틸리티 함수
├── types/            # 전역 타입 정의
└── config/           # 상수 및 설정
```

**규칙**:
- ✅ 외부 라이브러리에만 의존
- ✅ 모든 기능에서 재사용 가능
- ✅ 비즈니스 로직 없음
- ❌ 다른 계층에서 임포트 불가

#### 2. **엔티티 계층** (`src/entities/`)
도메인 엔티티 및 모델 - 핵심 데이터 구조를 나타냄.

```
entities/
├── user/
│   ├── model.ts      # User 타입/인터페이스
│   ├── api.ts        # User API 호출
│   └── store.ts      # User Zustand 스토어
└── location/
    ├── model.ts
    ├── api.ts
    └── store.ts
```

**규칙**:
- ✅ `shared/`에서 임포트 가능
- ✅ 데이터 모델, API 호출, 스토어 포함
- ✅ UI 컴포넌트 없음
- ❌ features, widgets, pages, app에서 임포트 불가

#### 3. **기능 계층** (`src/features/`)
비즈니스 로직 및 기능 구현 - 독립적이고 캡슐화된 기능.

**단순한 구조** (권장 - 대부분의 경우):
```
features/
├── earth-viewer/
│   └── EarthGlobe.tsx         # 컴포넌트
├── search/
│   └── SearchBox.tsx
└── map-viewer/
    └── MapViewer.tsx
```

**복잡한 구조** (필요시만 - 파일이 많을 때):
```
features/
└── complex-feature/
    ├── ComplexComponent.tsx    # 메인 컴포넌트
    ├── model.ts               # 상태/타입
    ├── api.ts                 # API 호출
    ├── hooks.ts               # 커스텀 훅
    └── index.ts               # 공개 API
```

**규칙**:
- ✅ `shared/`와 `entities/`에서 임포트 가능
- ✅ 독립적인 기능 모듈
- ✅ 자체 포함된 비즈니스 로직
- ✅ 필요시만 하위 폴더 구성 (`ui/`, `hooks/` 등)
- ❌ 다른 기능, 위젯, 페이지, 앱에서 임포트 불가
- ❌ 순환 의존성 없음
- ❌ 과도한 폴더 계층화 금지 (단순할 수록 좋음)

#### 4. **위젯 계층** (`src/widgets/`)
여러 기능을 조합한 복합 위젯 - 페이지 섹션.

```
widgets/
├── map-section/
│   ├── MapSection.tsx     # 기능 조합
│   └── index.ts
└── sidebar/
    ├── Sidebar.tsx
    └── index.ts
```

**규칙**:
- ✅ `shared/`, `entities/`, `features/`에서 임포트 가능
- ✅ 기능을 더 큰 단위로 구성
- ✅ 최소한의 비즈니스 로직
- ❌ pages, app에서 임포트 불가

#### 5. **페이지 계층** (`src/pages/`)
페이지 컴포넌트 - 라우트 레이아웃.

**규칙**:
- ✅ 모든 계층에서 임포트 가능
- ✅ 위젯 조합
- ✅ 라우트 특화 레이아웃

#### 6. **앱 계층** (`src/app/`)
Next.js App Router - 레이아웃 및 루트 페이지.

**규칙**:
- ✅ 모든 계층에서 임포트 가능
- ✅ 루트 레이아웃 설정
- ✅ 전역 프로바이더

### 의존성 방향

```
    app/
     ↑
   pages/
     ↑
  widgets/
     ↑
  features/ ←→ entities/
     ↑         ↑
   shared/ ←───┘
     ↑
외부 라이브러리
```

**황금 규칙**: 항상 계층을 아래로 임포트하고, 절대 위로 임포트하지 않음.

## 백엔드 아키텍처: 모듈식 NestJS

### 모듈 구성

```
src/
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   └── dto/
│   ├── users/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.module.ts
│   │   └── dto/
│   └── gateway/
│       ├── events.gateway.ts
│       └── gateway.module.ts
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   └── interceptors/
├── config/
│   └── database.config.ts
└── app.module.ts
```

### 모듈 규칙

- **자체 포함**: 각 모듈은 독립적이어야 함
- **단일 책임**: 모듈당 하나의 주요 기능
- **공개 API**: 모듈을 통해 서비스 및 DTO 내보내기
- **의존성 주입**: 모든 의존성에 NestJS DI 사용

## 공유 라이브러리 패키지 (향후)

`packages/`에 공유 패키지 추가 시:

```
packages/
├── shared-types/       # 공유 TypeScript 타입
├── shared-utils/       # 공유 유틸리티
└── ui-components/      # 컴포넌트 라이브러리
```

각 패키지는:
- ✅ 루트를 확장하는 자체 `tsconfig.json` 필요
- ✅ `package.json`에 의존성 선언
- ✅ TypeScript strict 모드 준수
- ✅ `index.ts`를 통한 타입 내보내기

---

커밋 규칙은 `.claude/rules/commits.md` 참조.
