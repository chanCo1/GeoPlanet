# 커밋 규칙

## 커밋 메시지 형식

Conventional Commits 형식을 따릅니다:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 타입

- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경만
- `style`: 코드 스타일 변경 (포매팅, 세미콜론 등)
- `refactor`: 기능 변경 없이 코드 재구성
- `perf`: 성능 개선
- `test`: 테스트 추가/변경
- `chore`: 빌드, 의존성, 도구 설정
- `ci`: CI/CD 설정

### 범위 (Scope)

시스템의 어느 부분이 영향을 받는지 표시:

**프론트엔드**:
- `web/shared`: 공유 계층 변경
- `web/entities`: 엔티티 계층 변경
- `web/features`: 기능 계층 변경
- `web/widgets`: 위젯 계층 변경
- `web/app`: App Router 변경

**백엔드**:
- `server/auth`: 인증 모듈
- `server/users`: 사용자 모듈
- `server/gateway`: WebSocket 게이트웨이
- `server/common`: 공용 유틸리티

**모노레포**:
- `repo`: 루트 설정, 의존성
- `tsconfig`: TypeScript 설정
- `turbo`: Turborepo 설정

### 제목 (Subject)

- 명령형: "added" 대신 "add" 사용
- 마침표 없음
- 최대 50자
- 첫 글자는 소문자

### 본문 (Body)

- 어떻게 했는지가 아니라 무엇을, 왜 했는지 설명
- 72자에서 줄 바꿈
- 제목과 한 줄 공백으로 구분
- 현재형 사용

### 바닥글 (Footer)

선택사항 - 이슈 참조 및 주요 변경사항:

```
Fixes #123
Breaking Change: 속성명을 'foo'에서 'bar'로 변경
```

### Co-Authored-By (Claude 공동 작성)

Claude와 함께 작성한 커밋에는 반드시 아래 트레일러를 추가:

```
Co-Authored-By: Claude <noreply@anthropic.com>
```

- ✅ Claude Code가 커밋 생성 시 자동으로 추가

## 예시

### 기능 추가
```
feat(web/features): 지도 레이어 토글 기능 추가

다양한 지도 타일 레이어 간 전환 기능 구현.
기존 지도 스토어를 사용하여 레이어 상태를 관리하고
MapViewer 기능 컴포넌트에 UI 컨트롤 제공.

Fixes #42
```

### 버그 수정
```
fix(server/gateway): 소켓 연결 해제 시 안전한 처리

클라이언트 연결 해제 시 리소스를 적절히 정리하여
메모리 누수를 방지. 이벤트 리스너에 적절한
에러 처리 추가.

Fixes #38
```

### 의존성 업데이트
```
chore(repo): React를 18.3으로 업그레이드

React와 React DOM을 최신 안정 버전으로 업데이트.
코드베이스에 주요 변경사항 없음.
```

### 설정 변경
```
chore(tsconfig): 더 엄격한 타입 체킹 활성화

noUnusedParameters와 noUnusedLocals를 추가하여
불필요한 코드 누적 방지.
```

## 모범 사례

1. **논리적 단위로 커밋** - 한 문장으로 설명할 수 없으면 너무 많은 변경
2. **자주 커밋** - 작고 집중된 커밋이 검토하기 쉬움
3. **간결하게** - 긴 커밋 메시지는 불명확한 변경을 의미
4. **이슈 참조** - 해당되는 경우 바닥글에서 GitHub 이슈 링크
5. **사람을 위해** - 6개월 후 이것을 읽는 사람을 생각하며 작성

## 브랜치 명명

기능 브랜치의 경우:

```
feat/<feature-name>
fix/<bug-name>
docs/<documentation>
refactor/<component-name>
```

예시:
```
feat/map-layers-toggle
fix/socket-reconnection
docs/architecture-guide
refactor/user-store
```
