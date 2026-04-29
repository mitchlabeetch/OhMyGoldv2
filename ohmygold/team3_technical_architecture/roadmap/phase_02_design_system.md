# Phase 2: Design System & Shared Components

> **Phase ID:** P2
> **Duration:** 2-3 weeks
> **Prerequisites:** Phase 1 complete (monorepo, TypeScript, dev environments running)
> **Goal:** Build a comprehensive, accessible, i18n-ready design system that powers both web and mobile

---

## Phase Overview

Phase 2 implements the OhMyGold Design System as specified in DESIGN.MD. Every user-facing element in Phases 4-9 depends on the components, tokens, and patterns created here. Building the design system before feature screens prevents inconsistent UI, reduces rework, and enables rapid screen development later.

The design system follows the **"Gold's Gym DNA"** principle: bold typography, high-contrast palettes, intentional spacing. WCAG 2.1 AA+ compliance is mandatory from day one.

---

## 2.1 Implement Design Tokens (Colors, Typography, Spacing)

### Description and Scope
Convert the DESIGN.MD color system, typography scale, and spacing system into code. Create CSS custom properties for web, theme objects for mobile, and a TypeScript token dictionary for programmatic access. Support both light and dark modes.

### Why This Matters
Design tokens are the atomic building blocks of the entire UI. When a color needs to change, updating one token propagates everywhere. Without tokens, colors and sizes are hardcoded, leading to inconsistency and painful refactoring.

### Technical Approach
Web: CSS custom properties in `packages/ui-shared/src/tokens.css` extending Tailwind theme. Mobile: JavaScript theme object in `packages/ui-shared/src/theme.ts` for React Native. Both derived from a single TypeScript token dictionary. Dark mode toggled via `data-theme="dark"` (web) and `Appearance` API (mobile). Use Style Dictionary or manual token files — manual is fine for initial implementation.

### Files/Directories to Create/Modify
```
packages/ui-shared/
├── src/
│   ├── tokens/
│   │   ├── colors.ts        # All color tokens (brand, semantic, neutral, dark)
│   │   ├── typography.ts    # Font sizes, weights, line-heights, letter-spacing
│   │   ├── spacing.ts       # Spacing scale (4px base)
│   │   ├── breakpoints.ts   # Responsive breakpoints
│   │   ├── shadows.ts       # Shadow/elevation tokens
│   │   ├── animations.ts    # Duration and easing tokens
│   │   └── index.ts         # Exports
│   ├── tokens.css           # CSS custom properties for web
│   ├── tailwind.config.ts   # Tailwind theme extension
│   └── theme.ts             # React Native theme object
```

### Dependencies on Other Items
- 1.1 (monorepo initialized)
- 1.5 (shared TypeScript packages)

### Success Criteria
```
[ ] All DESIGN.MD color tokens defined and exportable
[ ] Color contrast ratios verified: gold-on-black 15.5:1, black-on-white 21:1, all semantic AA+
[ ] Typography scale covers all 10 tokens from DESIGN.MD (display.xl through body.xs)
[ ] Spacing scale covers all 9 tokens from DESIGN.MD (xs through 4xl)
[ ] Dark mode tokens defined for all categories
[ ] CSS custom properties render correctly in browser
[ ] React Native theme object has matching values
[ ] Single source of truth: changing a token updates both platforms
```

### Estimated Effort
2-3 days

### Risks and Mitigation
| Risk | Mitigation |
|------|-----------|
| Token drift between web and mobile | Single TypeScript source; auto-generate both outputs |
| Dark mode inconsistency | Test with automated screenshot comparison |
| Gold-on-white contrast failure | Document: gold is accent only, never text on light |

### LLM Agent Launch Prompt

```
Implement the OhMyGold design tokens system based on the Design System specification.

CONTEXT: OhMyGold is Gold's Gym France's gym management platform. The design system uses Gold's Gym brand colors (gold #FFEC00, black #000, charcoal #231F20) with semantic colors and a full dark mode. See DESIGN.MD for complete specifications.

TASK: Create the complete design token system in packages/ui-shared/src/tokens/:

COLOR TOKENS (tokens/colors.ts):
- Brand: gold (#FFEC00), gold.dark (#D4C400), black (#000), white (#FFF), gold.light (#FFF7A1), gold.muted (#E5D85A), charcoal (#231F20), iron (#1A1A1A)
- Semantic: success (#22C55E), success.dark (#15803D), warning (#F59E0B), warning.dark (#B45309), error (#EF4444), error.dark (#DC2626), info (#3B82F6), info.dark (#1D4ED8)
- Neutral: 50 (#FAFAFA) through 900 (#171717) in 100-step increments
- Role accents: admin (#EF4444), manager (#3B82F6), employee (#F59E0B), coach (#10B981), client (#FFEC00), visitor (#A855F7)
- Dark mode: bg.primary (#0A0A0A), bg.elevated (#171717), bg.card (#231F20), bg.overlay (#1A1A1A), text.primary (#FAFAFA), text.secondary (#A3A3A3), border (#404040), input.bg (#262626)

TYPOGRAPHY TOKENS (tokens/typography.ts):
- Display: xl (56px/800), lg (48px/800)
- Heading: xl (36px/700), lg (30px/700), md (24px/600), sm (20px/600)
- Body: lg (18px/400), md (16px/400), sm (14px/400), xs (12px/500)
- Font families: Inter (headings/body), JetBrains Mono (data)
- Responsive scaling: base 16px, 1536px+ 18px, <640px 14px

SPACING TOKENS (tokens/spacing.ts):
- xs: 4px, sm: 8px, md: 12px, base: 16px, lg: 24px, xl: 32px, 2xl: 48px, 3xl: 64px, 4xl: 96px

BREAKPOINTS (tokens/breakpoints.ts):
- xs: 0, sm: 640, md: 768, lg: 1024, xl: 1280, 2xl: 1536

SHADOWS & ELEVATION (tokens/shadows.ts):
- Web: card (0 2px 8px rgba(0,0,0,0.08)), elevated (0 4px 16px rgba(0,0,0,0.12)), modal (0 8px 32px rgba(0,0,0,0.16))
- Mobile: minimal (flat color shifts instead of shadows)

ANIMATION TOKENS (tokens/animations.ts):
- Duration: instant (0ms), fast (100ms), normal (200ms), medium (300ms), slow (400ms), deliberate (600ms)
- Easing: standard, decelerate, accelerate, bounce, spring

DELIVERABLES:
- TypeScript token files with typed exports
- CSS custom properties file (tokens.css) for web
- Tailwind config extension (tailwind.config.ts)
- React Native theme object (theme.ts)
- Contrast ratio verification function

FILES TO CREATE:
- packages/ui-shared/src/tokens/colors.ts
- packages/ui-shared/src/tokens/typography.ts
- packages/ui-shared/src/tokens/spacing.ts
- packages/ui-shared/src/tokens/breakpoints.ts
- packages/ui-shared/src/tokens/shadows.ts
- packages/ui-shared/src/tokens/animations.ts
- packages/ui-shared/src/tokens/index.ts
- packages/ui-shared/src/tokens.css
- packages/ui-shared/src/tailwind.config.ts
- packages/ui-shared/src/theme.ts

VERIFICATION STEPS:
1. Import tokens in web app — verify CSS custom properties apply
2. Import theme in mobile — verify StyleSheet values correct
3. Check contrast ratios programmatically
4. Toggle dark mode — verify all tokens switch correctly
5. Verify French diacritics render in Inter font

DESIGN SYSTEM REF: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD §2, §3, §4

NOTES AREA (fill on completion):
- Date completed: ___
- Total tokens defined: ___
- Contrast ratios verified: ___
- Dark mode toggle working: Yes/No
```

---

## 2.2 Build Shared UI Component Library

