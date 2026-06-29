# 문서화 규칙

## 1. 마크다운 파일 작성 언어

### 필수: 모든 MD 파일은 한글로 작성

GeoPlanet의 모든 마크다운 문서는 **한글(Korean)**로만 작성합니다.

✅ **적용 대상**:
- `.claude/rules/*.md` - 개발 가이드라인
- `*.md` - 프로젝트 문서 (README, SETUP_CHECKLIST 등)
- `docs/*.md` - 추가 문서 (향후)

❌ **제외**:
- 코드 주석: 필요에 따라 한글/영문 혼용 가능
- 코드 문자열: 각 언어별로 다를 수 있음

## 2. 파일 크기 제한 (200줄 이하)

### 규칙: `.claude/` 내 모든 파일은 200줄 이하

```
.claude/
├── rules/
│   ├── architecture.md           (181줄) ✅
│   ├── commits.md                (137줄) ✅
│   ├── coding-standards-frontend.md (165줄) ✅
│   ├── coding-standards-backend.md  (168줄) ✅
│   ├── conditional-rules.md      (185줄) ✅
│   ├── documentation.md          (200줄 이하) ✅
│   ├── tdd-frontend.md           (195줄) ✅
│   └── tdd-backend.md            (200줄 이하) ✅
```

### 초과 시 분리 방법

200줄을 넘으면 파일을 분리합니다:

**예시: coding-standards.md (314줄)**
```
❌ 원본 (314줄) - 제거
✅ coding-standards-frontend.md (165줄) - 분리
✅ coding-standards-backend.md (168줄) - 분리
```

**예시: tdd.md (463줄)**
```
❌ 원본 (463줄) - 제거
✅ tdd-frontend.md (195줄) - 분리
✅ tdd-backend.md (200줄) - 분리
```

## 3. 작성 스타일

### 작성 스타일

마크다운 문서 작성 시:

1. **제목 계층**:
   - `#` - 페이지 제목
   - `##` - 주요 섹션
   - `###` - 소제목
   - `####` - 세부 항목

2. **코드 블록**: 언어 명시 필수
   ```typescript
   // TypeScript 예시
   ```

3. **리스트**:
   - 개념 설명: `✅` / `❌` 이모지 사용
   - 단계별 지시: 번호 매김 사용

4. **강조**:
   - 중요: `**굵은 글씨**`
   - 강조: `_이탤릭_`
   - 코드 참조: `` `코드` ``

### 예시

```markdown
# 페이지 제목

## 주요 섹션

설명 텍스트입니다.

### 세부 섹션

- ✅ 올바른 예시
- ❌ 잘못된 예시

**중요**: 이것은 강조된 내용입니다.

\`\`\`typescript
const example = 'TypeScript 코드';
\`\`\`
```

## 4. 파일 길이 체크

### 줄 수 확인 명령어

```bash
# 모든 규칙 파일 줄 수 확인
wc -l .claude/rules/*.md

# 200줄 초과 파일 찾기
find .claude/rules -name "*.md" -exec wc -l {} + | awk '$1 > 200 {print}'
```

## 5. 문서 업데이트 정책

1. **정책 변경 시**:
   - 해당 MD 파일 즉시 업데이트
   - 200줄 초과 확인

2. **새 규칙 추가**:
   - 관련 파일에 섹션 추가
   - 총 줄 수 200줄 이하 확인
   - 필요시 새 파일 생성

3. **파일 분리 필요 시**:
   - 주제별로 분리 (예: frontend/backend)
   - 인덱스 문서에서 링크 제공
   - MEMORY.md 업데이트

## 문서 구성 원칙

### 클리어하고 정확하게
- 모호한 표현 피하기
- 구체적인 예시 제공
- 링크와 참조 활용

### 실행 가능하게
- "~하면 좋다" 대신 "~해야 한다" 사용
- 구체적인 단계와 명령어 제공
- 예상 결과 명시

### 유지보수 가능하게
- 중복 제거 (한 곳에만 정의)
- 변경 시 모든 참조 업데이트
- 버전 특화 정보 명시

## 예시: 올바른 문서

### ❌ 피해야 할 작성

```markdown
# 설정 방법

설정하는 방법이 있습니다. 필요에 따라 다를 수 있습니다.
환경에 따라 달라질 수 있으니 확인하세요.
```

### ✅ 올바른 작성

```markdown
# 환경 파일 설정

GeoPlanet 개발을 위해 필수 환경 변수를 설정해야 합니다.

## 프론트엔드 설정 (apps/web/.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ENABLE_3D_MAP=true
```

## 백엔드 설정 (apps/server/.env.local)

```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## 설정 확인

모든 환경 변수가 올바르게 설정되었는지 확인:

```bash
pnpm dev
```

프론트엔드와 백엔드가 각각 3000, 3001 포트에서 시작됩니다.
```

---

**중요**: 이 규칙은 프로젝트 가이드 및 문서 작성 시 **항상** 적용됩니다.
