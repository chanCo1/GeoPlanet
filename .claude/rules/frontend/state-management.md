---
paths:
  - "/apps/web/**"
---

# 상태 관리

## 상태 종류별 전략

| 상태 종류 | 도구 | 위치 |
|---|---|---|
| 서버 상태 (API 데이터) | React Query | `features/*/hooks.ts` |
| 클라이언트 상태 (UI) | Zustand | `entities/*/store.ts` |
| 폼 상태 | React Hook Form | 컴포넌트 내 |
| 로컬 상태 (단순 토글) | useState | 컴포넌트 내 |

## React Query (서버 상태)

```typescript
// features/user-profile/hooks.ts
export function useUserData(userId: string) {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => fetchUser(userId),
    staleTime: 1000 * 60 * 5,   // 5분
    gcTime: 1000 * 60 * 10,     // 10분
    retry: 1,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; updates: Partial<IUser> }) =>
      updateUser(data.id, data.updates),
    onSuccess: (user) => {
      queryClient.setQueryData(['users', user.id], user);
    },
  });
}
```

## Zustand (클라이언트 상태)

```typescript
// entities/ui/store.ts
interface IUIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<IUIState>((set) => ({
  sidebarOpen: true,
  theme: 'dark',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setTheme: (theme) => set({ theme }),
}));
```

### 구독 최적화

```typescript
// ❌ 전체 구독 (불필요한 리렌더링)
const store = useUIStore();

// ✅ 필요한 상태만 구독
const sidebarOpen = useUIStore(state => state.sidebarOpen);
const toggleSidebar = useUIStore(state => state.toggleSidebar);
```

## 규칙

- ✅ Entity 상태 → `entities/*/store.ts`
- ✅ Feature 전용 상태 → `features/*/store.ts` (선택적)
- ✅ 병렬 요청 선호 (`Promise.all`)
- ❌ 서버 데이터를 Zustand에 저장 금지 (React Query 사용)