### Description and Scope
Build the foundational UI components as specified in DESIGN.MD Section 5: Buttons, Inputs, Cards, Badges, Avatars, Lists/Tables, Modals/Drawers, Alerts/Toasts. Each component must work on both web (React + Tailwind) and mobile (React Native). Use a shared API where possible.

### Why This Matters
These components are used in every screen across all 6 user roles. A consistent, accessible component library means screens look and behave the same everywhere. It also means bugs are fixed once, not in 20 different implementations.

### Technical Approach
Web: React + Tailwind CSS + shadcn/ui as the base layer, customized with OhMyGold tokens. Mobile: React Native with NativeWind (Tailwind for RN) where possible, custom StyleSheet for platform-specific needs. Shared component API defined via TypeScript interfaces in `packages/ui-shared/src/components/`.

### Files/Directories to Create/Modify
```
packages/ui-shared/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx         # Web implementation
│   │   │   ├── Button.native.tsx  # Mobile implementation
│   │   │   ├── Button.types.ts    # Shared props interface
│   │   │   └── index.ts
│   │   ├── Input/
│   │   ├── Card/
│   │   ├── Badge/
│   │   ├── Avatar/
│   │   ├── Modal/
│   │   ├── Drawer/
│   │   ├── Toast/
│   │   ├── Alert/
│   │   ├── Skeleton/
│   │   └── index.ts
│   └── index.ts
```

### Dependencies on Other Items
- 2.1 (design tokens implemented)

### Success Criteria
```
[ ] Button: all 7 variants, 4 sizes, all states (hover, active, focus, disabled, loading)
[ ] Input: all types (text, password, email, number, search, phone, date, barcode)
[ ] Card: content card, metric card, profile card — all match DESIGN.MD specs
[ ] Badge: status badges, role badges, tags — all variants
[ ] Avatar: 5 sizes, fallback initials, status dot
[ ] Modal: web modal + mobile bottom sheet with correct animations
[ ] Toast: 4 types with auto-dismiss, stacking, action buttons
[ ] All components pass axe accessibility audit
[ ] All components render in Storybook with controls
[ ] Dark mode variants for all components
[ ] Loading/skeleton states for data-dependent components
```

### Estimated Effort
5-7 days

### Risks and Mitigation
| Risk | Mitigation |
|------|-----------|
| Component API divergence between web/mobile | Shared TypeScript interfaces; strict review |
| shadcn/ui integration issues | Start with base components; customize tokens |
| Animation inconsistency | Use Framer Motion (web) and Reanimated 3 (mobile) with matching configs |

### LLM Agent Launch Prompt

```
Build the shared UI component library for OhMyGold.

CONTEXT: OhMyGold serves 6 user roles across web and mobile. All UI components must be accessible (WCAG AA+), support dark mode, and work on both platforms. The design system tokens are already implemented (Phase 2.1).

TASK: Create all foundational UI components in packages/ui-shared/src/components/:

BUTTON (components/Button/):
- Variants: Primary (gold), Secondary (black), Outline, Ghost, Danger, Success, Gold-Outline
- Sizes: sm (32px), md (40px), lg (48px), xl (56px)
- States: default, hover, active (scale 0.98), focus (gold ring), disabled (opacity 0.4), loading (spinner)
- Props: variant, size, isLoading, isDisabled, leftIcon, rightIcon, onPress

INPUT (components/Input/):
- Types: text, password (with toggle), email, number, search (with debounce), phone (format mask), date, barcode
- States: default, focus (gold border), error (red border + message), disabled, filled
- Features: label (top-aligned for i18n), helper text, error message, right icon, success checkmark
- Auto-fill support, browser autofill attributes

CARD (components/Card/):
- Content Card: icon + title + subtitle + content + actions
- Metric Card: icon + label + value + trend indicator (up/down arrow)
- Profile Card: avatar + name + role + details + actions
- Props: variant, padding, shadow, border, onPress

BADGE (components/Badge/):
- Status: active (green), pending (amber), expired (red)
- Role badges with accent colors
- Tags: generic, gold (premium)
- Pill shape for status, rounded for tags

AVATAR (components/Avatar/):
- Sizes: xs (24px), sm (32px), md (48px), lg (64px), xl (120px)
- Shapes: circle, rounded-square
- Fallback: user initials on neutral bg
- Status dot: online (green), away (yellow), offline (gray)

MODAL/DRAWER (components/Modal/):
- Web: centered overlay, max-widths (sm: 560px, md: 720px, lg: 960px), backdrop click dismiss
- Mobile: bottom sheet with drag handle, 25/50/75/100% heights
- Animations: fade + scale (web), slide-up (mobile)
- Focus trap, ESC to close

TOAST (components/Toast/):
- Types: success, warning, error, info
- Position: top-right (web), top (mobile)
- Auto-dismiss: 4s success, 6s warning, 8s error (manual), 4s info
- Stacking: max 3, older pushed down
- Actionable: inline undo/confirm button

ALERT (components/Alert/):
- Banner: full-width below nav, dismissible
- Inline: within forms/content
- Critical: persistent, no dismiss

SKELETON (components/Skeleton/):
- Base + shimmer animation
- Shapes: text, circle, rectangle, card layout
- Dark mode support

REQUIREMENTS:
- Each component: shared types file + web impl + mobile impl
- Web uses Tailwind classes with design tokens
- Mobile uses NativeWind + StyleSheet fallback
- All interactive elements: min 44px touch target
- Focus indicators: 3px gold outline, 2px offset
- Reduced motion: respect prefers-reduced-motion
- Storybook stories for every component

FILES TO CREATE:
- packages/ui-shared/src/components/[each]/[Component].tsx (web)
- packages/ui-shared/src/components/[each]/[Component].native.tsx (mobile)
- packages/ui-shared/src/components/[each]/[Component].types.ts (shared)
- packages/ui-shared/src/components/[each]/index.ts
- packages/ui-shared/src/components/index.ts (barrel)

VERIFICATION STEPS:
1. All components render in Storybook
2. axe accessibility audit passes for each
3. Dark mode toggle shows correct variants
4. Mobile components render in Expo
5. Touch targets >= 44px on mobile
6. Animation tokens applied consistently

DESIGN SYSTEM REF: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD §5

NOTES AREA (fill on completion):
- Date completed: ___
- Components created: ___
- Storybook stories: ___
- Accessibility issues found/fixed: ___
- Mobile-specific adaptations: ___
```

---

## 2.3 Implement i18n Framework with FR/EN

### Description and Scope
Set up react-i18next for web and mobile with French and English translations. Create a translation management system, handle French text expansion (30% longer), and ensure all user-facing strings are translatable from day one.

### Why This Matters
French is the primary language for Gold's Gym France. English support is required for international operations. i18n must be in place before any feature development — retrofitting translations is 10x harder than building with i18n from the start.

### Technical Approach
react-i18next with i18next for web, react-native-localize for mobile locale detection. Translation files in JSON format per namespace (common, auth, members, classes, billing, etc.). ICU message format for pluralization and interpolation. Build-time extraction of translation keys to ensure coverage. Fallback: French if translation missing.

### Files/Directories to Create/Modify
```
packages/ui-shared/src/i18n/
├── index.ts                 # i18n initialization (web)
├── index.native.ts          # i18n initialization (mobile)
├── config.ts                # Shared configuration
└── locales/
    ├── fr/
    │   ├── common.json      # Shared UI strings
    │   ├── auth.json        # Login, register, password
    │   ├── navigation.json  # Menu items, breadcrumbs
    │   ├── members.json     # Member management
    │   ├── classes.json     # Classes and booking
    │   ├── billing.json     # Payments and invoices
    │   └── errors.json      # Error messages
    └── en/
        ├── common.json
        ├── auth.json
        ├── navigation.json
        ├── members.json
        ├── classes.json
        ├── billing.json
        └── errors.json
```

### Dependencies on Other Items
- 2.1 (design tokens — typography handles French diacritics)

