---
paths:
  - "/"
---

# 커밋 규칙

## 형식

```
<type>: <subject>
```

**타입**:
- `ADD`: 새로운 기능/파일 추가
- `UPD`: 기존 코드 수정
- `FIX`: 버그 수정
- `DEL`: 코드/파일 삭제

**제목**: 마침표 없음, 최대 50자

## 예시

```
ADD: 지도 레이어 토글 기능
UPD: 소켓 연결 해제 처리 개선
FIX: 사용자 인증 토큰 만료 오류
DEL: 사용하지 않는 UserProfile 컴포넌트
```

## Co-Authored-By

Claude와 함께 작성한 커밋에는 반드시 추가:
```
Co-Authored-By: Claude <noreply@anthropic.com>
```

## 브랜치 명명

```
feat/<feature-name>
fix/<bug-name>
refactor/<component-name>
```

## 모범 사례
1. 논리적 단위로 커밋 (한 문장으로 설명 가능한 크기)
2. 자주 커밋 (작고 집중된 커밋)
