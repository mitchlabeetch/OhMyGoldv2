# OhMyGold Design System

> Implementing Gold's Gym brand DNA — bold, high-contrast, performance-focused.

## Design Tokens

All tokens are defined in `packages/ui-shared/src/tokens/`.

### Colors

| Category | Token | Value |
|----------|-------|-------|
| Brand | `brand.gold` | `#FFEC00` |
| Brand | `brand.goldDark` | `#D4C400` |
| Brand | `brand.black` | `#000000` |
| Brand | `brand.charcoal` | `#231F20` |
| Success | `semantic.success` | `#22C55E` |
| Error | `semantic.error` | `#EF4444` |
| Warning | `semantic.warning` | `#F59E0B` |
| Info | `semantic.info` | `#3B82F6` |

**Contrast ratios (WCAG 2.1 AA+):**
- Gold (#FFEC00) on Black (#000): **21:1** ✅
- White (#FAFAFA) on Iron (#1A1A1A): **15.4:1** ✅
- All semantic colors on dark backgrounds: **≥ 4.5:1** ✅

> ⚠️ **Never use gold as body text on light backgrounds** — contrast fails below AA.

### Typography

| Style | Size | Weight | Use case |
|-------|------|--------|----------|
| `display.xl` | 56px | 800 | Hero headlines |
| `display.lg` | 48px | 800 | Section titles |
| `heading.xl` | 36px | 700 | Page titles |
| `heading.lg` | 30px | 700 | Card headings |
| `heading.md` | 24px | 600 | Widget titles |
| `heading.sm` | 20px | 600 | Sub-section heads |
| `body.lg` | 18px | 400 | Large body text |
| `body.md` | 16px | 400 | Standard body |
| `body.sm` | 14px | 400 | Secondary text |
| `body.xs` | 12px | 500 | Labels, captions |

**Fonts:** Inter (UI), JetBrains Mono (data/code)

### Spacing (4px base)

`xs: 4px` · `sm: 8px` · `md: 12px` · `base: 16px` · `lg: 24px` · `xl: 32px` · `2xl: 48px` · `3xl: 64px` · `4xl: 96px`

---

## Component Library

Located in `packages/ui-shared/src/components/`.

### Button

```tsx
import { Button } from '@ohmygold/ui-shared';

<Button variant="primary" size="lg">Se connecter</Button>
<Button variant="secondary" isLoading>Chargement…</Button>
<Button variant="danger" leftIcon={<Trash2 />}>Supprimer</Button>
<Button variant="gold-outline" fullWidth>S'inscrire</Button>
```

**Variants:** `primary` · `secondary` · `outline` · `ghost` · `danger` · `success` · `gold-outline`  
**Sizes:** `sm` (32px) · `md` (40px) · `lg` (48px) · `xl` (56px)

### Input

```tsx
import { Input } from '@ohmygold/ui-shared';

<Input
  label="Adresse e-mail"
  type="email"
  placeholder="votre@email.fr"
  errorMessage="E-mail invalide"
  required
/>
<Input
  label="Mot de passe"
  type="password"
  showPasswordToggle
/>
```

### Badge

```tsx
import { Badge } from '@ohmygold/ui-shared';

<Badge variant="status" status="active" />
<Badge variant="role" role="coach" />
<Badge variant="count" count={5} />
<Badge variant="tag" label="VIP" />
```

### Toast

```tsx
import { ToastProvider, useToast } from '@ohmygold/ui-shared';

// Wrap app with provider
<ToastProvider><App /></ToastProvider>

// In component
const { toast } = useToast();
toast({ type: 'success', title: 'Membre créé !', description: 'Le profil a été enregistré.' });
toast({ type: 'error', title: 'Erreur', duration: 0 }); // persistent
```

---

## Accessibility

- All interactive elements: minimum **44×44px** touch target
- Focus indicators: **3px gold ring** with 2px offset
- ARIA labels on all icon-only buttons
- Screen reader text with `sr-only` for decorative content
- Reduced motion: respects `prefers-reduced-motion`
- Color never used as the only means of conveying information

---

## Dark Mode

Default theme is dark (Gold's Gym identity). Light mode available via `data-theme="light"` on `<html>`.

```ts
// Toggle theme
document.documentElement.setAttribute('data-theme', 'light');
document.documentElement.setAttribute('data-theme', 'dark');
```
