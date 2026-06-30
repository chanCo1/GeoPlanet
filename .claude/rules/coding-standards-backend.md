---
paths:
  - "/apps/server/**"
---

# 백엔드 코딩 표준

## TypeScript 규칙

### Strict 모드 (필수)

```typescript
// ❌ 나쁜 예
const data = JSON.parse(response);

// ✅ 좋은 예
const data: Record<string, unknown> = JSON.parse(response);
```

## NestJS 구조

### 서비스

```typescript
@Injectable()
export class UserService {
  constructor(private readonly db: Database) {}

  async getUser(id: string): Promise<User> {
    return this.db.users.findOne({ id });
  }
}
```

### 컨트롤러

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

### DTO 검증

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

### 에러 처리

```typescript
if (!user) {
  throw new NotFoundException(`ID ${id}인 사용자 없음`);
}

// 다른 예외
throw new BadRequestException('유효하지 않은 입력');
throw new UnauthorizedException('인증 필요');
```

### 모듈 구조

```typescript
@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],  // 다른 모듈에서 사용
})
export class UserModule {}
```

## 명명 규칙

```typescript
class UserService { }                    // 클래스
async getUser(id: string) { }            // 메서드
const API_BASE_URL = '...';              // 상수
interface IUserRepository { }            // 인터페이스
```

## 파일 구성

**모듈 구조**:
```
modules/
├── users/
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.module.ts
│   └── dto/create-user.dto.ts
```

**임포트 순서**:
1. NestJS
2. 외부 패키지
3. 로컬 모듈

**파일 명명**:
- 컨트롤러: `<entity>.controller.ts`
- 서비스: `<entity>.service.ts`
- 모듈: `<entity>.module.ts`
- DTO: `create-<entity>.dto.ts`

## 의존성 주입

```typescript
export class UserService {
  constructor(
    private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService,
  ) {}
}
```

## 주석 작성

```typescript
// ✅ 좋은 예: 복잡한 로직 설명
// N+1 쿼리 방지를 위해 join 사용
const users = await userRepository
  .leftJoinAndSelect('user.profile', 'profile')
  .getMany();
```

## API 문서화

```typescript
/**
 * 모든 사용자 조회
 * @returns 사용자 배열
 * @throws 사용자 없으면 NotFoundException
 */
@Get()
async getUsers(): Promise<User[]> { }
```

## 성능

- 데이터베이스: 인덱싱, 커넥션 풀링
- 쿼리: N+1 문제 방지 (join 사용)
- 캐싱: 반복 쿼리 캐시
- 페이지네이션: 대량 데이터 처리

---

**TDD 필수**: tdd-backend.md 참조.
