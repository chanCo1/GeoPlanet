---
paths:
  - "/"
---

# 에러 처리 패턴

## 에러 분류

```typescript
// 알려진 에러
export class NotFoundError extends Error {
  constructor(message: string, public resourceId: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

## 프론트엔드

### API 호출
```typescript
export async function getUser(id: string): Promise<IUser> {
  const response = await fetch(`/api/users/${id}`);

  if (response.status === 404) throw new NotFoundError('User not found', id);
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

  return response.json();
}
```

### React Query
```typescript
const query = useQuery({
  queryKey: ['user', userId],
  queryFn: () => getUser(userId),
  retry: (failureCount, error) => {
    if (error instanceof NotFoundError) return false; // 404는 재시도 안 함
    return failureCount < 3;
  },
});
```

### 컴포넌트
```typescript
if (error instanceof NotFoundError) return <NotFoundMessage />;
if (error) return <ErrorFallback error={error} />;
```

## 백엔드

### 예외 사용
```typescript
// services
if (!user) throw new NotFoundException(`User not found: ${id}`);
throw new BadRequestException('유효하지 않은 입력');
throw new UnauthorizedException('인증 필요');
```

### 글로벌 예외 필터
```typescript
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : 500;

    response.status(status).json({
      statusCode: status,
      path: request.url,
    });
  }
}
```

## 로깅

```typescript
// shared/utils/logger.ts
export const logger = {
  error: (message: string, error?: Error) => console.error(`[ERROR] ${message}`, error),
  warn: (message: string) => console.warn(`[WARN] ${message}`),
  info: (message: string) => console.info(`[INFO] ${message}`),
};
```
