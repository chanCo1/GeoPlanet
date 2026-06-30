---
paths:
  - "/"
---

# 환경 변수 관리

## 파일 구조

```
apps/web/
├── .env.example     # 예시 (git 포함)
└── .env.local       # 개발 환경 (git 제외)

apps/server/
├── .env.example
└── .env.local
```

## 프론트엔드

```env
# apps/web/.env.example
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ENABLE_3D_MAP=true
NEXT_PUBLIC_DEBUG=false
```

**규칙**:
- ✅ `NEXT_PUBLIC_` → 클라이언트 노출 가능
- ✅ 민감한 정보는 prefix 없음 (서버에서만)

```typescript
// lib/env.ts
export const env = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  DEBUG: process.env.NEXT_PUBLIC_DEBUG === 'true',
} as const;
```

## 백엔드

```env
# apps/server/.env.example
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/geoplanet
```

```typescript
// config/configuration.ts
export default () => ({
  port: parseInt(process.env.PORT || '3001'),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
});
```

## 보안 규칙

- ✅ `.env.example` 모든 변수 문서화
- ✅ `.env.local` → `.gitignore`에 추가
- ❌ API 키, 토큰, 비밀번호 코드에 하드코딩 금지
- ❌ `.env.local` 커밋 금지

```typescript
// 필수 변수 검증
const secret = process.env.API_SECRET;
if (!secret) throw new Error('API_SECRET is required');
```

## 온보딩

```bash
cd apps/web && cp .env.example .env.local
cd apps/server && cp .env.example .env.local
pnpm install && pnpm dev
```
