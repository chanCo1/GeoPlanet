---
paths:
  - "/"
---

# 배포 체크리스트

## 배포 전 필수 검사

```bash
pnpm type-check   # TypeScript 에러 없음
pnpm lint         # ESLint 에러/경고 없음
pnpm test         # 모든 테스트 통과
pnpm build        # 빌드 성공
```

- [ ] `pnpm type-check` 통과
- [ ] `pnpm lint` 통과
- [ ] `pnpm test` 통과 (커버리지 70% 이상)
- [ ] `pnpm build` 성공
- [ ] 환경 변수 설정 확인
- [ ] 보안 검사 (하드코딩된 시크릿 없음)

## 배포 후 검증

- [ ] 서버 헬스 체크 응답 정상
- [ ] 주요 기능 동작 확인
- [ ] 에러 로그 모니터링
- [ ] 성능 지표 확인

## 롤백 계획

```bash
git revert <commit-hash>
pnpm build
# 재배포
```

## ❌ 배포 금지 상황

- 테스트 실패 상태
- TypeScript 에러 상태
- 하드코딩된 시크릿 포함
