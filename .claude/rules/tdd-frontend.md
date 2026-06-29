# 프론트엔드 TDD

**반드시 TDD로 개발**: RED → GREEN → REFACTOR

## TDD 원칙

```
1️⃣ RED    - 실패하는 테스트 작성
2️⃣ GREEN  - 테스트 통과 최소 코드
3️⃣ REFACTOR - 코드 개선
```

## 필수 테스트

✅ **꼭 테스트**:
- 유틸리티 함수
- 커스텀 훅
- 비즈니스 로직
- 복잡한 상태관리

❌ **불필요**:
- 단순 스타일
- 간단한 렌더링

## 테스트 도구

Jest + React Testing Library

## 파일 위치

```
src/features/map-viewer/
├── MapViewer.tsx
├── MapViewer.test.tsx    ← 테스트 (같은 폴더)
```

## 예시 1: 유틸리티 함수

**테스트** (먼저):
```typescript
// formatDate.test.ts
describe('formatDate', () => {
  it('기본 형식으로 포매팅', () => {
    expect(formatDate(new Date('2024-01-15')))
      .toBe('2024-01-15');
  });
});
```

**구현**:
```typescript
// formatDate.ts
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
```

## 예시 2: React 컴포넌트

**테스트**:
```typescript
describe('SearchBox', () => {
  it('입력을 전송해야 함', () => {
    const mock = jest.fn();
    render(<SearchBox onSearch={mock} />);

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'test' },
    });
    fireEvent.click(screen.getByRole('button'));

    expect(mock).toHaveBeenCalledWith('test');
  });

  it('빈 입력은 전송 안 함', () => {
    const mock = jest.fn();
    render(<SearchBox onSearch={mock} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mock).not.toHaveBeenCalled();
  });
});
```

**구현**:
```typescript
export const SearchBox: FC<Props> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  return (
    <div>
      <input value={query}
        onChange={(e) => setQuery(e.target.value)} />
      <button onClick={() => {
        if (query.trim()) onSearch(query);
      }}>검색</button>
    </div>
  );
};
```

## 예시 3: 커스텀 훅

**테스트**:
```typescript
describe('useAsync', () => {
  it('비동기 결과 반환', async () => {
    const fn = jest.fn()
      .mockResolvedValue({ id: 1 });
    const { result } = renderHook(() => useAsync(fn, []));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.data).toEqual({ id: 1 });
    });
  });

  it('에러 처리', async () => {
    const error = new Error('Failed');
    const fn = jest.fn()
      .mockRejectedValue(error);
    const { result } = renderHook(() => useAsync(fn, []));

    await waitFor(() => {
      expect(result.current.error).toBe(error);
    });
  });
});
```

**구현**:
```typescript
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

## 테스트 명명

```typescript
describe('Component', () => {
  it('동작 + 결과 설명', () => {});
  it('사용자가 입력하면 결과를 전송해야 함', () => {});
});
```

## 실행

```bash
pnpm test                 # 모든 테스트
pnpm test --watch        # 감시 모드
pnpm test --coverage     # 커버리지
```

## 커버리지 목표

- 전체: 70% 이상
- 중요: 80% 이상

## 필수 규칙

✅ **꼭 해야 함**:
- 테스트를 먼저 작성
- 테스트 통과 후 커밋
- 의미 있는 테스트만

❌ **금지**:
- 구현 후 테스트 추가
- 테스트 없이 커밋
- 테스트 실패 상태로 개발

---

상세 내용: coding-standards-frontend.md 참조.