### Success Criteria
```
[ ] Language switching works at runtime in both web and mobile
[ ] French locale detected automatically (navigator.language / react-native-localize)
[ ] All DESIGN.MD French terms translated correctly (Tableau de bord, Gestion des membres, etc.)
[ ] Pluralization works in both languages (bookings: 0, 1, many)
[ ] Date/number formatting localized (DD/MM/YYYY for FR, MM/DD/YYYY for EN)
[ ] Text expansion handled: buttons wrap, labels top-aligned, no truncation
[ ] Fallback to French when translation key missing
[ ] Currency formatting: EUR with € symbol, FR format (1 234,56 €)
```

### Estimated Effort
3-4 days

### Risks and Mitigation
| Risk | Mitigation |
|------|-----------|
| French text breaking layouts | Top-aligned labels; flexible button widths; test with longest translations |
| Missing translation keys | Build-time extraction + lint rule |
| Right-to-left (future Arabic) | Use logical properties (start/end, not left/right) |

### LLM Agent Launch Prompt

```
Implement the i18n framework for OhMyGold with French and English support.

CONTEXT: OhMyGold serves Gold's Gym France where French is primary. English support needed for international. French text is ~30% longer than English. Key French UI terms: "Tableau de bord", "Gestion des membres", "Cours collectifs", "Inscriptions".

TASK:
1. Set up i18n configuration:
   - packages/ui-shared/src/i18n/config.ts: i18next config with interpolation, pluralization
   - packages/ui-shared/src/i18n/index.ts: web initialization (react-i18next)
   - packages/ui-shared/src/i18n/index.native.ts: mobile initialization (with react-native-localize)

2. Create translation files for both languages:
   - common.json: buttons (save, cancel, delete, edit, create), confirmations, loading states
   - auth.json: login, register, forgot password, reset password, email, password labels
   - navigation.json: sidebar items, breadcrumbs, section titles
   - members.json: member profile, enrollment, freeze, cancel
   - classes.json: class booking, schedule, waitlist, attendance
   - billing.json: invoice, payment, refund, subscription
   - errors.json: validation errors, server errors, network errors

3. Create React hook: useTranslation() that works on both platforms
4. Create LanguageSwitcher component (web: dropdown, mobile: action sheet)
5. Add i18n key extraction script: scans source files for t('key') patterns

REQUIREMENTS:
- Default locale: French (fr-FR)
- Fallback locale: French
- Namespace structure for lazy loading
- ICU format for complex messages
- react-native-localize for mobile locale detection
- Date formatting: fr = "DD/MM/YYYY", en = "MM/DD/YYYY"
- Currency: fr = "1 234,56 €", en = "€1,234.56"
- All text elements use t() — no hardcoded strings

FILES TO CREATE:
- packages/ui-shared/src/i18n/config.ts
- packages/ui-shared/src/i18n/index.ts
- packages/ui-shared/src/i18n/index.native.ts
- packages/ui-shared/src/i18n/locales/fr/*.json (7 files)
- packages/ui-shared/src/i18n/locales/en/*.json (7 files)
- packages/ui-shared/src/i18n/useTranslation.ts
- packages/ui-shared/src/components/LanguageSwitcher/

VERIFICATION STEPS:
1. Switch language and verify all UI text changes
2. Test with French (longest translations) — verify no truncation
3. Test pluralization: 0 résultats, 1 résultat, 2 résultats
4. Verify date/currency formatting per locale
5. Verify missing key falls back to French
6. Run key extraction script and verify coverage

DESIGN SYSTEM REF: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD §3.3 (French Typography), §8

NOTES AREA (fill on completion):
- Date completed: ___
- Translation keys defined: ___
- French coverage: ___%
- English coverage: ___%
- Key extraction working: Yes/No
```

---


### Animation Token Specifications

| Token | Value | Usage |
|-------|-------|-------|
| **Duration Fast** | 150ms | Micro-interactions: button press, checkbox toggle, tooltip show |
| **Duration Normal** | 300ms | Standard transitions: modal open, dropdown, tab switch |
| **Duration Slow** | 500ms | Page transitions, large element movements, drawer open |
| **Duration Entrance** | 400ms | Elements appearing on screen (slightly longer for visibility) |
| **Duration Exit** | 200ms | Elements leaving screen (faster to clear space) |

| Easing Token | cubic-bezier | Usage |
|-------------|--------------|-------|
| **ease-out** | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering — decelerate to rest |
| **ease-in-out** | `cubic-bezier(0.4, 0, 0.2, 1)` | Symmetric transitions — modal, drawer |
| **spring** | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful interactions — badges, achievements |
| **linear** | `linear` | Continuous animations — progress bars, spinners |
| **ease-in** | `cubic-bezier(0.4, 0, 1, 1)` | Elements exiting — accelerate away |

| Stagger Pattern | Value | Usage |
|----------------|-------|-------|
| **List stagger** | 50ms per item | List items appearing (max 500ms total) |
| **Grid stagger** | 30ms per item | Card grids, dashboard widgets |
| **Cascade delay** | 100ms per level | Nested menus, breadcrumbs |

**Reduced motion support:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```
All animations respect `prefers-reduced-motion`. Duration becomes instant (0.01ms) for users who prefer reduced motion.

## 2.4 Build Accessibility Primitives

### Description and Scope
Create accessibility primitives: SkipToContent link, FocusTrap for modals, ARIA live regions, visually hidden text, keyboard navigation helpers, screen reader announcements, and reduced-motion wrappers. These are the building blocks for WCAG 2.1 AA+ compliance.

### Why This Matters
WCAG 2.1 AA+ compliance is a project requirement (affects legal liability, brand reputation, and user inclusion). Accessibility is not a bolt-on — it must be built into the component layer. 15% of the population has some form of disability; accessibility is usability.

### Technical Approach
Web: Custom hooks and components wrapping native ARIA support. Mobile: react-native-accessibility-engine for automated testing. Focus management via refs and tabIndex. Screen reader testing via VoiceOver (iOS) and TalkBack (Android).

### Files/Directories to Create/Modify
```
packages/ui-shared/src/a11y/
├── SkipToContent.tsx        # Visible on first tab, jumps past nav
├── FocusTrap.tsx            # Traps focus within modal/drawer
├── LiveRegion.tsx           # ARIA live region for dynamic announcements
├── VisuallyHidden.tsx       # Screen-reader-only text
├── KeyboardNavigation.tsx   # Arrow key navigation for lists
├── ReducedMotion.tsx        # Wraps animations with prefers-reduced-motion check
├── ScreenReaderAnnouncer.ts # Programmatic screen reader announcements
└── hooks/
    ├── useFocusTrap.ts
    ├── useKeyboardNavigation.ts
    ├── useReducedMotion.ts
    └── useAnnounce.ts
```

### Dependencies on Other Items
- 2.2 (UI components that will use these primitives)

### Success Criteria
```
[ ] Skip-to-content link visible on first Tab, functional
[ ] FocusTrap keeps Tab cycling within open modal/drawer
[ ] LiveRegion announces dynamic content changes (form errors, loading states)
[ ] VisuallyHidden renders text only for screen readers
[ ] KeyboardNavigation supports arrow keys, Enter, Space, Escape
[ ] ReducedMotion wrapper disables animations when user prefers reduced motion
[ ] All interactive elements have accessible names (aria-label or visible text)
[ ] Color contrast ratios >= 4.5:1 for all text (>= 3:1 for large text)
[ ] Touch targets >= 44x44px on mobile
[ ] axe-core automated tests pass (score >= 95)
```

### Estimated Effort
3-4 days

### Risks and Mitigation
| Risk | Mitigation |
|------|-----------|
| Screen reader testing is manual | Automated via axe-core; manual test on iOS/Android |
| Focus management bugs | Comprehensive E2E tests for all interactive flows |

### LLM Agent Launch Prompt

```
Build the accessibility primitives for OhMyGold.

