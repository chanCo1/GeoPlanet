---
paths:
  - "/"
---

# 조건부 규칙

이 문서는 특정 상황에서만 적용되는 조건부 규칙을 정의합니다.

## 규칙 적용 조건

### 1. 의존성 추가 조건

**조건**: 새로운 외부 라이브러리를 의존성에 추가할 때

**적용 규칙**:
- ✅ `pnpm add` 또는 `pnpm add -F @geoplanet/app-name` 명령 사용
- ✅ `package.json`에 명시적으로 추가됨 확인
- ✅ pnpm-lock.yaml이 최신 상태인지 확인
- ✅ 의존성이 TypeScript strict 모드와 호환되는지 확인
- ❌ `npm install` 또는 `yarn add` 사용 금지

**예시**:
```bash
# ✅ 프론트엔드에 패키지 추가
pnpm add -F @geoplanet/web axios

# ✅ 백엔드에 패키지 추가
pnpm add -F @geoplanet/server @nestjs/jwt

# ✅ 루트 개발 의존성 추가
pnpm add -w -D typescript
```

---

### 2. 다른 앱 사용 조건

**조건**: 한 앱에서 다른 앱의 코드를 사용할 때

**적용 규칙**:
- ✅ 공유 코드는 `packages/` 디렉토리에 배치
- ✅ `packages/`에 별도의 패키지로 구성
- ✅ 해당 패키지의 `package.json`에 명시적 선언
- ✅ `packages/*/tsconfig.json`에서 경로 별칭 정의
- ✅ 두 앱의 `package.json`에 `workspace` 프로토콜 사용
- ❌ 직접 파일 경로로 임포트하지 말 것

**예시**:
```typescript
// ❌ 금지된 방식 - 직접 경로 임포트
import { User } from '../../../apps/web/src/entities/user';

// ✅ 올바른 방식 - 공유 패키지
import { User } from '@geoplanet/shared-types';
```

---

### 3. 프로덕션 배포 조건

**조건**: 코드를 프로덕션 환경에 배포할 때

**적용 규칙**:
- ✅ 모든 TypeScript 파일 `pnpm type-check` 통과
- ✅ 모든 테스트 `pnpm test` 통과
- ✅ 린팅 `pnpm lint` 통과
- ✅ 빌드 성공: `pnpm build`
- ✅ 환경 변수가 올바르게 설정됨
- ✅ 기본 헬스 체크 엔드포인트 정상 작동
- ❌ 경고가 있는 상태로 배포 금지
- ❌ 테스트 실패 상태로 배포 금지

**검사 명령어**:
```bash
# 배포 전 전체 검사
pnpm type-check && pnpm lint && pnpm build
```

---

### 4. 계층 간 임포트 조건 (FSD)

**조건**: 프론트엔드 `src/` 파일 간 임포트할 때

**적용 규칙**:
- ✅ 아래 계층에서만 임포트 가능
- ✅ 같은 계층 내 임포트 가능
- ❌ 위 계층에서 임포트 금지
- ❌ 순환 의존성 금지

**계층 구조** (아래로만 임포트):
```
app/ ← pages/ ← widgets/ ← features/ ←→ entities/ ← shared/
```

**검사**:
```typescript
// 위치: src/features/map-viewer/MapViewer.tsx

// ✅ 가능
import { Button } from '@shared/ui/Button';        // shared 임포트
import { useAsync } from '@shared/hooks/useAsync'; // shared 임포트
import { Map } from '@entities/map';               // entities 임포트

// ❌ 불가능
import { Dashboard } from '@pages/dashboard';      // 위 계층 임포트
import { Header } from '@widgets/header';          // 위 계층 임포트
import { searchFeature } from '@features/search';  // 같은 계층이지만 다른 기능
```

---

### 5. 데이터베이스 마이그레이션 조건

**조건**: 백엔드에서 데이터베이스 스키마를 변경할 때

**적용 규칙** (향후 구현):
- ✅ 마이그레이션 스크립트 생성
- ✅ 마이그레이션 히스토리 기록
- ✅ 이전 버전으로 롤백 가능
- ✅ 데이터 손실 없음을 확인
- ❌ 마이그레이션 없이 스키마 변경 금지

---

### 6. 환경 변수 추가 조건

**조건**: 새로운 환경 변수가 필요할 때

**적용 규칙**:
- ✅ `.env.example` 파일 업데이트
- ✅ 기본값 또는 예시 값 제공
- ✅ CLAUDE.md에 변수 설명 추가
- ✅ 개발자가 로컬에서 설정하도록 안내
- ❌ 환경 변수를 코드에 하드코딩하지 말 것
- ❌ 보안 정보 (토큰, 키)를 버전 관리에 커밋하지 말 것

**예시**:
```bash
# .env.example
DATABASE_URL=postgresql://user:password@localhost:5432/geoplanet
API_SECRET=your-secret-key-here
REDIS_URL=redis://localhost:6379
```

---

### 7. Breaking Change 조건

**조건**: API나 공개 인터페이스의 주요 변경사항이 있을 때

**적용 규칙**:
- ✅ CHANGELOG 파일 생성/업데이트
- ✅ 마이그레이션 가이드 제공
- ✅ 버전 번호 업데이트 (semver)
- ✅ 커밋 메시지에 "Breaking Change:" 명시
- ✅ 관련 문서 모두 업데이트
- ❌ 경고 없이 Breaking Change 배포 금지

---

### 8. 문서 작성 조건

**조건**: 새로운 MD 파일이나 문서를 작성할 때

**적용 규칙** (`.claude/rules/documentation.md` 참조):
- ✅ **한글로만 작성**
- ✅ 마크다운 형식 준수
- ✅ 실행 가능한 예시 포함
- ✅ 명확한 단계별 지시

---

## 조건 확인 체크리스트

개발 시작 전 해당되는 조건을 확인하세요:

- [ ] 새 의존성 추가? → 조건 1 확인
- [ ] 다른 앱의 코드 사용? → 조건 2 확인
- [ ] 프로덕션 배포? → 조건 3 확인
- [ ] 프론트엔드 파일 작성? → 조건 4 확인
- [ ] DB 변경? → 조건 5 확인
- [ ] 환경 변수 추가? → 조건 6 확인
- [ ] API 변경? → 조건 7 확인
- [ ] 문서 작성? → 조건 8 확인

---

**중요**: 조건에 해당되면 해당 규칙이 **자동으로 적용**됩니다.
