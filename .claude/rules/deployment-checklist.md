---
paths:
  - "/"
---

# 배포 체크리스트

## 배포 전 검사 (필수)

### 1. 코드 품질 검사
```bash
# TypeScript 타입 체크
pnpm type-check
# ✅ 에러 없음 확인

# ESLint 린팅
pnpm lint
# ✅ 경고/에러 없음 확인

# 테스트 실행
pnpm test
# ✅ 모든 테스트 통과 확인
```

**체크리스트**:
- [ ] `pnpm type-check` 통과
- [ ] `pnpm lint` 통과
- [ ] `pnpm test` 통과
- [ ] 커버리지 목표 달성 (70% 이상)

### 2. 빌드 검사
```bash
# 프로덕션 빌드
pnpm build
# ✅ 빌드 성공 확인

# 빌드 아티팩트 확인
ls -la .next/          # 프론트엔드
ls -la dist/           # 백엔드
```

**체크리스트**:
- [ ] 빌드 성공 (경고 없음)
- [ ] 소스 맵 생성 (디버깅 용)
- [ ] 번들 크기 확인 (예상 범위 내)

### 3. 환경 변수 검사
```bash
# 필수 변수 확인
echo "프론트엔드:"
grep "NEXT_PUBLIC_" apps/web/.env.local

echo "백엔드:"
grep "^[A-Z_]" apps/server/.env.local
```

**체크리스트** (프론트엔드):
- [ ] `NEXT_PUBLIC_API_URL` 설정
- [ ] 민감한 정보 포함 안 함

**체크리스트** (백엔드):
- [ ] `PORT` 설정
- [ ] `CORS_ORIGIN` 설정
- [ ] 데이터베이스 연결 정보

### 4. 보안 검사
```bash
# 민감한 정보 검색
grep -r "password\|secret\|token\|key" src/ | grep -v node_modules
# ❌ 결과 없어야 함
```

**체크리스트**:
- [ ] 하드코딩된 키/토큰 없음
- [ ] `.env.local` git 무시 확인
- [ ] 외부 보안 서비스 점검 (SonarQube 등)

### 5. 데이터베이스 (향후)
```bash
# 마이그레이션 준비
pnpm db:migrate
# ✅ 성공 확인
```

**체크리스트**:
- [ ] 마이그레이션 스크립트 실행
- [ ] 데이터 백업 확인
- [ ] 롤백 계획 수립

## 배포 후 검증

### 1. 헬스 체크
```bash
# API 응답 확인
curl http://deployed-url/health
# ✅ 200 OK 응답

# 데이터베이스 연결 확인
curl http://deployed-url/api/health/db
# ✅ 연결 성공
```

**체크리스트**:
- [ ] 서버 응답 정상
- [ ] 데이터베이스 연결 정상
- [ ] 로그 정상 출력

### 2. 기능 검증
```
✅ 홈페이지 로드
✅ 로그인/회원가입 (해당시)
✅ 주요 기능 동작
✅ API 응답 정상
✅ 에러 페이지 표시
```

### 3. 성능 모니터링
```bash
# Lighthouse 점수 확인
# Core Web Vitals 모니터링
# 응답 시간 확인
```

**체크리스트**:
- [ ] Lighthouse 점수 70 이상
- [ ] First Contentful Paint < 1.8s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1

### 4. 에러 모니터링
```
✅ 에러 로깅 시스템 작동
✅ 외부 서비스 통지 (Sentry, DataDog 등)
✅ 알림 설정 확인
```

## 배포 종류별 체크리스트

### Staging (스테이징)
```bash
# 완전한 배포 테스트
✅ 모든 검사 통과
✅ 데이터베이스 마이그레이션 테스트
✅ 롤백 테스트
```

### Production (프로덕션)
```bash
# 최종 검증
✅ Staging 배포 성공
✅ 모든 팀 리뷰 완료
✅ 핫픽스 계획 수립
✅ 배포 시간 확인 (최소 트래픽 시간)
```

## 배포 스크립트

### 배포 전 체크
```bash
#!/bin/bash
# scripts/pre-deploy.sh

set -e  # 에러시 중단

echo "🔍 배포 전 검사 시작..."

echo "📝 타입 체크..."
pnpm type-check

echo "🎨 린팅..."
pnpm lint

echo "🧪 테스트..."
pnpm test

echo "🔨 빌드..."
pnpm build

echo "✅ 모든 검사 통과!"
```

### 실행
```bash
chmod +x scripts/pre-deploy.sh
./scripts/pre-deploy.sh
```

## 배포 실패 시

### 롤백 계획
```bash
# 이전 버전으로 복구
git revert <commit-hash>
pnpm build
# 재배포
```

### 긴급 핫픽스
```bash
# 긴급 수정 브랜치 생성
git checkout -b hotfix/critical-bug

# 빠른 수정 및 배포
# 수정 후 merge
```

### 모니터링
```
✅ 에러율 모니터링
✅ 성능 지표 모니터링
✅ 사용자 피드백 수집
```

## 체크리스트 템플릿

### 배포 전
- [ ] 로컬 테스트 통과 (`pnpm test`)
- [ ] 빌드 성공 (`pnpm build`)
- [ ] 타입 체크 통과 (`pnpm type-check`)
- [ ] 린팅 통과 (`pnpm lint`)
- [ ] 환경 변수 설정
- [ ] 보안 검사 완료
- [ ] 팀 리뷰 완료
- [ ] 마이그레이션 준비 (해당시)

### 배포 후
- [ ] 헬스 체크 통과
- [ ] 주요 기능 동작 확인
- [ ] 에러 모니터링 설정
- [ ] 성능 지표 모니터링
- [ ] 배포 공지
- [ ] 인시던트 계획 (롤백 등)

---

**완료**: 모든 규칙 정리 완료!
