# 📋 설정 및 배포 가이드

## 로컬 개발 환경 설정

### 1단계: 의존성 설치

```bash
cd GeoPlanet
pnpm install
```

### 2단계: 환경 파일 생성

**프론트엔드** (apps/web/.env.local):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ENABLE_3D_MAP=true
```

**백엔드** (apps/server/.env.local):
```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### 3단계: 개발 서버 시작

```bash
pnpm dev
```

- 프론트엔드: http://localhost:3000
- 백엔드: http://localhost:3001
- WebSocket: ws://localhost:3001

## 환경별 설정

### 개발 환경
```env
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3001
DATABASE_URL=postgresql://user:password@localhost:5432/geoplanet_dev
```

### 프로덕션 환경
```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.geoplanet.com
DATABASE_URL=postgresql://user:password@prod-db:5432/geoplanet
API_SECRET=production-secret-key
```

## 빌드 및 배포

### 프로덕션 빌드

```bash
# 1. 타입 검사 및 린팅
pnpm type-check
pnpm lint

# 2. 테스트 실행
pnpm test

# 3. 빌드
pnpm build

# 4. 결과 확인
ls apps/web/.next/      # 프론트엔드 빌드 결과
ls apps/server/dist/    # 백엔드 빌드 결과
```

### 배포 전 검사 목록

- [ ] 모든 테스트 통과 (`pnpm test`)
- [ ] TypeScript 에러 없음 (`pnpm type-check`)
- [ ] 린팅 통과 (`pnpm lint`)
- [ ] 빌드 성공 (`pnpm build`)
- [ ] 환경 변수 설정 완료
- [ ] 기본 헬스 체크 확인 (GET `/health`)

## 워크스페이스 명령어

### 특정 앱에만 명령 실행

```bash
# 프론트엔드만 빌드
pnpm --filter @geoplanet/web build

# 백엔드만 테스트
pnpm --filter @geoplanet/server test

# 루트만 타입 체크
pnpm --filter . type-check
```

### 의존성 관리

```bash
# 프론트엔드에 패키지 추가
pnpm add -F @geoplanet/web axios

# 백엔드에 패키지 추가
pnpm add -F @geoplanet/server @nestjs/jwt

# 루트 개발 의존성
pnpm add -w -D typescript

# 모든 앱에 동시 설치
pnpm -r install
```

## 배포 플랫폼별 가이드

### 프론트엔드 배포 (Vercel)

```bash
# .vercelignore 생성
echo "apps/server/" > .vercelignore

# Vercel CLI로 배포
vercel deploy --prod
```

### 백엔드 배포 (Docker)

```bash
# Dockerfile 생성
FROM node:18-alpine
WORKDIR /app
COPY apps/server/dist .
CMD ["node", "main.js"]

# 이미지 빌드 및 배포
docker build -t geoplanet-server .
docker push your-registry/geoplanet-server
```

## 데이터베이스 설정

### PostgreSQL 연결 (향후)

```bash
# 로컬 PostgreSQL 시작
docker run -e POSTGRES_PASSWORD=password \
  -p 5432:5432 postgres:15

# 마이그레이션 실행
pnpm --filter @geoplanet/server migrate:run
```

## 트러블슈팅

### pnpm 관련 문제

```bash
# pnpm 캐시 정리
pnpm store prune

# 모든 의존성 재설치
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 포트 충돌

```bash
# 포트 사용 확인
lsof -i :3000  # 프론트엔드
lsof -i :3001  # 백엔드

# 프로세스 종료
kill -9 <PID>

# 다른 포트에서 시작
PORT=3002 pnpm --filter @geoplanet/server dev
```

### TypeScript 에러

```bash
# 캐시 정리 후 재컴파일
rm -rf apps/*/dist apps/*/.next
pnpm build
```

## 성능 최적화

### 빌드 최적화

```bash
# Turbo 캐시 활용 확인
TURBO_TELEMETRY=enabled pnpm build

# 캐시 무효화
pnpm build -- --no-cache
```

### 런타임 최적화

프론트엔드:
- Code splitting 활성화 (자동)
- 이미지 최적화 (Next.js Image)
- 동적 import 사용

백엔드:
- 데이터베이스 인덱싱
- 캐싱 전략 수립
- 커넥션 풀링

---

자세한 내용은 [CLAUDE.md](./CLAUDE.md) 참조.