CONTEXT: OhMyGold must meet WCAG 2.1 AA+ compliance. These primitives are used by all UI components across web and mobile.

TASK: Create accessibility primitives in packages/ui-shared/src/a11y/:

SkipToContent (SkipToContent.tsx):
- Hidden by default, visible on first Tab press
- Links to #main-content
- Gold focus ring when visible
- "Skip to main content" / "Aller au contenu principal"

FocusTrap (FocusTrap.tsx + useFocusTrap.ts):
- Traps Tab key within container (modal, drawer)
- Cycles focus: last → first, first → last
- Restores focus to trigger element on close
- Supports Escape key to close

LiveRegion (LiveRegion.tsx):
- ARIA live="polite" or "assertive" modes
- Announces dynamic content changes
- Used for: form validation errors, loading states, success messages
- Mobile: AccessibilityInfo.announceForAccessibility

VisuallyHidden (VisuallyHidden.tsx):
- CSS technique to hide visually but expose to screen readers
- Used for: icon-only button labels, decorative image alternatives

KeyboardNavigation (KeyboardNavigation.tsx + useKeyboardNavigation.ts):
- Arrow key navigation for lists, dropdowns, tabs
- Enter/Space to activate
- Home/End for first/last item
- Type-ahead search for lists

ReducedMotion (ReducedMotion.tsx + useReducedMotion.ts):
- Detects prefers-reduced-motion media query (web)
- Detects Accessibility settings (mobile)
- Wraps animations — provides instant fallback
- CSS: @media (prefers-reduced-motion: reduce) { animation-duration: 0.01ms !important }

ScreenReaderAnnouncer (ScreenReaderAnnouncer.ts):
- Programmatic announcements for async operations
- Queue system to prevent overlapping announcements
- Clear after configurable delay

REQUIREMENTS:
- All primitives work on both web and mobile
- TypeScript typed with comprehensive prop interfaces
- Comprehensive unit tests
- Document usage patterns in component comments

FILES TO CREATE:
- packages/ui-shared/src/a11y/SkipToContent.tsx
- packages/ui-shared/src/a11y/FocusTrap.tsx
- packages/ui-shared/src/a11y/LiveRegion.tsx
- packages/ui-shared/src/a11y/VisuallyHidden.tsx
- packages/ui-shared/src/a11y/KeyboardNavigation.tsx
- packages/ui-shared/src/a11y/ReducedMotion.tsx
- packages/ui-shared/src/a11y/ScreenReaderAnnouncer.ts
- packages/ui-shared/src/a11y/hooks/useFocusTrap.ts
- packages/ui-shared/src/a11y/hooks/useKeyboardNavigation.ts
- packages/ui-shared/src/a11y/hooks/useReducedMotion.ts
- packages/ui-shared/src/a11y/hooks/useAnnounce.ts
- packages/ui-shared/src/a11y/index.ts

VERIFICATION STEPS:
1. Tab through web app — skip link appears
2. Open modal — Tab cycles within, Escape closes
3. Run axe-core audit — score >= 95
4. Test with VoiceOver (iOS) on mobile components
5. Enable reduced motion — animations disabled
6. Verify all interactive elements have accessible names

DESIGN SYSTEM REF: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD §7

NOTES AREA (fill on completion):
- Date completed: ___
- Primitives created: ___
- axe-core score: ___
- Screen reader tests passed: ___
```

---

## 2.5 Create Animation/Motion System

### Description and Scope
Implement the animation system from DESIGN.MD Section 6: duration tokens, easing curves, page transitions, micro-interactions, skeleton loading, and reduced-motion support. Web uses Framer Motion; mobile uses Reanimated 3.

### Why This Matters
Animations guide user attention, provide feedback, and create a premium feel. But they must be performant (60fps) and accessible (reduced-motion support). A consistent animation system ensures the app feels polished, not janky.

### Technical Approach
Web: Framer Motion for declarative animations, CSS transitions for simple cases. Mobile: Reanimated 3 with worklets for GPU-accelerated animations. Both platforms read from the same animation token definitions. Skeleton loading uses CSS shimmer on web, Animated API on mobile.

### Files/Directories to Create/Modify
```
packages/ui-shared/src/motion/
├── transitions.ts           # Page transition definitions
├── variants.ts              # Framer Motion/Reanimated variants
├── micro-interactions.ts    # Button press, checkbox, tab switch
├── skeleton.tsx             # Skeleton loading component
├── AnimatePresence.tsx      # Wrapper for enter/exit animations
└── hooks/
    ├── useAnimatedValue.ts
    ├── useSpringAnimation.ts
    └── useStaggerChildren.ts
```

### Dependencies on Other Items
- 2.1 (animation tokens defined)
- 2.4 (reduced-motion primitive)

### Success Criteria
```
[ ] Duration tokens applied: fast (100ms), normal (200ms), medium (300ms), slow (400ms)
[ ] Easing curves applied: standard, decelerate, accelerate, bounce
[ ] Page transitions: fade 200ms (web), slide 300ms (mobile)
[ ] Micro-interactions: button press (scale 0.97, 100ms), tab switch (250ms slide)
[ ] Skeleton loading: shimmer animation, matches content shape
[ ] prefers-reduced-motion: all animations disabled
[ ] 60fps maintained on target devices (test on low-end Android)
[ ] Only transform and opacity used for animations (GPU-accelerated)
```

### Estimated Effort
3-4 days

### Risks and Mitigation
| Risk | Mitigation |
|------|-----------|
| Animation performance on low-end devices | Test on budget Android; simplify if needed |
| Reanimated 3 setup complexity | Use Expo Dev Client; test build early |

### LLM Agent Launch Prompt

```
Create the animation/motion system for OhMyGold.

CONTEXT: OhMyGold Design System §6 specifies animation principles: purposeful, performant (60fps), accessible, consistent, subtle. Web uses Framer Motion; mobile uses Reanimated 3.

TASK: Create the animation system in packages/ui-shared/src/motion/:

1. Transition definitions (transitions.ts):
   - fade: opacity 0→1, 200ms ease-standard
   - slideRight: x: -20→0 + opacity, 300ms ease-decelerate
   - slideUp: y: 20→0 + opacity, 300ms ease-decelerate
   - scale: scale 0.95→1 + opacity, 200ms ease-standard
   - bottomSheet: y: 100%→0, 300ms ease-spring
   - drawer: x: 100%→0, 300ms ease-decelerate

2. Component variants (variants.ts):
   - pageEnter, pageExit
   - modalEnter, modalExit
   - listItemEnter (staggered children)
   - toastEnter (slide from right + fade)

3. Micro-interactions (micro-interactions.ts):
   - buttonPress: scale 0.97, 100ms
   - buttonRelease: scale 1.0, 150ms bounce
   - checkboxCheck: stroke draw + scale bounce, 200ms
   - switchToggle: translateX + color fill, 200ms
   - tabSwitch: indicator slide to new position, 250ms
   - errorShake: x ±4px 3 cycles, 400ms
   - successPulse: scale 1.0→1.03→1.0

4. Skeleton component (skeleton.tsx):
   - Shimmer animation (highlight sweep left→right)
   - Variants: text, circle, rectangle, card
   - Dark mode support
   - Minimum display 300ms to prevent flash

5. AnimatePresence wrapper for enter/exit
6. Hooks: useAnimatedValue, useSpringAnimation, useStaggerChildren

REQUIREMENTS:
- Web: Framer Motion (AnimatePresence, motion components)
- Mobile: Reanimated 3 (useSharedValue, useAnimatedStyle)
- Both use same token values from tokens/animations.ts
- Reduced motion: instant transitions
- GPU-accelerated only (transform, opacity)

