# Phase 2 Audit Report — OhMyGold Design System & Shared Components

> **Auditor:** EXTREME SEVERITY Frontend Component Auditor  
> **Date:** 2026-05-01  
> **Repository:** `/mnt/agents/OhMyGoldv2-main`  
> **Roadmap:** `phase_02_design_system.md`  
> **Design Reference:** `DESIGN.MD`

---

## Summary

| Metric | Count |
|--------|-------|
| **Total Findings** | 47 |
| **CRITICAL** | 12 |
| **HIGH** | 16 |
| **MEDIUM** | 12 |
| **LOW** | 7 |

**Phase Status:** **INCOMPLETE** — Major deliverables are missing (a11y primitives, motion system, form library, mobile native components, Storybook). The phase cannot be considered complete.

---

## Item 2.1: Design Tokens

| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| All DESIGN.MD color tokens defined and exportable | PARTIAL | Role tokens use wrong names (`superAdmin`, `receptionist`, `member` vs spec `manager`, `employee`, `client`). `manager` role completely missing. | HIGH |
| Color contrast ratios verified | FAIL | No contrast verification function or automated check exists. CSS values manually typed; no programmatic validation. | HIGH |
| Typography scale covers all 10 tokens | PASS | All 10 tokens present (display.xl through body.xs). | — |
| Typography matches DESIGN.MD values | PARTIAL | `display.xl` lineHeight is `1.1` (spec: `1.05`), `heading.md` lineHeight is `1.3` (spec: `1.25`), `body.md` lineHeight is `1.5` (spec: `1.6`). | MEDIUM |
| Spacing scale covers all 9 tokens | PASS | All 9 named tokens present (xs through 4xl). | — |
| Dark mode tokens defined for all categories | PARTIAL | Dark tokens exist in colors.ts and tokens.css. **BUT** theme.ts only exports dark-mode values (no light mode variant). | MEDIUM |
| CSS custom properties render correctly in browser | PASS | tokens.css is comprehensive and imported in web app. | — |
| React Native theme object has matching values | PARTIAL | theme.ts exists but omits light-mode support and several CSS semantic tokens (`infoLight`, `warningLight`, etc.). | MEDIUM |
| Single source of truth (one token update → both platforms) | FAIL | Tailwind config lives in `apps/web/tailwind.config.ts`, NOT in `packages/ui-shared/src/tailwind.config.ts` as required. Web tokens are duplicated/hardcoded in Tailwind config rather than reading from `tokens/`. | CRITICAL |
| tailwind.config.ts in ui-shared | FAIL | `packages/ui-shared/src/tailwind.config.ts` does not exist. | CRITICAL |

### 2.1 Findings Detail

