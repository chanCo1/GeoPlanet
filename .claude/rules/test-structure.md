---
paths:
  - "/"
---

# 테스트 구조 및 파일 위치

## 파일 배치

### 프론트엔드 (Jest + RTL)

```
src/
├── shared/
│   ├── hooks/
│   │   ├── useAsync.ts
│   │   └── useAsync.test.ts         ← 같은 폴더
│   └── utils/
│       ├── formatDate.ts
│       └── formatDate.test.ts
├── entities/
│   └── user/
│       ├── api.ts
│       ├── api.test.ts              ← 같은 폴더
│       └── store.test.ts
├── features/
│   └── user-profile/
│       ├── hooks.ts
│       ├── hooks.test.ts
│       ├── UserProfile.tsx
│       └── UserProfile.test.tsx
└── __tests__/                       ← 통합 테스트
    ├── integration/
    └── e2e/
```

**규칙**:
- ✅ 테스트 파일은 대상 파일과 같은 폴더
- ✅ 파일명: `*.test.ts` 또는 `*.spec.ts`
- ✅ 통합/E2E 테스트만 `__tests__/` 사용

### 백엔드 (Jest + Testing Library)

```
src/
├── modules/
│   └── users/
│       ├── users.service.ts
│       ├── users.service.test.ts    ← 같은 폴더
│       ├── users.controller.ts
│       ├── users.controller.test.ts
│       └── dto/
│           └── create-user.dto.ts
└── __tests__/
    ├── integration/
    └── e2e/
```

## 테스트 레벨

### 1. 유닛 테스트 (Unit)
단일 함수/메서드 테스트

```typescript
// shared/utils/formatDate.test.ts
describe('formatDate', () => {
  it('기본 형식으로 포매팅', () => {
    const result = formatDate(new Date('2024-01-15'));
    expect(result).toBe('2024-01-15');
  });

  it('잘못된 입력 처리', () => {
    expect(() => formatDate(null as any)).toThrow();
  });
});
```

### 2. 통합 테스트 (Integration)
여러 모듈/컴포넌트 상호작용

```typescript
// features/user-profile/UserProfile.test.tsx
describe('UserProfile', () => {
  it('사용자 데이터 로드 및 표시', async () => {
    // Mock API
    mock.get('/api/users/1', { body: { id: '1', name: 'John' } });

    render(<UserProfile userId="1" />);

    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
    });
  });
});
```

### 3. E2E 테스트 (End-to-End)
전체 사용자 플로우

```typescript
// __tests__/e2e/user-flow.test.ts
describe('사용자 프로필 수정 플로우', () => {
  it('프로필 페이지 → 수정 → 저장', async () => {
    // 복잡한 사용자 시나리오
  });
});
```

## 테스트 패턴

### API 테스트 (유닛)
```typescript
// entities/user/api.test.ts
describe('User API', () => {
  it('사용자 조회 성공', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => ({ id: '1', name: 'John' }),
      })
    );

    const result = await getUser('1');
    expect(result).toEqual({ id: '1', name: 'John' });
  });

  it('404 에러 처리', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ status: 404, ok: false })
    );

    await expect(getUser('999')).rejects.toThrow(NotFoundError);
  });
});
```

### 훅 테스트
```typescript
// features/map-viewer/useMapZoom.test.ts
import { renderHook, act } from '@testing-library/react';
import { useMapZoom } from './useMapZoom';

describe('useMapZoom', () => {
  it('줌 인/아웃', () => {
    const { result } = renderHook(() => useMapZoom(10));

    expect(result.current.zoom).toBe(10);

    act(() => {
      result.current.handleZoomIn();
    });

    expect(result.current.zoom).toBe(11);
  });
});
```

### 컴포넌트 테스트
```typescript
// features/user-profile/UserProfile.test.tsx
describe('UserProfile', () => {
  it('사용자 정보 표시', () => {
    const user = { id: '1', name: 'John', email: 'john@example.com' };
    render(<UserProfile user={user} />);

    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('onClose 콜백 호출', () => {
    const handleClose = jest.fn();
    const user = { id: '1', name: 'John' };

    render(<UserProfile user={user} onClose={handleClose} />);
    fireEvent.click(screen.getByRole('button', { name: /close/i }));

    expect(handleClose).toHaveBeenCalled();
  });
});
```

## 테스트 작성 체크리스트

### 유닛 테스트
- ✅ 정상 케이스
- ✅ 에러 케이스
- ✅ 엣지 케이스 (null, undefined, 빈 배열)
- ✅ 타입 검증

### 통합 테스트
- ✅ 서로 다른 계층 상호작용
- ✅ API 호출 및 응답 처리
- ✅ 상태 업데이트 및 렌더링
- ✅ 에러 처리 및 복구

### E2E 테스트
- ✅ 실제 사용자 행동 시뮬레이션
- ✅ 전체 플로우 완료 확인

## 실행 명령어

```bash
# 모든 테스트
pnpm test

# 감시 모드
pnpm test --watch

# 커버리지
pnpm test --coverage

# 특정 파일만
pnpm test useAsync.test.ts

# 특정 describe만
pnpm test -t "formatDate"
```

## 커버리지 목표

- **전체**: 70% 이상
- **중요 로직**: 80% 이상
- **UI**: 50% 이상 (복잡도 고려)

---

**다음**: 환경 변수 관리