FILES TO CREATE:
- packages/ui-shared/src/motion/transitions.ts
- packages/ui-shared/src/motion/variants.ts
- packages/ui-shared/src/motion/micro-interactions.ts
- packages/ui-shared/src/motion/skeleton.tsx
- packages/ui-shared/src/motion/skeleton.native.tsx
- packages/ui-shared/src/motion/AnimatePresence.tsx
- packages/ui-shared/src/motion/hooks/useAnimatedValue.ts
- packages/ui-shared/src/motion/hooks/useSpringAnimation.ts
- packages/ui-shared/src/motion/hooks/useStaggerChildren.ts
- packages/ui-shared/src/motion/index.ts

VERIFICATION STEPS:
1. All transitions render smoothly in Storybook
2. Micro-interactions trigger on user interaction
3. Skeleton loading shows shimmer animation
4. Enable prefers-reduced-motion — verify instant transitions
5. Test 60fps on low-end device (budget Android)
6. Verify only transform/opacity are animated

DESIGN SYSTEM REF: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD §6

NOTES AREA (fill on completion):
- Date completed: ___
- Animations defined: ___
- Performance verified (60fps): Yes/No
- Reduced motion fallback: Yes/No
```

---

## 2.6 Implement Shared Layout Components

### Description and Scope
Build layout components used across all screens: web sidebar navigation, topbar with global search and notifications, mobile bottom tab bar, content area with proper spacing, responsive container, and grid system. These provide the structural framework for all role-based screens.

### Why This Matters
Layout components define the visual structure of the entire application. The sidebar + topbar pattern for web and the bottom tabs for mobile are the primary navigation paradigms. Getting these right ensures consistent navigation, responsive behavior, and proper content flow across all screens.

### Technical Approach
Web: CSS Grid + Flexbox with responsive breakpoints. Sidebar: 256px fixed, collapsible to 72px. Topbar: 64px fixed. Content area fills remaining space. Mobile: Bottom tab bar 56dp + safe area. Stack navigation for drill-down screens. Content padding and max-width containers.

### Files/Directories to Create/Modify
```
packages/ui-shared/src/layout/
├── WebLayout/
│   ├── Sidebar.tsx          # Collapsible sidebar with nav items
│   ├── Topbar.tsx           # Fixed topbar with search, notifications, profile
│   ├── ContentArea.tsx      # Main content with proper padding
│   └── WebLayout.tsx        # Combined layout wrapper
├── MobileLayout/
│   ├── BottomTabs.tsx       # Bottom tab bar with safe area
│   ├── StackHeader.tsx      # Stack navigation header
│   └── MobileLayout.tsx     # Combined layout wrapper
├── Container.tsx            # Max-width responsive container
├── Grid.tsx                 # 12-column grid system
└── index.ts
```

### Dependencies on Other Items
- 2.1 (spacing tokens, breakpoints)
- 2.2 (Button, Avatar components for nav items)

### Success Criteria
```
[ ] Sidebar: 256px expanded, 72px collapsed, gold active indicator, role-based items
[ ] Topbar: 64px fixed, global search, notification bell with badge, user menu
[ ] Bottom tabs: 56dp + safe area, gold active indicator, center action button
[ ] Content area: proper padding, scrollable, respects sidebar state
[ ] Container: max-width 1400px at 2xl, responsive on all breakpoints
[ ] Grid: 12-column, gap support, responsive column counts
[ ] Responsive: sidebar → hamburger on mobile web, tabs on mobile native
[ ] Dark mode: all layout components switch correctly
```

### Estimated Effort
3-4 days

### Risks and Mitigation
| Risk | Mitigation |
|------|-----------|
| Complex responsive behavior | Test on real devices at every breakpoint |
| Sidebar performance with many items | Virtualize if > 50 items |

### LLM Agent Launch Prompt

```
Implement the shared layout components for OhMyGold.

CONTEXT: OhMyGold has 6 user roles with different navigation needs. Web uses sidebar + topbar layout; mobile uses bottom tabs + stack navigation.

TASK: Create layout components in packages/ui-shared/src/layout/:

WEB LAYOUT (layout/WebLayout/):
1. Sidebar.tsx:
   - Width: 256px expanded, 72px collapsed (icon-only)
   - Fixed position, full height
   - Gold left-border indicator for active item
   - Collapse toggle at bottom
   - Scrollable if many items
   - Role-based menu items (admin sees all, client sees fewer)
   - DESIGN.MD §5.4 specs

2. Topbar.tsx:
   - Height: 64px, fixed position
   - Left: hamburger menu (mobile web) or logo
   - Center: global search bar
   - Right: notification bell (with unread badge), user avatar menu
   - DESIGN.MD §4.1, §5.4

3. ContentArea.tsx:
   - Fills remaining space (viewport - sidebar - topbar)
   - Proper padding (24px desktop, 16px mobile)
   - Scrollable
   - Respects sidebar collapsed/expanded state

4. WebLayout.tsx:
   - Combines Sidebar + Topbar + ContentArea
   - Responsive: sidebar hidden on mobile (hamburger drawer instead)

MOBILE LAYOUT (layout/MobileLayout/):
1. BottomTabs.tsx:
   - Height: 56dp + safe area inset
   - 4 tabs: Home, Stats, Action (center elevated), Profile
   - Active: gold icon + label + gold top indicator
   - Inactive: neutral-400
   - DESIGN.MD §5.4

2. StackHeader.tsx:
   - Shows screen title, back button
   - iOS: large title option
   - Android: material style

3. MobileLayout.tsx:
   - Combines BottomTabs + StackHeader
   - Content area with proper insets

CONTAINER & GRID:
- Container.tsx: max-width 1400px (2xl), 1200px (xl), 960px (lg), fluid below
- Grid.tsx: 12-column grid, configurable gap, responsive col-span

REQUIREMENTS:
- All layouts responsive per DESIGN.MD breakpoints
- Dark mode support
- Proper z-index layering (content < sticky < nav < modal < toast)
- French text renders without overflow
- Touch targets >= 44px on mobile

FILES TO CREATE:
- packages/ui-shared/src/layout/WebLayout/Sidebar.tsx
- packages/ui-shared/src/layout/WebLayout/Topbar.tsx
- packages/ui-shared/src/layout/WebLayout/ContentArea.tsx
- packages/ui-shared/src/layout/WebLayout/WebLayout.tsx
- packages/ui-shared/src/layout/MobileLayout/BottomTabs.tsx
- packages/ui-shared/src/layout/MobileLayout/StackHeader.tsx
- packages/ui-shared/src/layout/MobileLayout/MobileLayout.tsx
- packages/ui-shared/src/layout/Container.tsx
- packages/ui-shared/src/layout/Grid.tsx
- packages/ui-shared/src/layout/index.ts

VERIFICATION STEPS:
1. Sidebar expands/collapses smoothly
2. Active item highlighted with gold border
3. Topbar search works, notification badge shows
4. Bottom tabs switch correctly on mobile
5. Content area scrolls properly
6. Test at all breakpoints
7. Dark mode toggles correctly

DESIGN SYSTEM REF: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD §4, §5.4

