# 🌍 GeoPlanet

지리적 탐색과 시각화를 위한 풀스택 모노레포입니다.

## 🚀 빠른 시작

### 필수사항
- **Node.js** 18+
- **pnpm** 8.0+

### 설정 및 실행

```bash
# 의존성 설치
pnpm install

# 환경 파일 생성
cp apps/web/.env.example apps/web/.env.local
cp apps/server/.env.example apps/server/.env.local

# 개발 모드 시작
pnpm dev
```

- **프론트엔드**: http://localhost:3000
- **백엔드**: http://localhost:3001

### 빌드 및 검증

```bash
pnpm type-check  # 타입 검사
pnpm lint        # 린팅
pnpm build       # 프로덕션 빌드
```

자세한 설정은 [README-setup.md](./README-setup.md) 참조.

## 📁 프로젝트 구조

```
GeoPlanet/
├── apps/
│   ├── web/          # Next.js 14 프론트엔드 (FSD 아키텍처)
│   └── server/       # NestJS 백엔드 (모듈식)
├── packages/         # 공유 패키지 (향후)
├── .claude/rules/    # 개발 가이드라인 (200줄 이하)
└── 설정 파일들
```

## 🛠️ 기술 스택

### 프론트엔드
- **Next.js 14** (App Router)
- **Tailwind CSS** (스타일링)
- **Zustand** + **React Query** (상태 관리)
- **Three.js** (@react-three/fiber, drei)
- **GSAP** (애니메이션)

### 백엔드
- **NestJS** (프레임워크)
- **Socket.io** (실시간 통신)
- **@nestjs/schedule** (스케줄링)
- **class-validator** (검증)

### 모노레포 도구
- **pnpm Workspaces** (패키지 관리)
- **Turborepo** (빌드 최적화)
- **TypeScript Strict** (전역 설정)

## 📚 문서

- **[CLAUDE.md](./CLAUDE.md)** - 프로젝트 가이드
- **[README-setup.md](./README-setup.md)** - 설정 및 배포
- **[.claude/rules/](./claude/rules/)** - 개발 규칙 (한글, 200줄 이하)

## 🎯 개발 규칙

### 필수 사항
- ✅ **TDD**: 테스트 먼저 작성
- ✅ **한글 문서**: 모든 MD는 한글로만
- ✅ **200줄 제한**: .claude/ 파일들은 200줄 이하
- ✅ **FSD 아키텍처**: 프론트엔드는 엄격한 계층 분리

### 중요 규칙
- 테스트 없이 코드 추가 금지
- .claude/ 내 파일은 200줄을 초과하면 분리
- 커밋은 Conventional Commits 형식 준수

## 🔄 Turborepo 파이프라인

```bash
pnpm dev      # 모든 앱 동시 실행
pnpm build    # 의존성 그래프 기반 빌드
pnpm test     # 모든 테스트 실행
```

## 📖 추가 자료

- [구조 시각화](./STRUCTURE.txt)
- [아키텍처 가이드](./.claude/rules/architecture.md)
- [코딩 표준](./.claude/rules/coding-standards-frontend.md)
- [TDD 규칙](./.claude/rules/tdd-frontend.md)

---

**준비 완료!** `pnpm install`로 시작하세요. 🎉
