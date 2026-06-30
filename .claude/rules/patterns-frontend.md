---
paths:
  - "/apps/web/**"
---

# 프론트엔드 패턴 가이드

## API 호출 패턴

### Entity 레벨 API (`src/entities/*/api.ts`)

```typescript
// entities/user/api.ts
export async function getUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) throw new Error(`Failed to fetch user: ${id}`);
  return response.json();
}

export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  const response = await fetch(`/api/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to update user: ${id}`);
  return response.json();
}
```

**규칙**:
- ✅ 데이터 엔티티별로 API 함수 분류
- ✅ 명시적 타입 반환
- ✅ 에러 처리 (throw)
- ✅ JSDoc 주석으로 문서화

### Feature 레벨 훅 (`src/features/*/hooks.ts`)

```typescript
// features/user-profile/hooks.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { getUser, updateUser } from '@entities/user/api';

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId),
    staleTime: 1000 * 60 * 5, // 5분
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; updates: Partial<User> }) =>
      updateUser(data.id, data.updates),
    onSuccess: (user) => {
      queryClient.setQueryData(['user', user.id], user);
    },
  });
}
```

**규칙**:
- ✅ React Query 사용 (서버 상태)
- ✅ 재사용 가능한 훅으로 캡슐화
- ✅ Zustand는 클라이언트 상태만
- ✅ `staleTime`, `cacheTime` 설정

## 커스텀 훅 패턴

### Shared 훅 (`src/shared/hooks/`)

```typescript
// shared/hooks/useAsync.ts
export function useAsync<T>(
  fn: () => Promise<T>,
  deps: any[],
) {
  const [state, setState] = useState({
    data: null as T | null,
    loading: true,
    error: null as Error | null,
  });

  useEffect(() => {
    fn()
      .then(data => setState({ data, loading: false, error: null }))
      .catch(error => setState({ data: null, loading: false, error }));
  }, deps);

  return state;
}
```

**규칙**:
- ✅ `shared/hooks/`에 배치 (모든 feature에서 사용 가능)
- ✅ `use`로 시작하는 이름
- ✅ 명시적 타입 정의
- ✅ 비즈니스 로직 없음

### Feature 훅 (`src/features/*/hooks.ts`)

```typescript
// features/map-viewer/hooks.ts
export function useMapZoom(initialZoom: number = 10) {
  const [zoom, setZoom] = useState(initialZoom);

  const handleZoomIn = useCallback(() => {
    setZoom(z => Math.min(z + 1, 20));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(z => Math.max(z - 1, 1));
  }, []);

  return { zoom, handleZoomIn, handleZoomOut };
}
```

**규칙**:
- ✅ Feature 전용 로직만 포함
- ✅ 다른 feature에서 import 불가
- ✅ `useCallback`으로 최적화

## 에러 처리 패턴

```typescript
// features/user-profile/useUserProfile.ts
export function useUserProfile(userId: string) {
  const [error, setError] = useState<Error | null>(null);

  const query = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      try {
        return await getUser(userId);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        throw error;
      }
    },
  });

  return { ...query, error: error || query.error };
}
```

---

**다음**: 상태 관리 패턴
