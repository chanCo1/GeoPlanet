---
paths:
  - "/apps/web/**"
---

# 프론트엔드 코딩 표준

## TypeScript 규칙

### Strict 모드 (필수)

```typescript
// ❌ 나쁜 예
const data = JSON.parse(response);  // 암묵적 'any'

// ✅ 좋은 예
const data: Record<string, unknown> = JSON.parse(response);
```

### 타입 어노테이션
- 함수 파라미터와 반환 타입 항상 명시
- 인터페이스 우선 (객체 모양)
- `shared/types/`에서 타입 내보내기

## React 컴포넌트

```typescript
interface IProps {
  title: string;
  onClose: () => void;
}

export const Modal: FC<Props> = ({ title, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div>
      <h2>{title}</h2>
      <button onClick={onClose}>닫기</button>
    </div>
  );
};
```

## 훅 사용

- 컴포넌트 최상단에서만 호출
- `use` 접두사로 시작 (예: `useAsync`)
- `src/shared/hooks/`에 배치

## 상태 관리 (Zustand)

```typescript
export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

## 명명 규칙

```typescript
interface IUserProfile { }           // 인터페이스
type TUserStatus = 'active';          // 타입
const getUsername = () => { };       // 함수
const API_BASE_URL = 'http://...';   // 상수
```

## 파일 구성

**임포트 순서**:
1. 외부 패키지 (react, 라이브러리)
2. 상위 계층 임포트 (아래로만)
3. 로컬 임포트

**파일 명명**:
- 컴포넌트: `PascalCase` (UserProfile.tsx)
- 유틸리티: `camelCase` (formatDate.ts)
- 타입: `PascalCase` (User.ts)
- 스토어: `camelCase` (useUserStore.ts)

## FSD 계층 규칙

### shared/
- ❌ 다른 계층 임포트 금지
- ✅ 외부 라이브러리만 사용

### entities/
- ✅ shared 임포트 가능
- ❌ UI 컴포넌트 금지

### features/
- ✅ shared, entities 임포트 가능
- ❌ 다른 기능 임포트 금지

### widgets/
- ✅ shared, entities, features 임포트
- ❌ pages, app 임포트 금지

## 주석 작성

```typescript
// ✅ 좋은 예: 왜를 설명
// 속도 제한 처리를 위해 지수 백오프로 재시도
const delay = Math.pow(2, retryCount) * 1000;

// ❌ 나쁜 예: 무엇을 설명 (코드에서 명확함)
// count에 1 추가
count += 1;
```

## 공개 API 문서화

```typescript
/**
 * API에서 사용자 데이터 가져오기
 * @param id - 사용자 고유 식별자
 * @returns 사용자 데이터 Promise
 * @throws 사용자 없으면 NotFoundException
 */
export async function getUser(id: string): Promise<User> { }
```

## 성능

- React Query로 서버 상태 관리
- 메모이제이션 사용 (복잡 계산)
- 코드 분할 (기능 경계)
- 3D 컴포넌트는 지연 로드

---

**TDD 필수**: tdd-frontend.md 참조.
