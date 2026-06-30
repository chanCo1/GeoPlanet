---
paths:
  - "/"
---

# 커밋 규칙

## 커밋 메시지 형식

```
<type>: <subject>
```

### 타입

- `ADD`: 새로운 기능 추가 또는 파일 생성
- `UPD`: 기존 코드/파일 수정
- `FIX`: 버그 및 에러 수정
- `DEL`: 코드/파일 삭제

### 제목 (Subject)

- 변경 내용을 간결하게 설명
- 마침표 없음
- 최대 50자

## 예시

### 추가 / 생성
```
ADD: 지도 레이어 토글 기능
ADD: UserService 초기 구현
ADD: Co-Authored-By Claude 규칙
```

### 수정
```
UPD: 소켓 연결 해제 처리 개선
UPD: TypeScript strict 설정 강화
UPD: 커밋 메시지 형식 변경
```

### 버그 수정
```
FIX: 소켓 연결 해제 시 메모리 누수
FIX: baseUrl deprecated 경고 제거
FIX: 사용자 인증 토큰 만료 오류
```

### 삭제
```
DEL: 사용하지 않는 UserProfile 컴포넌트
DEL: 레거시 API 엔드포인트
```

## Co-Authored-By (Claude 공동 작성)

Claude와 함께 작성한 커밋에는 반드시 아래 트레일러를 추가:

```
Co-Authored-By: Claude <noreply@anthropic.com>
```

- ✅ Claude Code가 커밋 생성 시 자동으로 추가
- ✅ GitHub Contributors 섹션에 Claude가 표시됨

## 모범 사례

1. **논리적 단위로 커밋** - 한 문장으로 설명할 수 없으면 너무 많은 변경
2. **자주 커밋** - 작고 집중된 커밋이 검토하기 쉬움
3. **간결하게** - 긴 커밋 메시지는 불명확한 변경을 의미

## 브랜치 명명

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
