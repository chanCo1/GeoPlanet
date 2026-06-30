---
paths:
  - "/"
---

# 환경 변수 관리

## 파일 구조

```
GeoPlanet/
├── .env.example          # 모든 필수 변수 (예시 값)
├── .gitignore            # .env.local 무시
├── apps/web/
│   ├── .env.example      # 프론트엔드 예시
│   └── .env.local        # 개발 환경 (git 무시)
└── apps/server/
    ├── .env.example      # 백엔드 예시
    └── .env.local        # 개발 환경 (git 무시)
```

## 프론트엔드 환경 변수

### apps/web/.env.example
```env
# API
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_API_TIMEOUT=5000

# Features
NEXT_PUBLIC_ENABLE_3D_MAP=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false

# 개발
NEXT_PUBLIC_DEBUG=false
```

### apps/web/.env.local (개발자만 설정)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_API_TIMEOUT=5000
NEXT_PUBLIC_ENABLE_3D_MAP=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_DEBUG=true
```

**규칙**:
- ✅ `NEXT_PUBLIC_` 접두사 → 클라이언트에서 사용 가능
- ✅ 민감한 정보는 prefix 없음 (서버에서만)
- ✅ 기본값 없음 (필수 변수는 required로 표시)

## 백엔드 환경 변수

### apps/server/.env.example
```env
# Server
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000

# Database (향후)
DATABASE_URL=postgresql://user:password@localhost:5432/geoplanet

# Logging
LOG_LEVEL=debug
```

### apps/server/.env.local (개발자만 설정)
```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug
```

**규칙**:
- ✅ `.env.local` git 무시 설정
- ✅ 모든 변수 `.env.example`에 문서화
- ✅ 민감한 정보 (.local)는 버전 관리 제외

## 환경별 구성

### 개발
```env
NODE_ENV=development
DEBUG=true
LOG_LEVEL=debug
```

### 테스트
```env
NODE_ENV=test
DATABASE_URL=postgresql://test:test@localhost:5432/geoplanet_test
LOG_LEVEL=error
```

### 프로덕션
```env
NODE_ENV=production
DEBUG=false
LOG_LEVEL=info
CORS_ORIGIN=https://example.com
DATABASE_URL=<secure URL>
```

## 타입 안전 환경 변수

### 프론트엔드 (Next.js)
```typescript
// lib/env.ts
export const env = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  API_TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '5000'),
  DEBUG: process.env.NEXT_PUBLIC_DEBUG === 'true',
} as const;

// 사용
fetch(`${env.API_URL}/users`);
```

### 백엔드 (NestJS)
```typescript
// config/configuration.ts
export default () => ({
  port: parseInt(process.env.PORT || '3001'),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  database: {
    url: process.env.DATABASE_URL,
  },
});

// 사용
@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getPort() {
    return this.configService.get<number>('port');
  }
}
```

## 보안 규칙

### ✅ 안전함
```env
# 공개 정보
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_FEATURE_FLAG=true
```

### ❌ 위험함 (절대 금지)
```env
# API 키, 토큰, 비밀번호
API_SECRET=sk_live_xxxxx
DATABASE_PASSWORD=secret123
JWT_SECRET=my-secret-key
```

### 미지의 값 처리
```typescript
// ❌ 나쁜 예
const secret = process.env.API_SECRET; // undefined 위험

// ✅ 좋은 예
const secret = process.env.API_SECRET;
if (!secret) {
  throw new Error('API_SECRET is required');
}
```

## 개발자 온보딩

### 1. 저장소 클론 후
```bash
cd apps/web
cp .env.example .env.local
# .env.local 값 수정

cd ../server
cp .env.example .env.local
# .env.local 값 수정
```

### 2. CLAUDE.md 체크리스트
- [ ] `.env.local` 생성
- [ ] 필수 변수 설정
- [ ] `pnpm install`
- [ ] `pnpm dev` 실행

---

**다음**: 성능 최적화
