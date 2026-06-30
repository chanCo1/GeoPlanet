---
paths:
  - "/apps/web/**"
---

# 컴포넌트 생성 규칙

## 필수 도구

```typescript
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/utils/cn';
```

- **`cn()`**: 모든 className 병합에 사용 (clsx + tailwind-merge)
- **`cva()`**: variant가 2개 이상인 컴포넌트에 사용

## cn 사용 규칙

```typescript
// ✅ 항상 cn()으로 className 병합
className={cn('base-class', condition && 'conditional-class', className)}

// ❌ 문자열 직접 병합 금지
className={`base-class ${className}`}
```

## cva 패턴 (variant가 있는 컴포넌트)

```typescript
const componentVariants = cva(
  // 1. base: 항상 적용되는 클래스 (배열 또는 문자열)
  ['inline-flex items-center rounded-sm transition-colors'],
  {
    variants: {
      variant: {
        primary: 'bg-primary text-on-primary',
        outline: 'border border-hairline-on-dark text-body',
      },
      size: {
        md: 'h-btn-primary px-md text-button',
        sm: 'h-btn-subscribe px-sm text-body-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

interface IProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof componentVariants> {}

export const Component: FC<IProps> = ({ variant, size, className, ...props }) => (
  <div className={cn(componentVariants({ variant, size }), className)} {...props} />
);
```

## 단순 컴포넌트 (variant 없음)

```typescript
// cva 없이 cn만 사용
export const Card: FC<IProps> = ({ className, ...props }) => (
  <div className={cn('rounded-xl bg-surface-card-dark', className)} {...props} />
);
```

## 인터페이스 규칙

```typescript
// ✅ HTML 요소 Props 상속 + VariantProps 교차
interface IProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

// ✅ children은 ReactNode로 명시
interface IProps {
  children: ReactNode;
}
```

## 파일 위치

| 용도 | 경로 |
|---|---|
| 재사용 UI 컴포넌트 | `src/shared/ui/ComponentName.tsx` |
| 공개 API | `src/shared/ui/index.ts`에 export |
| cn 유틸 | `src/shared/utils/cn.ts` |

## 디자인 토큰 (tailwind.config.ts 기준)

```
색상: primary, accent-turquoise, surface-card-dark, surface-elevated-dark
      hairline-on-dark, muted, trading-down, info-ring
높이: h-btn-primary(40px), h-btn-subscribe(28px)
간격: gap-xs, px-sm, px-md, px-lg
폰트: text-button, text-body-sm, text-title-sm
```
