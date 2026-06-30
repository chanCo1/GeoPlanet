---
paths:
  - "/"
---

# TypeScript 타입 규칙

## 네이밍 규칙

```typescript
interface IUserProfile { }           // 인터페이스 → I 접두사
type TUserStatus = 'active';         // 타입 → T 접두사
const API_BASE_URL = 'http://...';   // 상수 → UPPER_SNAKE_CASE
class UserService { }                // 클래스 → PascalCase
const getUsername = () => { };       // 함수 → camelCase
```

## Strict 모드 필수

```typescript
// ❌ 암묵적 any 금지
const data = JSON.parse(response);

// ✅ 명시적 타입
const data: Record<string, unknown> = JSON.parse(response);

// ❌ 반환 타입 생략 금지
async function getUsers() { ... }

// ✅ 명시적 반환 타입
async function getUsers(): Promise<IUser[]> { ... }
```

## 전역 타입 vs 로컬 타입

### 전역 (`src/shared/types/`)
여러 feature에서 사용되는 도메인 모델

```typescript
// shared/types/user.ts
export interface IUser {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// shared/types/index.ts
export * from './user';
export * from './location';
```

### 로컬
feature/component 전용 타입은 해당 파일 내에 정의

```typescript
// features/user-profile/UserProfile.tsx
interface IUserProfileProps {
  userId: string;
  onClose?: () => void;
}
```

**규칙**:
- ✅ 여러 곳에서 사용 → `shared/types/`
- ✅ 한 곳에서만 사용 → 해당 파일 내부
- ❌ 불필요한 전역 타입 생성 금지

## DTO vs 모델

```typescript
// DTO: API 요청/응답 형식
interface IUserResponseDTO {
  id: string;
  createdAt: string; // ISO string
}

// Model: 앱 내부 형식
interface IUser {
  id: string;
  createdAt: Date; // JS Date
}

// 변환
function dtoToModel(dto: IUserResponseDTO): IUser {
  return { ...dto, createdAt: new Date(dto.createdAt) };
}
```

## 파일 명명

- 컴포넌트: `PascalCase` (UserProfile.tsx)
- 유틸리티: `camelCase` (formatDate.ts)
- 타입: `PascalCase` (User.ts)
