---
paths:
  - "/"
---

# 아키텍처 가이드

## 프론트엔드: FSD (Feature-Driven Design)

```
src/
├── app/        # Next.js App Router (최상위)
├── widgets/    # 여러 feature 조합
├── features/   # 독립적인 기능 모듈
├── entities/   # 도메인 엔티티 (데이터 모델, API, 스토어)
└── shared/     # 공유 유틸리티, UI, 훅
    ├── ui/
    ├── hooks/
    ├── utils/
    └── types/
```

### 의존성 방향 (아래로만 임포트)
```
app/ ← widgets/ ← features/ ← entities/ ← shared/
```

### FSD 계층 규칙

| 계층 | 임포트 가능 | 금지 |
|---|---|---|
| shared | 외부 라이브러리만 | 다른 내부 계층 |
| entities | shared | UI 컴포넌트 |
| features | shared, entities | 다른 feature, 상위 계층 |
| widgets | shared, entities, features | app |
| app | 모두 | - |

### Feature 파일 구조

**단순한 경우 (권장)**:
```
features/earth-viewer/
└── EarthGlobe.tsx
```

**복잡한 경우 (파일 많을 때만)**:
```
features/map-viewer/
├── MapViewer.tsx
├── model.ts
├── api.ts
└── index.ts
```

**규칙**:
- ✅ 단순할수록 좋음
- ❌ 과도한 폴더 계층화 금지
- ❌ 순환 의존성 금지

---

## 백엔드: 모듈식 NestJS

```
src/
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   └── dto/
│   └── gateway/
│       ├── events.gateway.ts
│       └── gateway.module.ts
├── common/
│   ├── decorators/
│   ├── filters/
│   └── guards/
└── config/
```

### 모듈 규칙
- ✅ 각 모듈은 독립적
- ✅ 단일 책임
- ✅ NestJS DI 사용
- ✅ `index.ts`를 통한 공개 API 내보내기
