# 백엔드 TDD

**반드시 TDD로 개발**: RED → GREEN → REFACTOR

## TDD 원칙

```
1️⃣ RED    - 실패하는 테스트 작성
2️⃣ GREEN  - 테스트 통과 최소 코드
3️⃣ REFACTOR - 코드 개선
```

## 필수 테스트

✅ **꼭 테스트**: 비즈니스 로직, API, DTO, 알고리즘
❌ **불필요**: 라우팅, 라이브러리 코드

## 파일 구조

```
src/modules/users/
├── users.service.ts
├── users.service.test.ts  ← 테스트
├── users.controller.ts
├── users.controller.test.ts
```

## 서비스 테스트

**테스트** (먼저):
```typescript
describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserService],
    }).compile();
    service = module.get(UserService);
  });

  it('사용자 반환', async () => {
    expect(await service.getUser('1'))
      .toEqual({ id: '1', name: 'John' });
  });

  it('없는 사용자는 예외', async () => {
    await expect(service.getUser('999'))
      .rejects.toThrow(NotFoundException);
  });
});
```

**구현**:
```typescript
@Injectable()
export class UserService {
  async getUser(id: string) {
    const user = await db.users.findOne({ id });
    if (!user) throw new NotFoundException('사용자 없음');
    return user;
  }
}
```

## 컨트롤러 테스트

**테스트**:
```typescript
describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{
        provide: UserService,
        useValue: {
          getUser: jest.fn()
            .mockResolvedValue({ id: '1', name: 'John' }),
        },
      }],
    }).compile();
    controller = module.get(UserController);
    service = module.get(UserService);
  });

  it('사용자 정보 반환', async () => {
    const result = await controller.getUser('1');
    expect(result).toEqual({ id: '1', name: 'John' });
    expect(service.getUser).toHaveBeenCalledWith('1');
  });
});
```

**구현**:
```typescript
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }
}
```

## DTO 검증 테스트

**테스트**:
```typescript
describe('CreateUserDto', () => {
  it('유효하면 통과', async () => {
    const dto = Object.assign(new CreateUserDto(), {
      name: 'John',
      email: 'john@example.com',
      password: 'password123',
    });
    expect(await validate(dto)).toHaveLength(0);
  });

  it('이메일 형식 검증', async () => {
    const dto = Object.assign(new CreateUserDto(), {
      email: 'invalid',
    });
    expect((await validate(dto)).length).toBeGreaterThan(0);
  });
});
```

**구현**:
```typescript
export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}
```

## Mock 패턴

```typescript
const mockRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const module = await Test.createTestingModule({
  providers: [
    Service,
    { provide: 'Repository', useValue: mockRepository },
  ],
}).compile();
```

## 실행 및 커버리지

```bash
pnpm test                      # 모든 테스트
pnpm test --watch             # 감시 모드
pnpm test --coverage          # 커버리지 (목표: 70% 이상)
pnpm --filter @geoplanet/server test  # 백엔드만
```

## 필수 규칙

✅ **필수**: 테스트 먼저 작성, 통과 후 커밋, Mock 활용
❌ **금지**: 구현 후 테스트, 테스트 없이 커밋, 실제 DB 사용

---

자세히: coding-standards-backend.md 참조.
