---
paths:
  - "/apps/server/**"
---

# 백엔드 TDD

**도구**: Jest + NestJS Testing Module

## 필수 테스트 대상

✅ 비즈니스 로직, API, DTO, 알고리즘
❌ 라우팅, 라이브러리 코드

## 서비스 테스트

```typescript
describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: mockRepository },
      ],
    }).compile();
    service = module.get(UserService);
  });

  it('사용자 반환', async () => {
    mockRepository.findOne.mockResolvedValue({ id: '1', name: 'John' });
    expect(await service.getUser('1')).toEqual({ id: '1', name: 'John' });
  });

  it('없는 사용자는 예외', async () => {
    mockRepository.findOne.mockResolvedValue(null);
    await expect(service.getUser('999')).rejects.toThrow(NotFoundException);
  });
});
```

## 컨트롤러 테스트

```typescript
describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{
        provide: UserService,
        useValue: { getUser: jest.fn().mockResolvedValue({ id: '1', name: 'John' }) },
      }],
    }).compile();
    controller = module.get(UserController);
  });

  it('사용자 정보 반환', async () => {
    expect(await controller.getUser('1')).toEqual({ id: '1', name: 'John' });
  });
});
```

## Mock 패턴

```typescript
const mockRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};
```

## 실행

```bash
pnpm --filter @geoplanet/server test
pnpm --filter @geoplanet/server test --watch
pnpm --filter @geoplanet/server test --coverage
```