**CRITICAL-001: Missing `tailwind.config.ts` in `packages/ui-shared/src/`**
- **Item**: 2.1
- **Description**: The roadmap explicitly requires `packages/ui-shared/src/tailwind.config.ts` as a deliverable. It does not exist. The Tailwind config is instead located at `apps/web/tailwind.config.ts`, coupling the design system to the web app and breaking the "single source of truth" requirement.
- **Impact**: Any token change requires editing two files (tokens/*.ts + apps/web/tailwind.config.ts). Mobile and other consumers cannot consume a unified Tailwind theme.
- **Fix Required**: Create `packages/ui-shared/src/tailwind.config.ts` that derives colors/spacing/fonts directly from the token TypeScript files, then have `apps/web/tailwind.config.ts` extend it.

**CRITICAL-002: Tailwind config hardcodes token values instead of importing from tokens/**
- **Item**: 2.1
- **Description**: `apps/web/tailwind.config.ts` hardcodes hex values like `gold: { 500: "#F59E0B" }` which differs from the brand gold `#FFEC00` defined in tokens. The `gold` palette in Tailwind is actually an amber scale, not the Gold's Gym brand gold.
- **Impact**: Visual inconsistency. Buttons use `from-gold-500 to-gold-600` which renders amber/orange instead of brand gold.
- **Fix Required**: Tailwind `gold` palette must map exactly to brand gold tokens: `500: #FFEC00`, `600: #D4C400`, etc.

**HIGH-001: Role color token names do not match DESIGN.MD spec**
- **Item**: 2.1
- **Description**: tokens/colors.ts defines `superAdmin`, `admin`, `coach`, `receptionist`, `member`, `visitor`. DESIGN.MD §2.5 specifies: `admin`, `manager`, `employee`, `coach`, `client`, `visitor`. `manager` and `employee`/`client` are missing or misnamed.
- **Impact**: Role-based UI coloring will fail when the backend returns `manager` or `client` roles. The `superAdmin` token is not in the spec.
- **Fix Required**: Rename role tokens to exactly match DESIGN.MD: `manager` (#3B82F6), `employee` (#F59E0B), `client` (#FFEC00). Remove `superAdmin` or document deviation.

**HIGH-002: No contrast ratio verification function**
- **Item**: 2.1
- **Description**: The roadmap requires a "Contrast ratio verification function" as a deliverable. None exists in the codebase.
- **Impact**: WCAG AA compliance cannot be automatically verified. Manual checking is error-prone.
- **Fix Required**: Implement a `verifyContrast()` utility in `packages/ui-shared/src/tokens/` that computes WCAG contrast ratios and asserts AA/AAA compliance.

**HIGH-003: Shadow token values deviate from DESIGN.MD spec**
- **Item**: 2.1
- **Description**: DESIGN.MD §2.1 and roadmap specify `card: 0 2px 8px rgba(0,0,0,0.08)`. `tokens.css` and `shadows.ts` use `rgba(0,0,0,0.3)` — nearly 4× darker. Same deviation for `elevated` and `modal`.
- **Impact**: Shadows are far too heavy for light mode and will look wrong on white backgrounds. Dark mode values may be acceptable but light mode is broken.
- **Fix Required**: Provide separate light/dark shadow values or align to the spec's 0.08/0.12/0.16 opacity values.

**MEDIUM-001: Typography line-height and letter-spacing deviations**
- **Item**: 2.1
- **Description**: `display.xl` lineHeight should be `1.05` (spec) but is `1.1`. `heading.md` should be `1.25` but is `1.3`. `body.md` should be `1.6` but is `1.5`. `display.lg` letterSpacing should be `-0.02em` but is `-0.03em`.
- **Impact**: Minor visual drift from the design specification. May affect text fitting for French translations.
- **Fix Required**: Align all token values exactly to DESIGN.MD §3.2 table.

**MEDIUM-002: `theme.ts` (React Native) lacks light-mode support**
- **Item**: 2.1
- **Description**: The roadmap requires both light and dark mode tokens. `theme.ts` only exports dark surface/text colors. There is no `themeLight` or `theme` switcher.
- **Impact**: Mobile app cannot support light mode or system-preference switching.
- **Fix Required**: Export both `themeDark` and `themeLight` objects from `theme.ts`, with a provider that switches based on `Appearance` API.

---

## Item 2.2: Build Shared UI Component Library

| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| Button: all 7 variants, 4 sizes, all states | PARTIAL | Variants and sizes exist. **BUT** primary variant uses `bg-gradient-to-r from-gold-500 to-gold-600` which is amber (#F59E0B), not brand gold (#FFEC00). Hover, active, focus, disabled, loading present. No `onPress` prop (web-only `onClick`). | HIGH |
| Input: all types | PARTIAL | Types: text, password, email, number, search, tel, date, url. **Missing**: `barcode` type (required by roadmap). `time` type also missing. | HIGH |
| Card: content/metric/profile variants | PASS | All three variants implemented. | — |
| Card matches DESIGN.MD specs | PARTIAL | Content Card does not expose `icon`, `title`, `subtitle`, `actions` slots — it’s just a generic wrapper. Metric Card value text uses `text-white` instead of `font.display.lg` token. Profile Card hardcodes French "Actif/Inactif" labels. | MEDIUM |
| Badge: status/role/tags | PARTIAL | Status, role, tag, count variants exist. **Missing**: gold tag variant ("premium" tag). Labels hardcoded in French with no i18n. | MEDIUM |
| Avatar: 5 sizes, fallback, status dot | PASS | xs/sm/md/lg/xl, circle/rounded, initials fallback, online/away/offline status dot. | — |
| Modal: web + mobile bottom sheet | FAIL | Web modal exists with Framer Motion. **Mobile bottom sheet completely missing**. No `.native.tsx` version. | CRITICAL |
| Toast: 4 types, auto-dismiss, stacking, actions | PASS | 4 types, correct default durations, max-3 stacking, action button support, top-right position. | — |
| Toast mobile position | FAIL | Toast only renders top-right (web desktop). No mobile top position. No `.native.tsx`. | CRITICAL |
| All components pass axe accessibility audit | FAIL | No axe-core tests exist. No automated a11y testing configured. | CRITICAL |
| All components render in Storybook with controls | FAIL | No `.stories.tsx` files exist anywhere in `packages/ui-shared/`. | CRITICAL |
| Dark mode variants for all components | PARTIAL | Components use `bg-surface-card`, `text-white`, etc. which map to dark mode in Tailwind config. Light mode is not well supported because Tailwind tokens are dark-first. | MEDIUM |
| Loading/skeleton states for data-dependent components | PARTIAL | Skeleton component exists but uses `animate-pulse` instead of the required shimmer sweep animation. Card has `isLoading` prop. No skeleton for Input, Badge, or Avatar in their own files. | MEDIUM |
| Native mobile implementations | FAIL | **Zero** `.native.tsx` files exist in `packages/ui-shared/src/components/`. Every component is web-only. | CRITICAL |
| Drawer component | FAIL | Drawer is listed in the component library requirements but does not exist anywhere in `packages/ui-shared/src/components/`. | CRITICAL |

### 2.2 Findings Detail

**CRITICAL-003: Zero native (`.native.tsx`) mobile component implementations**
- **Item**: 2.2
- **Description**: The roadmap requires every component to have a web implementation (`Component.tsx`) AND a mobile implementation (`Component.native.tsx`). The repository contains 0 `.native.tsx` files across all 10 required components. The mobile app (`apps/mobile/src/`) only has an `AuthProvider.tsx` and auth store.
- **Impact**: The mobile app cannot use any shared UI components. Phase 2 deliverable of "web + mobile" component library is not met.
- **Fix Required**: Create `Button.native.tsx`, `Input.native.tsx`, `Card.native.tsx`, `Badge.native.tsx`, `Avatar.native.tsx`, `Modal.native.tsx`, `Toast.native.tsx`, `Alert.native.tsx`, `Skeleton.native.tsx`, and `Drawer.native.tsx`.

**CRITICAL-004: Drawer component entirely missing**
- **Item**: 2.2
- **Description**: The roadmap lists Drawer as a required shared component (for mobile bottom sheet, web side panel). There is no `packages/ui-shared/src/components/Drawer/` directory or file.
- **Impact**: Filter panels, settings drawers, and mobile hamburger menus have no component to build from.
- **Fix Required**: Create `Drawer.tsx`, `Drawer.native.tsx`, `Drawer.types.ts`, and `Drawer/index.ts`.

**CRITICAL-005: No Storybook stories for any component**
- **Item**: 2.2
- **Description**: Success criterion: "All components render in Storybook with controls." No `.stories.tsx` files exist in `packages/ui-shared/`.
- **Impact**: Components cannot be visually regression-tested or interactively documented. Designers and QA have no isolated playground.
- **Fix Required**: Add Storybook configuration and at least one story per component with Controls/Args.

**CRITICAL-006: No axe accessibility audit integration**
- **Item**: 2.2
- **Description**: Success criterion: "All components pass axe accessibility audit." No axe-core test files, no `jest-axe`, no automated a11y checks in CI.
- **Impact**: WCAG 2.1 AA compliance cannot be verified. High legal and brand risk.
- **Fix Required**: Install `@axe-core/react` or `jest-axe`, write accessibility tests for every component, enforce in CI.

**HIGH-004: Primary Button renders amber/orange instead of brand gold**
- **Item**: 2.2
- **Description**: `Button.tsx` uses `bg-gradient-to-r from-gold-500 to-gold-600`. The Tailwind `gold-500` is mapped to `#F59E0B` (amber), not `#FFEC00` (brand gold). DESIGN.MD §5.1 specifies Primary background = `#FFEC00`.
- **Impact**: Brand color is incorrect on the most prominent CTA element.
- **Fix Required**: Use `bg-[#FFEC00]` or fix Tailwind gold palette, with `text-black` as specified.

**HIGH-005: Input component missing `barcode` type**
- **Item**: 2.2
- **Description**: Roadmap explicitly requires barcode input type: "Barcode — Camera/Barcode icon — [Mobile] Triggers camera scanner". `Input.types.ts` only lists `text | password | email | number | search | tel | date | url`.
- **Impact**: Employee check-in flow (core feature) cannot be built.
- **Fix Required**: Add `barcode` to `InputType`, add barcode icon and camera trigger behavior in `.native.tsx`.

**HIGH-006: Modal sizes do not match DESIGN.MD pixel specifications**
- **Item**: 2.2
- **Description**: DESIGN.MD §5.5 specifies modal max-widths: sm=560px, md=720px, lg=960px. The code uses Tailwind classes: `sm: max-w-md` (448px), `md: max-w-2xl` (672px), `lg: max-w-4xl` (896px). All are smaller than spec.
- **Impact**: Modals will be narrower than designed, potentially breaking form layouts.
- **Fix Required**: Use exact pixel values or custom max-width utilities: `max-w-[560px]`, `max-w-[720px]`, `max-w-[960px]`.

**MEDIUM-003: Modal focus trap is incomplete**
- **Item**: 2.2
- **Description**: `Modal.tsx` moves focus to the first focusable element on open but does NOT trap Tab cycling within the modal (Tab from last element should jump to first). It also does NOT restore focus to the trigger element on close.
- **Impact**: Keyboard users can Tab out of the modal into the background, violating WCAG 2.1 §2.1.2.
- **Fix Required**: Implement full focus trap with `Tab`/`Shift+Tab` cycling and focus restoration on unmount.

**MEDIUM-004: Badge labels hardcoded in French, no i18n**
- **Item**: 2.2 / 2.3
- **Description**: `Badge.tsx` hardcodes French strings: `Actif`, `Inactif`, `En attente`, `Expiré`, `Suspendu`, `Super Admin`, `Admin`, `Coach`, `Réceptionniste`, `Membre`, `Visiteur`. There is no `t()` usage.
- **Impact**: Badge text cannot switch to English. Violates the i18n-from-day-one principle.
- **Fix Required**: Accept `label` prop or use `useTranslation()` with namespace keys for all badge labels.

---

## Item 2.3: Implement i18n Framework with FR/EN

| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| Language switching works at runtime (web + mobile) | PARTIAL | Web switching works via `i18n.changeLanguage()`. Mobile switching not tested; no UI control for language switch in mobile app. | MEDIUM |
| French locale detected automatically | PASS | Web uses `i18next-browser-languagedetector`. Mobile uses `expo-localization` (device locale). | — |
| DESIGN.MD French terms translated correctly | PARTIAL | "Tableau de bord", "Membres" present. **Missing**: "Cours collectifs" (uses "Cours"), "Inscriptions", "Séance d'essai", "Entre dans l'arène". | MEDIUM |
| Pluralization works in both languages | FAIL | No pluralization keys or ICU format usage visible. No `count` interpolation with plural forms. | HIGH |
| Date/number formatting localized | FAIL | No `Intl.DateTimeFormat` or `Intl.NumberFormat` wrappers found. No date/currency formatting utilities. | HIGH |
| Text expansion handled | PARTIAL | Buttons use flex, labels are top-aligned in Input. No explicit max-width or truncation rules for French. No documented French-length testing. | MEDIUM |
| Fallback to French when key missing | PASS | `fallbackLng: "fr"` configured in both web and mobile. | — |
| Currency formatting: EUR with € symbol, FR format | FAIL | No currency formatting utility found. No `Intl.NumberFormat` with `currency: 'EUR'`. | HIGH |
| 7 namespace JSON files per locale | PARTIAL | Web has 7 namespaces. **BUT** names differ from roadmap spec: `payments` instead of `billing`, `dashboard` instead of `navigation`. Mobile has only 3 namespaces. | HIGH |
| Key extraction script | FAIL | No script to scan source files for `t('key')` patterns. | HIGH |
| LanguageSwitcher component | FAIL | No `LanguageSwitcher` component in `packages/ui-shared/src/components/`. Web topbar has a raw language toggle button. | HIGH |
| ICU message format | FAIL | No ICU format configuration or usage for complex messages. | MEDIUM |

### 2.3 Findings Detail

**HIGH-007: Mobile i18n only has 3 of 7 required namespaces**
- **Item**: 2.3
- **Description**: Roadmap requires 7 namespaces: common, auth, navigation, members, classes, billing, errors. Mobile only implements common, auth, dashboard.
- **Impact**: Mobile app cannot translate members, classes, billing, or error screens.
- **Fix Required**: Add `members.json`, `classes.json`, `billing.json`, `errors.json`, `navigation.json` to `apps/mobile/src/i18n/locales/{fr,en}/`.

**HIGH-008: i18n namespace naming deviates from roadmap specification**
- **Item**: 2.3
- **Description**: Web uses `payments` and `dashboard` namespaces. Roadmap specifies `billing` and `navigation`. This will cause confusion when cross-referencing documentation.
- **Impact**: Namespace drift between web and mobile implementations.
- **Fix Required**: Align web namespace names to roadmap spec: rename `payments` → `billing`, `dashboard` → `navigation` (or document the deviation).

**HIGH-009: No i18n key extraction script**
- **Item**: 2.3
- **Description**: Roadmap explicitly requires "Add i18n key extraction script: scans source files for t('key') patterns". No such script exists.
- **Impact**: Cannot verify translation coverage. Missing keys will slip into production.
- **Fix Required**: Create a Node script that walks `src/` and extracts `t('...')` patterns into a key manifest for comparison against JSON files.

**HIGH-010: No localized date/number/currency formatting utilities**
- **Item**: 2.3
- **Description**: DESIGN.MD §8.3 and §8.4 specify French date format `DD/MM/YYYY`, currency `1 234,56 €`, phone `+33 X XX XX XX XX`. No formatting utilities exist.
- **Impact**: All dates, prices, and phone numbers will display in raw/unformatted strings or default browser locale.
- **Fix Required**: Create `packages/ui-shared/src/i18n/formatters.ts` with `formatDate()`, `formatCurrency()`, `formatPhone()` that respect the active locale.

**MEDIUM-005: Missing ICU pluralization configuration**
- **Item**: 2.3
- **Description**: Roadmap specifies "ICU message format for pluralization and interpolation". `i18n.config.ts` does not configure `i18next-icu` or similar.
- **Impact**: French plural forms (0 résultats, 1 résultat, 2 résultats) cannot be correctly rendered.
- **Fix Required**: Add `i18next-icu` plugin and define plural keys in translation files.

---

## Item 2.4: Build Accessibility Primitives

| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| Skip-to-content link visible on first Tab | PARTIAL | CSS class `.skip-to-content` exists in `apps/web/src/index.css`. **BUT** no actual `<SkipToContent>` component exists in `packages/ui-shared/src/a11y/`. | HIGH |
| FocusTrap keeps Tab cycling within modal/drawer | FAIL | No `FocusTrap` component or `useFocusTrap` hook exists. Modal has partial focus management but no cycle or restoration. | CRITICAL |
| LiveRegion announces dynamic content | FAIL | No `LiveRegion` component exists. | CRITICAL |
| VisuallyHidden renders screen-reader-only text | FAIL | No `VisuallyHidden` component exists. | CRITICAL |
| KeyboardNavigation supports arrow keys, Enter, Space, Escape | FAIL | No `KeyboardNavigation` component or `useKeyboardNavigation` hook exists. | CRITICAL |
| ReducedMotion wrapper disables animations | FAIL | No `ReducedMotion` component or `useReducedMotion` hook exists. CSS `@media (prefers-reduced-motion)` exists in tokens.css but no programmatic React wrapper. | CRITICAL |
| ScreenReaderAnnouncer programmatic announcements | FAIL | No `ScreenReaderAnnouncer.ts` exists. | CRITICAL |
| All interactive elements have accessible names | PARTIAL | Buttons and inputs generally have labels/aria-labels. **BUT** hardcoded French `aria-label` strings (e.g., "Fermer") without i18n. | MEDIUM |
| Color contrast ratios >= 4.5:1 | FAIL | No verification performed. | CRITICAL |
| Touch targets >= 44x44px on mobile | FAIL | No mobile components exist to verify. | CRITICAL |
| axe-core automated tests pass (score >= 95) | FAIL | No axe-core tests exist. | CRITICAL |

### 2.4 Findings Detail

**CRITICAL-007: Entire `a11y/` directory missing from `packages/ui-shared/src/`**
- **Item**: 2.4
- **Description**: The roadmap requires `packages/ui-shared/src/a11y/` with 7 components + 4 hooks + index.ts. The directory does not exist. None of the required primitives are implemented.
- **Impact**: WCAG 2.1 AA+ compliance cannot be achieved. All downstream feature screens (Phases 4-9) will lack accessibility foundations.
- **Fix Required**: Create the full `a11y/` directory with all specified files:
  - `SkipToContent.tsx`, `FocusTrap.tsx`, `LiveRegion.tsx`, `VisuallyHidden.tsx`, `KeyboardNavigation.tsx`, `ReducedMotion.tsx`, `ScreenReaderAnnouncer.ts`
  - `hooks/useFocusTrap.ts`, `hooks/useKeyboardNavigation.ts`, `hooks/useReducedMotion.ts`, `hooks/useAnnounce.ts`
  - `index.ts`

**HIGH-011: Hardcoded French `aria-label` strings without i18n**
- **Item**: 2.4
- **Description**: Modal close button has `aria-label="Fermer"`, password toggle has `aria-label="Masquer le mot de passe"`, Toast dismiss has `aria-label="Fermer"`, Alert dismiss has `aria-label="Fermer"`. These are not translatable.
- **Impact**: Screen reader users in English locale hear French labels.
- **Fix Required**: Use `useTranslation()` for all `aria-label` strings.

---

## Item 2.5: Create Animation/Motion System

| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| Duration tokens applied: fast/normal/medium/slow | PARTIAL | Tokens exist in `animations.ts` but no `motion/` system consumes them uniformly. Modal and Toast hardcode `duration: 0.2` instead of referencing tokens. | MEDIUM |
| Easing curves applied: standard/decelerate/accelerate/bounce | PARTIAL | Tokens exist. Modal uses inline `[0.4, 0, 0.2, 1]` array instead of imported `easing.standard`. | MEDIUM |
| Page transitions: fade 200ms (web), slide 300ms (mobile) | FAIL | No page transition system exists. | CRITICAL |
| Micro-interactions: button press, tab switch, etc. | FAIL | No `micro-interactions.ts` file. Button uses Tailwind `active:scale-[0.98]` only. | HIGH |
| Skeleton loading: shimmer animation | FAIL | Skeleton uses `animate-pulse` (opacity fade). DESIGN.MD §6.6 requires a shimmer sweep (highlight left→right, 1.5s infinite linear). | HIGH |
| prefers-reduced-motion: all animations disabled | PARTIAL | CSS `@media` exists in tokens.css. No React wrapper for programmatic reduced-motion checks in Framer Motion or Reanimated. | MEDIUM |
| 60fps maintained on target devices | FAIL | No performance testing or `will-change` / `useNativeDriver` enforcement found. | MEDIUM |
| Only transform and opacity used for animations | PARTIAL | Modal uses `scale` + `y` (transform only). Toast uses `x` + `scale` + `opacity`. Good. But no audit script enforces this. | LOW |

### 2.5 Findings Detail

**CRITICAL-008: Entire `motion/` directory missing from `packages/ui-shared/src/`**
- **Item**: 2.5
- **Description**: Roadmap requires `packages/ui-shared/src/motion/` with `transitions.ts`, `variants.ts`, `micro-interactions.ts`, `skeleton.tsx`, `AnimatePresence.tsx`, and 3 hooks. Directory does not exist.
- **Impact**: No shared animation system. Components hardcode animation values locally. Inconsistent motion language across the app.
- **Fix Required**: Create the full `motion/` directory with all specified files, plus `.native.tsx` variants for mobile.

**HIGH-012: Skeleton component uses `animate-pulse` instead of shimmer sweep**
- **Item**: 2.5
- **Description**: DESIGN.MD §6.6 specifies: "Shimmer highlight: white at 20% opacity, animated left→right, 1.5s infinite linear." The `Skeleton.tsx` component uses Tailwind's `animate-pulse` which is a simple opacity fade.
- **Impact**: Skeleton loading does not match the design spec and looks generic.
- **Fix Required**: Implement CSS shimmer with `@keyframes` sliding a gradient across the skeleton block.

---

## Item 2.6: Implement Shared Layout Components

| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| Sidebar: 256px expanded, 72px collapsed, gold active indicator | PARTIAL | `Sidebar.tsx` has `w-64` (256px) and `w-16` (64px — spec says 72px). Active state uses `bg-gold-400/10 text-gold-400` but **no gold left-border indicator** as required by DESIGN.MD §5.4. | MEDIUM |
| Topbar: 64px fixed, global search, notification bell, user menu | PARTIAL | Height is 64px fixed. Has notification bell and user menu. **Missing**: global search bar in topbar. | HIGH |
| Bottom tabs: 56dp + safe area, gold active indicator, center action | PARTIAL | Web bottom tabs exist (`h-16` = 64px, not 56dp). No center elevated action button. No safe area handling. | MEDIUM |
| Content area: proper padding, scrollable, respects sidebar | PASS | `AppShell.tsx` implements content area with `pt-16 pb-16` and sidebar offset. | — |
| Container: max-width 1400px at 2xl | FAIL | No `Container.tsx` component exists in `packages/ui-shared/src/layout/` or anywhere. | HIGH |
| Grid: 12-column, gap support, responsive | FAIL | No `Grid.tsx` component exists. | HIGH |
| Responsive: sidebar → hamburger on mobile | PASS | `AppShell.tsx` handles mobile drawer with backdrop. | — |
| Dark mode: all layout components switch correctly | PARTIAL | Layouts use dark-first Tailwind tokens. Light mode switching not verified. | MEDIUM |
| Layout components in `packages/ui-shared/src/layout/` | FAIL | Layout components live in `apps/web/src/components/layout/` instead of the shared package. | HIGH |
| WebLayout.tsx combined wrapper | FAIL | No `WebLayout.tsx` in shared package. `AppShell.tsx` in web app serves this role. | MEDIUM |
| MobileLayout.tsx combined wrapper | FAIL | No `MobileLayout.tsx` exists anywhere. | CRITICAL |
| StackHeader.tsx | FAIL | No `StackHeader.tsx` exists anywhere. | CRITICAL |

### 2.6 Findings Detail

**CRITICAL-009: Mobile layout primitives entirely missing**
- **Item**: 2.6
- **Description**: No `MobileLayout.tsx`, `StackHeader.tsx`, or mobile-specific `BottomTabs.native.tsx` exist. The mobile app (`apps/mobile/src/`) has no layout system at all.
- **Impact**: Mobile app cannot render any navigable screen structure.
- **Fix Required**: Create `packages/ui-shared/src/layout/MobileLayout/` with `BottomTabs.native.tsx`, `StackHeader.native.tsx`, `MobileLayout.native.tsx`.

**HIGH-013: Layout components are not in the shared package**
- **Item**: 2.6
- **Description**: `Sidebar.tsx`, `Topbar.tsx`, `AppShell.tsx`, `BottomTabs.tsx` all live in `apps/web/src/components/layout/`. The roadmap requires them in `packages/ui-shared/src/layout/`.
- **Impact**: Mobile app and any future web apps cannot reuse layouts. Violates monorepo shared-package architecture.
- **Fix Required**: Migrate all layout components to `packages/ui-shared/src/layout/` with both `.tsx` and `.native.tsx` implementations.

**HIGH-014: Container and Grid components missing**
- **Item**: 2.6
- **Description**: Roadmap requires `Container.tsx` (max-width responsive) and `Grid.tsx` (12-column). Neither exists.
- **Impact**: Page layouts will be inconsistent. No standardized max-width or column system.
- **Fix Required**: Create `Container.tsx` and `Grid.tsx` in `packages/ui-shared/src/layout/`.

---

## Item 2.7: Create Form Component Library

| Criterion | Status | Finding | Severity |
|-----------|--------|---------|----------|
| Form wrapper integrates with React Hook Form | FAIL | No `Form.tsx` exists. | CRITICAL |
| FormField wrapper (label + input + error) | FAIL | No `FormField.tsx` exists. | CRITICAL |
| TextField with RHF integration | FAIL | No `TextField.tsx` exists. | CRITICAL |
| PasswordField with show/hide toggle | FAIL | No `PasswordField.tsx` exists. Input has password toggle but no RHF. | CRITICAL |
| EmailField with validation | FAIL | No `EmailField.tsx` exists. | CRITICAL |
| PhoneField with +33 format mask | FAIL | No `PhoneField.tsx` exists. | CRITICAL |
| Checkbox with label | FAIL | No `Checkbox.tsx` exists. | CRITICAL |
| RadioGroup | FAIL | No `RadioGroup.tsx` exists. | CRITICAL |
| Switch toggle | FAIL | No `Switch.tsx` exists. | CRITICAL |
| Select dropdown | FAIL | No `Select.tsx` exists. | CRITICAL |
| DatePicker (native mobile, custom web) | FAIL | No `DatePicker.tsx` exists. | CRITICAL |
| FileUpload (drag-drop web, camera mobile) | FAIL | No `FileUpload.tsx` exists. | CRITICAL |
| SearchField with debounce | FAIL | No `SearchField.tsx` exists. `SearchInput.tsx` in web app is not a shared form component. | CRITICAL |
| All fields: proper label association, aria-describedby | FAIL | No form field components exist to evaluate. | CRITICAL |
| Form submission: loading, success, error handling | FAIL | No `Form.tsx` wrapper exists. | CRITICAL |
| Auto-fill supported | PARTIAL | `Input.tsx` supports standard HTML autocomplete via spread props. | LOW |
| Phone field formats: +33 X XX XX XX XX | FAIL | No phone formatter exists. | CRITICAL |

### 2.7 Findings Detail

**CRITICAL-010: Entire `forms/` directory missing from `packages/ui-shared/src/`**
- **Item**: 2.7
- **Description**: The roadmap requires 13 form components in `packages/ui-shared/src/forms/`. The directory does not exist. Zero form components are implemented.
- **Impact**: Every form in Phases 4-9 (auth, member enrollment, class creation, payment, settings) has no component library to build from. This is a total blocker for all downstream feature development.
- **Fix Required**: Create the full `forms/` directory with:
  - `Form.tsx`, `FormField.tsx`, `TextField.tsx`, `PasswordField.tsx`, `EmailField.tsx`, `PhoneField.tsx`, `Checkbox.tsx`, `RadioGroup.tsx`, `Switch.tsx`, `Select.tsx`, `DatePicker.tsx`, `FileUpload.tsx`, `SearchField.tsx`
  - Each with `.native.tsx` counterpart, RHF integration, Zod validation, and accessible labels.

---

## Additional Cross-Cutting Findings

**HIGH-015: No unit tests for any shared component**
- **Item**: 2.2–2.7
- **Description**: No `.test.tsx` or `.spec.tsx` files exist in `packages/ui-shared/`. The roadmap calls for "comprehensive unit tests" for accessibility primitives and components.
- **Impact**: Refactoring is high-risk. Regressions will not be caught in CI.
- **Fix Required**: Add Vitest/Jest + React Testing Library and achieve minimum 70% coverage on shared components.

**MEDIUM-006: `packages/ui-shared/src/index.ts` does not export utilities needed by consumers**
- **Item**: 2.1–2.2
- **Description**: `index.ts` exports tokens, theme, components, and `cn()`. It does not export the `Breakpoint` type, `Shadow` type, `Duration` type, or `Elevation` type directly. Consumers must deep-import.
- **Impact**: API surface is incomplete; consumers may deep-import internal files.
- **Fix Required**: Add all type exports to `index.ts`.

**LOW-001: `Input.tsx` hardcodes French password toggle aria-label**
- **Item**: 2.2
- **Description**: `aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}` is not translatable.
- **Fix Required**: Use `useTranslation('auth')` for password visibility toggle labels.

**LOW-002: `theme.ts` missing `duration.deliberate` export**
- **Item**: 2.1
- **Description**: `theme.ts` exports `durationFast`, `durationNormal`, `durationMedium`, `durationSlow` but omits `durationDeliberate` (600ms).
- **Fix Required**: Add `durationDeliberate: animations.duration.deliberate` to theme.ts.

**LOW-003: `Alert.tsx` `variant.includes("critical")` is fragile**
- **Item**: 2.2
- **Description**: `!variant.includes("critical")` relies on string matching. If `variant` is undefined or changes, the dismiss button behavior is unpredictable.
- **Fix Required**: Use explicit `variant !== "critical"`.

---

## Recommended Fix Priority Order

### Wave 1: CRITICAL Blockers (Must Fix Before Any Feature Work)
1. **Create `packages/ui-shared/src/forms/`** — Form library with RHF + Zod integration (13 components, 13 `.native.tsx`)
2. **Create `packages/ui-shared/src/a11y/`** — All 7 primitives + 4 hooks (WCAG compliance blocker)
3. **Create `packages/ui-shared/src/motion/`** — Animation system with `.native.tsx` variants
4. **Create `.native.tsx` implementations** for ALL existing components (Button, Input, Card, Badge, Avatar, Modal, Toast, Alert, Skeleton, Drawer)
5. **Create `Drawer.tsx`** and `Drawer.native.tsx`

### Wave 2: HIGH Severity (Fix Before Phase 2 Sign-Off)
6. **Create `packages/ui-shared/src/tailwind.config.ts`** and have web config extend it
7. **Fix Tailwind gold palette** to use brand gold `#FFEC00`
8. **Migrate layout components** to `packages/ui-shared/src/layout/` with `.native.tsx`
9. **Add missing i18n namespaces** to mobile (members, classes, billing, errors, navigation)
10. **Add i18n key extraction script** and `LanguageSwitcher` component
11. **Add localized date/currency/phone formatters**
12. **Add Storybook** with stories for every component
13. **Add axe-core** automated accessibility tests
14. **Fix role token names** to match DESIGN.MD (`manager`, `employee`, `client`)
15. **Implement shimmer Skeleton** animation
16. **Add unit tests** for all shared components

### Wave 3: MEDIUM & LOW (Polish Before Phase 2 Closure)
17. **Fix typography token values** (lineHeight, letterSpacing)
18. **Complete Modal focus trap** with Tab cycling and focus restoration
19. **Add global search bar** to Topbar
20. **Add Container and Grid** layout components
21. **Translate all hardcoded French strings** in aria-labels and Badge labels
22. **Add light-mode support** to `theme.ts`
23. **Add contrast verification utility**
24. **Implement ICU pluralization**
25. **Add `barcode` and `time` Input types**
26. **Fix Modal sizes** to exact pixel widths (560/720/960)

---

## Completion Checklist (Reconstructed from Roadmap)

| Deliverable | Exists | Native (.native.tsx) | Tests | Storybook |
|-------------|--------|----------------------|-------|-----------|
| **Tokens** (colors, typography, spacing, breakpoints, shadows, animations) | YES | N/A | NO | N/A |
| **tailwind.config.ts** in ui-shared | NO | N/A | NO | N/A |
| **theme.ts** (RN) | YES | N/A | NO | N/A |
| **Button** | YES | NO | NO | NO |
| **Input** | YES | NO | NO | NO |
| **Card** | YES | NO | NO | NO |
| **Badge** | YES | NO | NO | NO |
| **Avatar** | YES | NO | NO | NO |
| **Modal** | YES | NO | NO | NO |
| **Toast** | YES | NO | NO | NO |
| **Alert** | YES | NO | NO | NO |
| **Skeleton** | YES | NO | NO | NO |
| **Drawer** | NO | NO | NO | NO |
| **i18n config + 7 namespaces** (web) | YES | — | NO | N/A |
| **i18n config + 7 namespaces** (mobile) | PARTIAL (3/7) | — | NO | N/A |
| **LanguageSwitcher** | NO | NO | NO | NO |
| **SkipToContent** | NO | NO | NO | NO |
| **FocusTrap** | NO | NO | NO | NO |
| **LiveRegion** | NO | NO | NO | NO |
| **VisuallyHidden** | NO | NO | NO | NO |
| **KeyboardNavigation** | NO | NO | NO | NO |
| **ReducedMotion** | NO | NO | NO | NO |
| **ScreenReaderAnnouncer** | NO | NO | NO | NO |
| **motion/transitions.ts** | NO | NO | NO | NO |
| **motion/variants.ts** | NO | NO | NO | NO |
| **motion/micro-interactions.ts** | NO | NO | NO | NO |
| **motion/skeleton.tsx** | NO | NO | NO | NO |
| **WebLayout** (Sidebar, Topbar, ContentArea) | YES* | NO | NO | NO |
| **MobileLayout** (BottomTabs, StackHeader) | NO | NO | NO | NO |
| **Container** | NO | NO | NO | NO |
| **Grid** | NO | NO | NO | NO |
| **Form library** (13 components) | NO | NO | NO | NO |

*WebLayout components exist but are in `apps/web/` instead of `packages/ui-shared/`.

---

*End of Phase 2 Audit Report*
