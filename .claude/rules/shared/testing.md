---
paths:
  - "/"
---

# 테스트 구조

## 파일 위치 규칙

테스트 파일은 **대상 파일과 같은 폴더**에 배치

```
src/
├── shared/
│   └── hooks/
│       ├── useAsync.ts
│       └── useAsync.test.ts      ← 같은 폴더
├── entities/
│   └── user/
│       ├── api.ts
│       └── api.test.ts           ← 같은 폴더
└── features/
    └── user-profile/
        ├── UserProfile.tsx
        └── UserProfile.test.tsx  ← 같은 폴더
```

## 테스트 레벨

### 1. 유닛 테스트 (Unit)
```typescript
describe('formatDate', () => {
  it('기본 형식으로 포매팅', () => {
    expect(formatDate(new Date('2024-01-15'))).toBe('2024-01-15');
  });
  it('잘못된 입력 처리', () => {
    expect(() => formatDate(null as any)).toThrow();
  });
});
```

### 2. 컴포넌트 테스트
```typescript
describe('UserProfile', () => {
  it('사용자 정보 표시', () => {
    render(<UserProfile user={{ id: '1', name: 'John' }} />);
    expect(screen.getByText('John')).toBeInTheDocument();
  });
});
```

### 3. 훅 테스트
```typescript
describe('useMapZoom', () => {
  it('줌 인', () => {
    const { result } = renderHook(() => useMapZoom(10));
    act(() => { result.current.handleZoomIn(); });
    expect(result.current.zoom).toBe(11);
  });
});
```

## TDD 원칙

```
1️⃣ RED    → 실패하는 테스트 먼저 작성
2️⃣ GREEN  → 테스트 통과하는 최소 코드 구현
3️⃣ REFACTOR → 코드 개선
```

**금지**:
- ❌ 구현 후 테스트 추가
- ❌ 테스트 없이 커밋

## 테스트 도구

- **프론트엔드**: Jest + React Testing Library
- **백엔드**: Jest + NestJS Testing

## 실행 명령어

```bash
pnpm test                  # 전체 테스트
pnpm test --watch         # 감시 모드
pnpm test --coverage      # 커버리지
```

## 커버리지 목표

- 전체: 70% 이상
- 중요 로직: 80% 이상