NOTES AREA (fill on completion):
- Date completed: ___
- Layouts implemented: ___
- Responsive breakpoints tested: ___
- Any layout issues: ___
```

---

## 2.7 Create Form Component Library

### Description and Scope
Build form-specific components: Form wrapper with context, Field wrapper (label + input + error), Checkbox, Radio, Switch/Toggle, Select/Dropdown, DatePicker, FileUpload, and Form validation integration with React Hook Form + Zod. These handle the heavy data entry across all screens.

### Why This Matters
Forms are the primary interaction pattern for data entry in OhMyGold — member enrollment, class creation, payment processing, settings. A robust form library with consistent validation, error display, and accessibility reduces bugs and improves user experience across all roles.

### Technical Approach
React Hook Form for form state management, Zod for schema validation (shared schemas from packages/shared), controlled components with register integration. Error display: inline below field with icon. Success indicator: green checkmark. Accessible: proper label association, aria-describedby for errors, aria-required.

### Files/Directories to Create/Modify
```
packages/ui-shared/src/forms/
├── Form.tsx                 # Form wrapper with RHF provider
├── FormField.tsx            # Label + input + error wrapper
├── TextField.tsx            # Text input with RHF integration
├── PasswordField.tsx        # Password with show/hide toggle
├── EmailField.tsx           # Email with validation
├── PhoneField.tsx           # Phone with format mask
├── Checkbox.tsx             # Styled checkbox with label
├── RadioGroup.tsx           # Radio button group
├── Switch.tsx               # Toggle switch
├── Select.tsx               # Dropdown select
├── DatePicker.tsx           # Date picker (native on mobile)
├── FileUpload.tsx           # File upload with drag-drop
├── SearchField.tsx          # Search with debounce
└── index.ts
```

### Dependencies on Other Items
- 2.2 (Input component base)
- 2.3 (i18n for labels and error messages)
- 2.4 (a11y primitives for focus and announcements)
- 1.5 (Zod schemas from shared package)

### Success Criteria
```
[ ] Form wrapper integrates with React Hook Form
[ ] All field types render with correct validation
[ ] Error messages display inline below field with error icon
[ ] French labels render correctly (top-aligned for expansion)
[ ] DatePicker uses native on mobile, custom on web
[ ] FileUpload supports drag-drop on web, camera/gallery on mobile
[ ] All fields: proper label association, aria-describedby for errors
[ ] Form submission: loading state, success, error handling
[ ] Auto-fill supported (browser autofill attributes)
[ ] Phone field formats: +33 X XX XX XX XX for France
```

### Estimated Effort
4-5 days

### Risks and Mitigation
| Risk | Mitigation |
|------|-----------|
| Complex form validation rules | Share Zod schemas; test edge cases |
| DatePicker cross-platform issues | Use native date picker on mobile; react-day-picker on web |

### LLM Agent Launch Prompt

```
Create the form component library for OhMyGold.

CONTEXT: OhMyGold has extensive form usage across all roles — member enrollment, class creation, payment setup, settings. Forms use React Hook Form + Zod validation.

TASK: Create form components in packages/ui-shared/src/forms/:

1. Form.tsx: Wrapper providing RHF FormProvider
2. FormField.tsx: Wrapper with label (top-aligned), input slot, helper text, error message
3. TextField.tsx: Text input integrated with RHF register
4. PasswordField.tsx: Password with Eye/EyeOff toggle
5. EmailField.tsx: Email with keyboard type and validation
6. PhoneField.tsx: Phone with +33 format mask for France
7. Checkbox.tsx: Styled checkbox with SVG check animation
8. RadioGroup.tsx: Group of radio buttons, single selection
9. Switch.tsx: Toggle switch (iOS style), accessible
10. Select.tsx: Dropdown with search, single/multi select
11. DatePicker.tsx: Native on mobile, react-day-picker on web
12. FileUpload.tsx: Drag-drop zone (web), camera/gallery (mobile)
13. SearchField.tsx: Debounced search with clear button

REQUIREMENTS:
- All fields use RHF register or Controller
- Validation via Zod schemas from @ohmygold/shared
- Error display: inline, red text, error icon, aria-describedby
- Label: top-aligned (for French text expansion)
- Required indicator: red asterisk
- Loading state: spinner on submit button
- Success state: green checkmark on field
- Auto-fill: autocomplete attributes
- All fields accessible (label for, aria-required, aria-invalid)

FILES TO CREATE:
- packages/ui-shared/src/forms/Form.tsx
- packages/ui-shared/src/forms/FormField.tsx
- packages/ui-shared/src/forms/TextField.tsx
- packages/ui-shared/src/forms/PasswordField.tsx
- packages/ui-shared/src/forms/EmailField.tsx
- packages/ui-shared/src/forms/PhoneField.tsx
- packages/ui-shared/src/forms/Checkbox.tsx
- packages/ui-shared/src/forms/RadioGroup.tsx
- packages/ui-shared/src/forms/Switch.tsx
- packages/ui-shared/src/forms/Select.tsx
- packages/ui-shared/src/forms/DatePicker.tsx
- packages/ui-shared/src/forms/FileUpload.tsx
- packages/ui-shared/src/forms/SearchField.tsx
- packages/ui-shared/src/forms/index.ts

VERIFICATION STEPS:
1. Create a test form with all field types
2. Submit with errors — verify error display
3. Submit valid — verify success state
4. Test French labels — verify no overflow
5. Test accessibility with axe-core
6. Test on mobile — verify native date picker

DESIGN SYSTEM REF: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD §5.7

NOTES AREA (fill on completion):
- Date completed: ___
- Form components: ___
- RHF integration verified: Yes/No
- Accessibility audit score: ___
```

---

## 2.8 Build Data Display Components (Tables, Cards, Charts)

### Description and Scope
Create data-rich display components: DataTable with sorting/pagination/selection, Card grid for visual layouts, MetricCard for dashboard KPIs, Chart wrappers (Recharts for web, react-native-chart-kit for mobile), Timeline for activity feeds, and EmptyState for no-data scenarios.

### Why This Matters
Admin, Manager, and Employee screens are data-heavy — member lists, booking grids, financial reports, analytics dashboards. These components make dense information scannable, sortable, and actionable. Dashboard KPIs drive decision-making; charts reveal trends.

### Technical Approach
DataTable: TanStack Table (React Table) v8 for web, custom implementation for mobile (card-based list). Charts: Recharts on web, react-native-chart-kit on mobile. Both use shared data and color tokens. Empty states include illustration + message + CTA. Responsive: table → card list on mobile.

### Files/Directories to Create/Modify
```
packages/ui-shared/src/data-display/
├── DataTable/
│   ├── DataTable.tsx         # Web table with TanStack Table
│   ├── DataTable.native.tsx  # Mobile card-based list
│   └── hooks/useTableState.ts
├── CardGrid.tsx              # Responsive card grid
├── MetricCard.tsx            # Dashboard KPI card
├── Chart/
│   ├── LineChart.tsx
│   ├── BarChart.tsx
│   ├── DoughnutChart.tsx
│   └── AreaChart.tsx
├── Timeline.tsx              # Activity/chronology timeline
├── EmptyState.tsx            # No data illustration + CTA
├── Pagination.tsx            # Page controls
└── index.ts
```

### Dependencies on Other Items
- 2.1 (color tokens for charts, spacing for layout)
- 2.2 (Card, Badge components)

### Success Criteria
```
[ ] DataTable: sortable columns, pagination (25/50/100 rows), row selection, search
[ ] DataTable responsive: horizontal scroll on xs/sm, card view option
[ ] MetricCard: icon, label, value, trend indicator (up/down with %)
[ ] Charts: line, bar, doughnut, area — all use gold primary color
[ ] Chart tooltips: dark card with white text
[ ] Timeline: chronological, grouped by date, clickable items
[ ] EmptyState: illustration, message, CTA button
[ ] Pagination: page numbers, prev/next, items per page selector
[ ] All charts animate on initial render (600ms ease-out)
[ ] Chart colors: gold primary, blue secondary, semantic for status
```

### Estimated Effort
4-5 days

### Risks and Mitigation
| Risk | Mitigation |
|------|-----------|
| Large dataset performance | Virtualization for tables > 100 rows |
| Chart rendering on low-end mobile | Simplify charts; reduce data points |

### LLM Agent Launch Prompt

```
Build data display components for OhMyGold.

CONTEXT: OhMyGold has data-heavy screens for Admin/Manager/Employee roles — member lists, booking grids, financial reports, analytics dashboards.

TASK: Create data display components in packages/ui-shared/src/data-display/:

DATA TABLE (DataTable/):
- Web: TanStack Table v8 with:
  - Sortable headers (click to sort, arrow indicator)
  - Pagination: 25/50/100 rows per page
  - Row selection (checkbox, select all)
  - Global search/filter
  - Row height: 52px, alternating colors
  - Hover: neutral-100, Selected: gold at 10%
  - Responsive: horizontal scroll on small screens
