---
paths:
  - "/"
---

# 에러 처리 패턴

## 에러 분류

### 1. 알려진 에러 (예상 가능)
API 요청 실패, 유효성 검증 등

```typescript
export class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string, public resourceId: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}
```

### 2. 미지의 에러 (예상 불가)
프로그래밍 오류, 외부 서비스 에러 등

```typescript
// 캐치 후 처리
try {
  await riskyOperation();
} catch (error) {
  const err = error instanceof Error ? error : new Error('Unknown error');
  logger.error('Unexpected error:', err);
}
```

## 프론트엔드 에러 처리

### API 호출
```typescript
// entities/user/api.ts
export async function getUser(id: string): Promise<IUser> {
  try {
    const response = await fetch(`/api/users/${id}`);

    if (response.status === 404) {
      throw new NotFoundError(`User not found`, id);
    }

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error; // 알려진 에러 던지기
    }
    throw new Error(`Failed to fetch user: ${error}`);
  }
}
```

### 컴포넌트 에러 처리
```typescript
// features/user-profile/UserProfile.tsx
export function UserProfile({ userId }: Props) {
  const { data, error, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId),
  });

  if (isLoading) return <Loading />;

  if (error instanceof NotFoundError) {
    return <NotFoundMessage resourceId={error.resourceId} />;
  }

  if (error) {
    return <ErrorBoundary error={error} />;
  }

  return <ProfileCard user={data} />;
}
```

### React Query 에러
```typescript
const query = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  retry: (failureCount, error) => {
    // 404는 재시도 안 함
    if (error instanceof NotFoundError) return false;
    // 3회까지 재시도
    return failureCount < 3;
  },
  onError: (error) => {
    if (error instanceof NotFoundError) {
      showToast('Resource not found', 'error');
    } else {
      showToast('Something went wrong', 'error');
    }
  },
});
```

## 백엔드 에러 처리

### 예외 클래스
```typescript
// common/exceptions/
export class NotFoundException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class BadRequestException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
```

### 서비스 에러 처리
```typescript
@Injectable()
export class UserService {
  async getUser(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ id });

    if (!user) {
      throw new NotFoundException(`User not found: ${id}`);
    }

    return user;
  }
}
```

### 컨트롤러 에러 처리
```typescript
@Controller('users')
export class UserController {
  @Get(':id')
  async getUser(@Param('id') id: string) {
    try {
      return await this.userService.getUser(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException('Internal server error', 500);
    }
  }
}
```

### 글로벌 예외 필터
```typescript
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = 500;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse() as string;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      message,
      path: request.url,
    });
  }
}
```

## 에러 전략

### Try-Catch vs 에러 바운더리

**Try-Catch** (동기/비동기):
```typescript
try {
  await operation();
} catch (error) {
  handleError(error);
}
```

**Error Boundary** (렌더링 에러):
```typescript
export class ErrorBoundary extends Component {
  componentDidCatch(error: Error) {
    showToast(error.message);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

## 에러 로깅

```typescript
// shared/utils/logger.ts
export const logger = {
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${message}`, error);
    // 프로덕션: 외부 서비스로 전송
  },
  warn: (message: string) => {
    console.warn(`[WARN] ${message}`);
  },
  info: (message: string) => {
    console.info(`[INFO] ${message}`);
  },
};
```

---

**다음**: 테스트 구조
