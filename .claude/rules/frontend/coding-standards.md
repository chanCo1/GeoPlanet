---
paths:
  - "/apps/web/**"
---

# 프론트엔드 코딩 표준

## React 컴포넌트

```typescript
interface IProps {
  title: string;
  onClose: () => void;
}

export const Modal: FC<IProps> = ({ title, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div>
      <h2>{title}</h2>
      <button onClick={onClose}>닫기</button>
    </div>
  );
};
```

## 훅 규칙

- `use` 접두사 필수
- 컴포넌트 최상단에서만 호출
- 공통 훅 → `src/shared/hooks/`
- Feature 전용 훅 → `features/*/hooks.ts`

## API 호출 패턴

### Entity 레벨 API
```typescript
// entities/user/api.ts
export async function getUser(id: string): Promise<IUser> {
  const response = await fetch(`/api/users/${id}`);
  if (response.status === 404) throw new NotFoundError('User not found', id);
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  return response.json();
}
```

### Feature 레벨 훅
```typescript
// features/user-profile/hooks.ts
export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId),
    staleTime: 1000 * 60 * 5,
  });
}
```

## 임포트 순서

1. 외부 패키지 (react, 라이브러리)
2. 내부 계층 (shared → entities → features)
3. 로컬 파일

## FSD 계층 임포트 규칙

```typescript
// features/map-viewer/ 에서

// ✅ 가능
import { Button } from '@/shared/ui/Button';
import { IUser } from '@/entities/user';

// ❌ 금지
import { Dashboard } from '@/app/dashboard';  // 상위 계층
import { Search } from '@/features/search';   // 다른 feature
```

## 주석 규칙

```typescript
// ✅ 좋은 예: 왜를 설명
// 속도 제한 처리를 위해 지수 백오프로 재시도
const delay = Math.pow(2, retryCount) * 1000;

// ❌ 나쁜 예: 무엇을 설명
// count에 1 추가
count += 1;
```
