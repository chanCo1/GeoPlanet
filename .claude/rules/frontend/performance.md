---
paths:
  - "/apps/web/**"
---

# 성능 최적화

## 렌더링 최적화

### React.memo
```typescript
// 자주 리렌더링되지 않는 복잡한 컴포넌트
export const UserCard = React.memo<IProps>(({ user, onClick }) => (
  <div onClick={() => onClick(user.id)}>{user.name}</div>
));
```

### useCallback / useMemo
```typescript
// 자식에 함수 전달 시
const handleClick = useCallback((id: string) => {
  console.log(id);
}, []);

// 복잡한 계산
const filtered = useMemo(
  () => users.filter(u => u.name.includes(searchText)),
  [users, searchText]
);
```

**주의**: 성능 문제가 확인된 경우에만 사용. 과도한 memoization은 오히려 비용 증가.

## 코드 분할 (동적 import)

```typescript
// ❌ 초기 번들에 포함
import { ThreeViewer } from '@/features/earth-viewer';

// ✅ 필요시 로드
const ThreeViewer = dynamic(
  () => import('@/features/earth-viewer'),
  { ssr: false, loading: () => <Skeleton /> }
);
```

**규칙**:
- ✅ 3D 컴포넌트 반드시 dynamic import
- ✅ 큰 라이브러리 사용 시 dynamic import 고려
- ✅ SSR 불필요한 컴포넌트는 `ssr: false`

## 상태 구독 최적화

```typescript
// ❌ 모든 상태 변경 시 리렌더링
const store = useStore();

// ✅ 필요한 부분만 구독
const value = useStore(state => state.value);
```

## 이미지

```typescript
// ✅ Next.js Image 사용
import Image from 'next/image';
<Image src="/photo.jpg" alt="설명" width={200} height={200} />
```

## 라이브러리

```typescript
// ❌ 전체 import
import _ from 'lodash';

// ✅ 필요한 것만
import { debounce } from 'lodash-es';
```

## 체크리스트

- [ ] 불필요한 리렌더링 확인 (React DevTools)
- [ ] 동적 import 적용 (3D, 큰 컴포넌트)
- [ ] 번들 크기 분석 (`next build` 결과)
- [ ] Web Vitals 확인 (LCP < 2.5s, CLS < 0.1)
