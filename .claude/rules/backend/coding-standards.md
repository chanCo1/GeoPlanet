---
paths:
  - "/apps/server/**"
---

# 백엔드 코딩 표준

## NestJS 구조

### 서비스
```typescript
@Injectable()
export class UserService {
  constructor(private readonly db: Database) {}

  async getUser(id: string): Promise<IUser> {
    const user = await this.db.users.findOne({ id });
    if (!user) throw new NotFoundException(`User not found: ${id}`);
    return user;
  }
}
```

### 컨트롤러
```typescript
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<IUser> {
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

### 모듈 구조
```typescript
@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
```

## 파일 명명

```
modules/users/
├── users.controller.ts
├── users.service.ts
├── users.module.ts
└── dto/create-user.dto.ts
```

## 임포트 순서

1. NestJS 패키지
2. 외부 라이브러리
3. 로컬 모듈

## 성능

- N+1 쿼리 방지 (join 사용)
- 반복 쿼리 캐싱
- 대량 데이터 페이지네이션

## 주석

```typescript
// ✅ 복잡한 로직 설명
// N+1 쿼리 방지를 위해 join 사용
const users = await userRepository
  .leftJoinAndSelect('user.profile', 'profile')
  .getMany();
```
