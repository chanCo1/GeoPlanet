---
paths:
  - "/apps/web/**"
---

# 프론트엔드 TDD

**도구**: Jest + React Testing Library

## 필수 테스트 대상

✅ 유틸리티 함수, 커스텀 훅, 비즈니스 로직, 복잡한 상태 관리
❌ 단순 스타일, 단순 렌더링

## 유틸리티 함수

```typescript
// formatDate.test.ts
describe('formatDate', () => {
  it('기본 형식으로 포매팅', () => {
    expect(formatDate(new Date('2024-01-15'))).toBe('2024-01-15');
  });
});
```

## 컴포넌트

```typescript
describe('SearchBox', () => {
  it('입력 전송', () => {
    const mock = jest.fn();
    render(<SearchBox onSearch={mock} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } });
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

## 커스텀 훅

```typescript
describe('useAsync', () => {
  it('비동기 결과 반환', async () => {
    const fn = jest.fn().mockResolvedValue({ id: 1 });
    const { result } = renderHook(() => useAsync(fn, []));

    expect(result.current.loading).toBe(true);
    await waitFor(() => {
      expect(result.current.data).toEqual({ id: 1 });
    });
  });
});
```

## 실행

```bash
pnpm --filter @geoplanet/web test
pnpm --filter @geoplanet/web test --watch
pnpm --filter @geoplanet/web test --coverage
```
