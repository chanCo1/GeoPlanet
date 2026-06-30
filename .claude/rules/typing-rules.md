---
paths:
  - "/"
---

# TypeScript 타입 정의 규칙

## 전역 타입 vs 로컬 타입

### 전역 타입 (`src/shared/types/`)
여러 feature에서 사용되는 도메인 모델

```typescript
// shared/types/user.ts
export interface IUser {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface IUserFilter {
  search?: string;
  status?: 'active' | 'inactive';
}
```

**배치**:
- ✅ 엔티티별로 파일 분리 (`user.ts`, `location.ts`)
- ✅ `shared/types/index.ts`에서 재export

```typescript
// shared/types/index.ts
export * from './user';
export * from './location';
export * from './common';
```

### 로컬 타입
feature/component 전용 타입

```typescript
// features/user-profile/types.ts
export interface IUserProfileProps {
  userId: string;
  onClose?: () => void;
}

export interface IProfileEditState {
  isEditing: boolean;
  isSaving: boolean;
}
```

**규칙**:
- ✅ feature 내부 파일에 정의
- ✅ feature 외부로 export 불가
- ✅ 다른 feature에서 사용 필요시 → `shared/types/`로 이동

## 네이밍 규칙

### 인터페이스 (I 접두사)
```typescript
interface IUser { }          // 엔티티
interface IUserProps { }     // Props
interface IUserFilter { }    // 필터/쿼리
interface IUserStore { }     // 상태 저장소
```

### 타입 (T 접두사)
```typescript
type TUserStatus = 'active' | 'inactive';
type TUserRole = 'admin' | 'user' | 'guest';
type TDateString = string & { readonly __brand: 'DateString' };
```

### 상수 (UPPER_SNAKE_CASE)
```typescript
export const USER_ROLES = ['admin', 'user', 'guest'] as const;
export const DEFAULT_PAGE_SIZE = 20;
export const API_TIMEOUT = 5000;
```

## 타입 조직화

### 계층별 타입

**Shared** (`src/shared/types/`):
```
types/
├── user.ts          # IUser, IUserFilter
├── location.ts      # ILocation, ICoordinate
├── api.ts           # IApiResponse, IApiError
└── index.ts
```

**Entities** (`src/entities/user/`):
```
user/
├── model.ts         # IUser (export from shared)
├── api.ts           # API 함수
└── store.ts         # Store 타입
```

**Features** (`src/features/map-viewer/`):
```
map-viewer/
├── types.ts         # IMapViewerProps, IMapState
├── MapViewer.tsx
└── hooks.ts
```

## DTO vs 모델

### DTO (Data Transfer Object)
API 요청/응답 형식

```typescript
// api/dtos/user.ts
export interface ICreateUserDTO {
  name: string;
  email: string;
}

export interface IUserResponseDTO {
  id: string;
  name: string;
  email: string;
  createdAt: string; // ISO string
}
```

### 모델 (Domain Model)
애플리케이션 내부 사용 형식

```typescript
// shared/types/user.ts
export interface IUser {
  id: string;
  name: string;
  email: string;
  createdAt: Date; // JavaScript Date
}

// Conversion
export function dtoToModel(dto: IUserResponseDTO): IUser {
  return {
    ...dto,
    createdAt: new Date(dto.createdAt),
  };
}
```

**규칙**:
- ✅ DTO는 API 서버와 계약
- ✅ Model은 애플리케이션 내부 형식
- ✅ 변환 함수로 연결

## Strict 타입 패턴

### 암묵적 any 금지
```typescript
// ❌ 나쁜 예
const data = JSON.parse(response);

// ✅ 좋은 예
const data: Record<string, unknown> = JSON.parse(response);
```

### 명시적 반환 타입
```typescript
// ❌ 나쁜 예
export async function getUsers() {
  return fetch('/api/users').then(r => r.json());
}

// ✅ 좋은 예
export async function getUsers(): Promise<IUser[]> {
  const response = await fetch('/api/users');
  return response.json();
}
```

### 콜백 타입
```typescript
// ❌ 나쁜 예
interface IProps {
  onClick: any;
}

// ✅ 좋은 예
interface IProps {
  onClick: (id: string) => void;
}
```

---

**다음**: 에러 처리 패턴
