---
paths:
  - "/apps/web/**"
---

# 성능 최적화 가이드

## 1. 렌더링 최적화

### React.memo (컴포넌트)
```typescript
// 자주 리렌더링되지 않는 컴포넌트
interface IUserCardProps {
  user: IUser;
  onClick: (id: string) => void;
}

export const UserCard = React.memo<IUserCardProps>(
  ({ user, onClick }) => (
    <div onClick={() => onClick(user.id)}>
      <h3>{user.name}</h3>
    </div>
  )
);
```

**언제 사용**:
- ✅ 복잡한 계산이 있는 컴포넌트
- ✅ 정적 props 대부분 변하지 않음
- ✅ 성능 프로필링으로 확인된 느린 컴포넌트

**주의**:
- ❌ 과도한 memoization (props 비교 비용 > 렌더링 비용)
- ❌ inline 객체/함수 (매번 새로 생성)

### useCallback (함수)
```typescript
export function UserList() {
  const [users, setUsers] = useState<IUser[]>([]);

  // ❌ 나쁜 예: 매번 새로운 함수 생성
  const handleClick = (id: string) => {
    console.log(id);
  };

  // ✅ 좋은 예: 의존성 없으면 한 번만 생성
  const handleClick = useCallback((id: string) => {
    console.log(id);
  }, []);

  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} onClick={handleClick} />
      ))}
    </div>
  );
}
```

### useMemo (값)
```typescript
export function UserFilter({ users, searchText }: Props) {
  // ❌ 나쁜 예: 매번 필터링
  const filtered = users.filter(u => u.name.includes(searchText));

  // ✅ 좋은 예: searchText 변경시만 필터링
  const filtered = useMemo(
    () => users.filter(u => u.name.includes(searchText)),
    [users, searchText]
  );

  return <div>{filtered.length} results</div>;
}
```

## 2. 상태 관리 최적화

### 상태 구조화
```typescript
// ❌ 나쁜 예: 모든 상태가 한 번에 업데이트
const useAppStore = create((set) => ({
  user: null,
  users: [],
  filters: {},
  modal: false,
  updateAll: (data) => set(data),
}));

// ✅ 좋은 예: 관심사 분리
const useUserStore = create((set) => ({
  user: null,
  updateUser: (user) => set({ user }),
}));

const useListStore = create((set) => ({
  users: [],
  filters: {},
  setUsers: (users) => set({ users }),
  setFilters: (filters) => set({ filters }),
}));
```

### 구독 최적화 (Zustand)
```typescript
// ❌ 모든 상태 변경시 리렌더링
const store = useUserStore();

// ✅ 필요한 부분만 구독
const user = useUserStore(state => state.user);
const setUser = useUserStore(state => state.setUser);
```

## 3. 번들 크기 최적화

### 동적 import (코드 분할)
```typescript
// ❌ 나쁜 예: 초기 번들에 포함
import { ThreeViewer } from '@/features/earth-viewer';

export function HomePage() {
  return <ThreeViewer />;
}

// ✅ 좋은 예: 필요시 로드
const ThreeViewer = dynamic(
  () => import('@/features/earth-viewer'),
  { loading: () => <Skeleton /> }
);

export function HomePage() {
  return <ThreeViewer />;
}
```

### 라이브러리 최적화
```typescript
// ❌ 전체 라이브러리 import
import _ from 'lodash';

// ✅ 필요한 함수만 import
import { debounce } from 'lodash-es';
```

## 4. 이미지 최적화

### Next.js Image
```typescript
// ❌ 나쁜 예: 기본 img 태그
<img src="/user-photo.jpg" />

// ✅ 좋은 예: Next.js Image (최적화)
import Image from 'next/image';

<Image
  src="/user-photo.jpg"
  alt="User"
  width={200}
  height={200}
  priority={false}
/>
```

## 5. 데이터 페칭 최적화

### React Query 설정
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,      // 5분 (fresh 상태)
      gcTime: 1000 * 60 * 10,        // 10분 (캐시 유지)
      retry: 1,                       // 1회 재시도
      retryDelay: 1000,              // 1초 대기
    },
  },
});
```

### 쿼리 배칭
```typescript
// ❌ 나쁜 예: 순차적 요청
const user = await getUser(id);
const posts = await getPosts(userId);

// ✅ 좋은 예: 병렬 요청
const [user, posts] = await Promise.all([
  getUser(id),
  getPosts(userId),
]);
```

## 6. 렌더링 최적화 (3D)

### Three.js 성능
```typescript
// features/earth-viewer/ui/EarthGlobe.tsx
<Canvas
  gl={{ antialias: true, powerPreference: 'high-performance' }}
  performance={{ min: 0.5, max: 1 }}
>
  {/* Three.js는 자동 성능 조절 */}
</Canvas>
```

## 성능 측정

### 프로파일링
```bash
# Chrome DevTools Performance 탭
1. 녹음 시작
2. 사용자 행동 수행
3. 녹음 중지
4. 병목 분석
```

### Web Vitals
```typescript
// pages/_app.tsx
import { reportWebVitals } from 'next/web-vitals';

reportWebVitals((metric) => {
  console.log(metric);
  // {
  //   name: 'LCP',
  //   value: 2500,
  //   rating: 'good',
  // }
});
```

## 체크리스트

- [ ] 불필요한 렌더링 제거 (memo, callback)
- [ ] 상태 구조 최적화 (분리)
- [ ] 동적 import 활용 (코드 분할)
- [ ] 이미지 최적화 (Next.js Image)
- [ ] React Query 캐시 설정
- [ ] 번들 크기 분석
- [ ] Web Vitals 모니터링

---

**다음**: 배포 체크리스트