- Mobile: Card-based list view with:
  - Full-width cards with key info
  - Swipe left for quick actions
  - Pull-to-refresh
  - Infinite scroll

METRIC CARD (MetricCard.tsx):
- 40px icon circle with role accent at 15% opacity
- Label: font.body.sm, neutral-500
- Value: font.display.lg, weight 700
- Trend: green arrow (up=positive), red arrow (down=negative)
- DESIGN.MD §5.3

CHARTS (Chart/):
- LineChart: gold primary, blue secondary, grid neutral-200
- BarChart: same color scheme
- DoughnutChart: gold segment, semantic colors
- AreaChart: gold fill with opacity
- Tooltip: dark card (#231F20), white text, 8px radius
- Animation: 600ms ease-out on initial render
- Responsive: recharts ResponsiveContainer (web), flex sizing (mobile)

TIMELINE (Timeline.tsx):
- Vertical timeline with connector line
- Items: icon, title, description, timestamp
- Grouped by date
- Clickable for detail view

EMPTY STATE (EmptyState.tsx):
- Illustration (SVG or Lottie)
- Title and description
- CTA button to create/add
- DESIGN.MD §5.6

PAGINATION (Pagination.tsx):
- Page numbers with prev/next
- Items per page selector
- "Showing X-Y of Z results" text

FILES TO CREATE:
- packages/ui-shared/src/data-display/DataTable/DataTable.tsx
- packages/ui-shared/src/data-display/DataTable/DataTable.native.tsx
- packages/ui-shared/src/data-display/DataTable/hooks/useTableState.ts
- packages/ui-shared/src/data-display/CardGrid.tsx
- packages/ui-shared/src/data-display/MetricCard.tsx
- packages/ui-shared/src/data-display/Chart/LineChart.tsx
- packages/ui-shared/src/data-display/Chart/BarChart.tsx
- packages/ui-shared/src/data-display/Chart/DoughnutChart.tsx
- packages/ui-shared/src/data-display/Chart/AreaChart.tsx
- packages/ui-shared/src/data-display/Timeline.tsx
- packages/ui-shared/src/data-display/EmptyState.tsx
- packages/ui-shared/src/data-display/Pagination.tsx
- packages/ui-shared/src/data-display/index.ts

VERIFICATION STEPS:
1. DataTable with 1000 rows — verify pagination and sorting
2. Metric cards render with trend indicators
3. Charts display sample data with animations
4. Timeline shows grouped events
5. Empty state renders with illustration
6. Test responsiveness at all breakpoints

DESIGN SYSTEM REF: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD §5.6, §5.8

NOTES AREA (fill on completion):
- Date completed: ___
- Components created: ___
- Performance with large datasets: ___
- Chart libraries used: ___
```

---

## 2.9 Implement Navigation Patterns (Web Sidebar, Mobile Tabs)

### Description and Scope
Create the complete navigation system: web sidebar with role-based menu items, mobile bottom tab bar with role-based tabs, breadcrumbs, hamburger menu for mobile web, and deep linking support. Navigation items defined by role configuration.

### Why This Matters
Navigation is the backbone of the user experience. Each of the 6 roles sees a different set of menu items based on the permission matrix. Navigation must be intuitive, responsive, and role-aware. Poor navigation leads to lost time and user frustration.

### Technical Approach
Navigation config: TypeScript array of route objects with role guards. Web: sidebar items filtered by user role, React Router v7 for routing. Mobile: tab items filtered by role, React Navigation v7 for stack/tab integration. Breadcrumbs derived from route hierarchy. Deep links mapped to screen routes.

### Files/Directories to Create/Modify
```
packages/ui-shared/src/navigation/
├── navConfig.ts             # Role-based navigation configuration
├── WebSidebarNav.tsx        # Sidebar navigation items
├── MobileTabBar.tsx         # Bottom tab configuration
├── Breadcrumbs.tsx          # Breadcrumb trail
├── HamburgerMenu.tsx        # Mobile web drawer menu
├── DeepLinkHandler.ts       # Deep link routing
└── index.ts
```

### Dependencies on Other Items
- 2.2 (Button, Avatar for nav items)
- 2.6 (layout components — sidebar, bottom tabs)

### Success Criteria
```
[ ] Navigation items filtered correctly per role (see permission matrix)
[ ] Admin: 12+ menu items (all categories)
[ ] Manager: 10+ menu items (location-scoped)
[ ] Employee: 6 menu items (operational)
[ ] Teacher: 4 menu items (class-related)
[ ] Client: 5 menu items (self-service)
[ ] Visitor: 4 menu items (showcase)
[ ] Active item: gold left-border indicator
[ ] Breadcrumbs: show on inner pages, clickable for navigation
[ ] Mobile web: hamburger opens full-screen drawer with nav items
[ ] Deep links: route to correct screen with params
```

### Estimated Effort
3-4 days

### Risks and Mitigation
| Risk | Mitigation |
|------|-----------|
| Navigation config becoming unwieldy | Split by role; use composition |
| Deep link handling complexity | Test on real devices; use Expo Linking |

### LLM Agent Launch Prompt

```
Implement the navigation patterns for OhMyGold.

CONTEXT: OhMyGold has 6 user roles each with different navigation needs. Navigation must be role-based per the permission matrix.

TASK: Create navigation system in packages/ui-shared/src/navigation/:

1. Navigation Configuration (navConfig.ts):
   Define routes array with: path, label, icon, roles[], category, children?

   Admin routes: Dashboard, Users, Locations, Memberships, Classes, Bookings, Billing, POS, Inventory, CRM, Marketing, Analytics, Settings, Audit Log
   Manager routes: Dashboard, Members, Classes, Bookings, Staff, Billing, POS, Marketing, Analytics, Settings
   Employee routes: Check-In, POS, Classes, Attendance, Schedule, Issues
   Teacher routes: My Schedule, Attendance, My Classes, Students, Messages
   Client routes: Dashboard, Book Classes, My Membership, QR Code, Progress, Settings
   Visitor routes: Home, Pricing, Classes, Locations, Trial

2. Web Sidebar Navigation (WebSidebarNav.tsx):
   - Items filtered by current user role
   - Grouped by category
   - Active: gold left-border
   - Collapsible sub-menus
   - Badge support (e.g., unread notifications)

3. Mobile Tab Bar (MobileTabBar.tsx):
   - Items filtered by role
   - 4 tabs + center action
   - Active: gold icon + label + indicator
   - Badge on notification icon

4. Breadcrumbs (Breadcrumbs.tsx):
   - Derived from route hierarchy
   - font.body.sm, neutral-500
   - Clickable parent links
   - Hidden on top-level pages

5. Hamburger Menu (HamburgerMenu.tsx):
   - Mobile web: full-screen drawer
   - Role-based items
   - Dark backdrop overlay
   - Slide from left animation

6. Deep Link Handler (DeepLinkHandler.ts):
   - Map URL patterns to screens
   - Handle notification deep links
   - Pass parameters correctly
   - Fallback to home if route not found

REQUIREMENTS:
- Role-based filtering: only show items user has permission for
- Active state: gold indicator, highlighted background
- French labels for all navigation items
- Icons: Lucide React (web), Lucide React Native (mobile)
- Accessibility: aria-current for active item
- Responsive: sidebar on desktop, hamburger on mobile web, tabs on native

REFERENCE FILES:
- Permission Matrix: /mnt/agents/output/ohmygold/team2_resamania_analysis/role_matrices/01_complete_permission_matrix.md
- Mobile Accessibility Matrix: /mnt/agents/output/ohmygold/team2_resamania_analysis/role_matrices/03_mobile_accessibility_matrix.md
- DESIGN.MD §5.4 (Navigation)

FILES TO CREATE:
- packages/ui-shared/src/navigation/navConfig.ts
- packages/ui-shared/src/navigation/WebSidebarNav.tsx
- packages/ui-shared/src/navigation/MobileTabBar.tsx
- packages/ui-shared/src/navigation/Breadcrumbs.tsx
- packages/ui-shared/src/navigation/HamburgerMenu.tsx
- packages/ui-shared/src/navigation/DeepLinkHandler.ts
- packages/ui-shared/src/navigation/index.ts

VERIFICATION STEPS:
1. Log in as Admin — verify all menu items visible
2. Log in as Client — verify only client items visible
3. Verify active item highlighting
4. Test breadcrumbs on nested routes
5. Test hamburger menu on mobile web
6. Test deep links from push notifications

NOTES AREA (fill on completion):
- Date completed: ___
- Routes defined: ___
- Role filtering verified for: ___ roles
- Deep link tests passed: ___
```

---

## 2.10 Create Notification/Toast System

### Description and Scope
Build the complete notification system: toast notifications (in-app ephemeral messages), in-app notification center (bell icon with drawer/panel), notification preferences, and toast queue management. Supports all 4 toast types (success, warning, error, info) with full customization.

### Why This Matters
Notifications are the primary feedback mechanism for user actions. Every create, update, delete operation needs confirmation. The notification center aggregates important alerts (payment failures, class cancellations, system announcements). Without a robust system, users are left wondering if their actions succeeded.

### Technical Approach
Toast queue managed via Zustand store. Toast component reads from queue and auto-dismisses. Notification center: slide-in panel (web), drawer (mobile) showing grouped notifications. Preferences stored in user profile. Toast positioning: top-right (web desktop), top-center (web mobile), top (native).

### Files/Directories to Create/Modify
```
packages/ui-shared/src/notifications/
├── toastStore.ts            # Zustand store for toast queue
├── Toast.tsx                # Individual toast component
├── ToastContainer.tsx       # Container managing toast positions
├── NotificationCenter.tsx   # Bell icon + notification panel
├── NotificationItem.tsx     # Individual notification in center
├── notificationStore.ts     # Store for notification center
├── useToast.ts              # Hook for showing toasts
└── index.ts
```

### Dependencies on Other Items
- 2.2 (Toast, Button, Badge components)
- 2.4 (LiveRegion for screen reader announcements)
- 2.5 (animation transitions for enter/exit)

### Success Criteria
```
[ ] 4 toast types: success (green), warning (amber), error (red), info (blue)
[ ] Toast border-left: 4px colored indicator
[ ] Auto-dismiss: 4s success, 6s warning, 8s error (manual), 4s info
[ ] Stacking: max 3 visible, older pushed down
[ ] Entry animation: slide from right + fade, 300ms
[ ] Actionable toasts: inline button (undo, view)
[ ] Notification center: bell icon with red badge for unread count
[ ] Notification center: grouped by date, unread gold left-border
[ ] Swipe to dismiss individual notification
[ ] "Mark all as read" action
[ ] Screen reader announces toast content on appearance
```

### Estimated Effort
2-3 days

### Risks and Mitigation
| Risk | Mitigation |
|------|-----------|
| Toast spam | Rate limiting; deduplicate identical messages |
| Z-index conflicts | Defined z-index scale; toast at top layer |

### LLM Agent Launch Prompt

```
Create the notification/toast system for OhMyGold.

CONTEXT: OhMyGold needs a comprehensive notification system for user feedback (toasts) and aggregated alerts (notification center).

TASK: Create notification system in packages/ui-shared/src/notifications/:

1. Toast Store (toastStore.ts):
   - Zustand store with queue management
   - Actions: addToast, removeToast, clearAll
   - Max 3 visible; FIFO queue
   - Toast object: id, type, title, message, duration, action?, dismissible

2. Toast Component (Toast.tsx):
   - Types: success (green border-left), warning (amber), error (red), info (blue)
   - Icon: check-circle, alert-triangle, x-circle, info-circle
   - Title + message body
   - Close button (X)
   - Action button (optional)
   - Progress bar showing remaining time
   - DESIGN.MD §5.12

3. Toast Container (ToastContainer.tsx):
   - Position: top-right (web desktop), top-center (web mobile), top (native)
   - Stacks vertically with gap
   - New toasts push older down
   - Max 3 visible, overflow hidden

4. Notification Center (NotificationCenter.tsx):
   - Bell icon in topbar with red badge (unread count)
   - Click opens slide-in panel (web) / drawer (mobile)
   - Grouped by date: "Today", "Yesterday", "Earlier"
   - Unread items: gold left-border
   - Swipe to dismiss (mobile), click X (web)
   - "Mark all as read" button
   - Empty state: "No notifications" with illustration

5. Notification Item (NotificationItem.tsx):
   - Icon based on type
   - Title, message, timestamp
   - Unread indicator
   - Click to navigate (deep link)

6. useToast Hook (useToast.ts):
   - Simple API: toast.success('Saved!'), toast.error('Failed'), etc.
   - Options: duration, action, onClose

REQUIREMENTS:
- Screen reader announces via LiveRegion
- Reduced motion: instant appear/disappear
- Auto-dismiss timer pauses on hover (web)
- Swipe gesture to dismiss (mobile)
- Queue system prevents flooding
- French translations for all default messages

FILES TO CREATE:
- packages/ui-shared/src/notifications/toastStore.ts
- packages/ui-shared/src/notifications/Toast.tsx
- packages/ui-shared/src/notifications/Toast.native.tsx
- packages/ui-shared/src/notifications/ToastContainer.tsx
- packages/ui-shared/src/notifications/NotificationCenter.tsx
- packages/ui-shared/src/notifications/NotificationItem.tsx
- packages/ui-shared/src/notifications/notificationStore.ts
- packages/ui-shared/src/notifications/useToast.ts
- packages/ui-shared/src/notifications/index.ts

VERIFICATION STEPS:
1. Trigger toasts of all 4 types — verify correct styling
2. Verify auto-dismiss timing
3. Verify max 3 toasts, stacking order
4. Open notification center — verify grouped by date
5. Mark all as read — verify badge clears
6. Test screen reader announcement
7. Test reduced motion

DESIGN SYSTEM REF: /mnt/agents/output/ohmygold/team1_golds_gym_resource_base/DESIGN.MD §5.12

NOTES AREA (fill on completion):
- Date completed: ___
- Toast types: ___
- Auto-dismiss verified: Yes/No
- Screen reader tested: Yes/No
- Notification center features: ___
```

---

## Phase 2 Completion Checklist

```
[ ] 2.1 Design tokens: colors, typography, spacing, dark mode — all defined
[ ] 2.2 UI component library: Button, Input, Card, Badge, Avatar, Modal, Toast, Alert, Skeleton
[ ] 2.3 i18n framework: FR/EN switching, French text expansion handled
[ ] 2.4 Accessibility primitives: SkipToContent, FocusTrap, LiveRegion, ReducedMotion
[ ] 2.5 Animation system: transitions, micro-interactions, skeleton loading
[ ] 2.6 Layout components: sidebar, topbar, bottom tabs, container, grid
[ ] 2.7 Form components: all field types with RHF + Zod validation
[ ] 2.8 Data display: DataTable, MetricCard, Charts, Timeline, EmptyState
[ ] 2.9 Navigation patterns: role-based sidebar, tabs, breadcrumbs, deep links
[ ] 2.10 Notification system: toasts, notification center, preferences
[ ] All components render in Storybook
[ ] axe-core accessibility audit >= 95 on all components
[ ] Dark mode works across all components
[ ] French text renders without truncation or overflow
[ ] All components have TypeScript types
[ ] Animation system respects prefers-reduced-motion
```

---

*Phase 2 notes: The design system is the face of OhMyGold. Every pixel, every animation, every interaction pattern defined here will be experienced by thousands of users. Invest time in polish and accessibility — it pays dividends in Phase 5-6 when screens are built rapidly from these components.*
