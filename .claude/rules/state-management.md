---
paths:
  - "/apps/web/**"
---

# 상태 관리 패턴

## 상태 종류별 관리 전략

### 1. 서버 상태 → React Query
데이터베이스, API 서버에서 온 데이터

```typescript
// features/user-profile/hooks.ts
import { useQuery } from '@tanstack/react-query';

export function useUserData(userId: string) {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => fetchUser(userId),
    staleTime: 1000 * 60 * 5, // 5분
  });
}
```

### 2. 클라이언트 상태 → Zustand
UI 토글, 필터, 포맷 설정 등

```typescript
// entities/ui/store.ts
import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  theme: 'dark',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setTheme: (theme) => set({ theme }),
}));
```

**규칙**:
- ✅ `entities/*/store.ts`에 배치 (모든 feature에서 사용 가능)
- ✅ 상태 인터페이스 정의
- ✅ 메서드와 상태 분리

### 3. 폼 상태 → React Hook Form
입력, 검증, 제출

```typescript
// features/user-edit/UserEditForm.tsx
import { useForm } from 'react-hook-form';

interface IEditFormData {
  name: string;
  email: string;
}

export function UserEditForm({ userId }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<IEditFormData>({
    defaultValues: async () => fetchUser(userId),
  });

  const onSubmit = async (data: IEditFormData) => {
    await updateUser(userId, data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name', { required: 'Name required' })} />
      {errors.name && <span>{errors.name.message}</span>}
    </form>
  );
}
```

**규칙**:
- ✅ 폼 전용 라이브러리 사용
- ✅ 검증 규칙 정의
- ✅ 에러 메시지 표시

## Zustand 저장소 구조

### Entity 저장소 (공유)
```typescript
// entities/user/store.ts
export const useUserStore = create<UserState>((set) => ({
  users: [],
  currentUser: null,
  setUsers: (users) => set({ users }),
  setCurrentUser: (user) => set({ currentUser: user }),
}));
```

### Feature 저장소 (선택적)
```typescript
// features/map-viewer/store.ts
export const useMapStore = create<MapState>((set) => ({
  zoom: 10,
  center: [0, 0],
  setZoom: (zoom) => set({ zoom }),
  setCenter: (center) => set({ center }),
}));
```

**규칙**:
- ✅ Entity 상태는 `entities/*/store.ts`
- ✅ Feature 전용 상태는 `features/*/store.ts`
- ✅ 상태는 단순 데이터만 (로직 없음)
- ✅ 비즈니스 로직은 훅에서 구현

## 상태 흐름

```
API 서버
   ↓ (React Query 캐싱)
서버 상태 (캐시)
   ↓ (동기화)
Entity Store (Zustand) ← 필요시만
   ↓ (사용)
Feature Hooks → Components
   ↓ (UI 상태)
Zustand Store (UI)
```

---

**다음**: 타입 정의 규칙
