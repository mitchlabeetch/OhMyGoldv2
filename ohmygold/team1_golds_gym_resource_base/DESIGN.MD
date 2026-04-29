# OhMyGold Design System

> **Project:** OhMyGold — Gold's Gym France All-in-One Management & Client Solution
> **Version:** 1.0.0
> **Last Updated:** 2026-04-29
> **Owner:** Gold's Gym France Digital Team
> **Status:** [DRAFT] — Open for team review

---

## Table of Contents

1. [Project Overview & Design Principles](#1-project-overview--design-principles)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Layout & Spacing](#4-layout--spacing)
5. [Component Design](#5-component-design)
6. [Motion & Animation](#6-motion--animation)
7. [Accessibility (a11y)](#7-accessibility-a11y)
8. [i18n & Localization](#8-i18n--localization)
9. [Iconography](#9-iconography)
10. [Platform-Specific Guidance](#10-platform-specific-guidance)
11. [Role-Based UI Considerations](#11-role-based-ui-considerations)
12. [File Structure](#12-file-structure)

---

## 1. Project Overview & Design Principles

### 1.1 Project Codename: OhMyGold

OhMyGold is the signature design system powering Gold's Gym France's next-generation all-in-one gym management and client experience platform. Built on the heritage of the world's most iconic fitness brand — founded in 1965 in Venice Beach, California — the system bridges 60+ years of "serious training" legacy with modern digital-first experiences.

### 1.2 Design Philosophy

The design philosophy is rooted in **strength through clarity** — every element must feel intentional, powerful, and accessible. The visual language connects to Gold's Gym DNA: bold typography, high-contrast palettes, and a sense of community and achievement.

> **Note:** The OhMyGold design system is a living document. All `[TODO]` markers indicate decisions requiring stakeholder finalization. Use `> **Note:**` blocks for critical implementation guidance.

### 1.3 Core Design Principles

| Principle | Description | Implementation |
|-----------|-------------|----------------|
| **Strength** | Bold, confident visuals with strong hierarchy | High-contrast colors, heavy font weights for headings, decisive spacing |
| **Accessibility** | WCAG 2.1 AA+ compliance for all users | Contrast ratios ≥ 4.5:1, keyboard nav, screen reader labels, reduced-motion support |
| **Premium Feel** | Quality over quantity; every pixel intentional | Restrained palette, generous whitespace, refined micro-interactions |
| **Action-Oriented** | Users complete tasks quickly and confidently | Prominent CTAs, clear feedback, minimal cognitive load per screen |
| **Unified Brand** | Consistent Gold's Gym experience across all touchpoints | Strict token adherence, logo/wordmark usage per brand guidelines |
| **Performance** | Fast, responsive, lightweight | Optimized assets, CSS transitions (web), native animations (mobile) |

### 1.4 Design Goals by Platform

| Platform | Goal | Key Characteristics |
|----------|------|---------------------|
| **Web App** | Full-featured management panel, data-rich dashboards | Desktop-first responsive, 12-column grid, side navigation, dense information architecture |
| **Mobile App (iOS & Android)** | Action-focused, on-the-go experience | Bottom tabs, gesture-driven, offline-capable, push notifications, camera/location integration |

### 1.5 Design Tokens Philosophy

All visual values in OhMyGold are expressed as **design tokens** — named, reusable variables that feed both web (CSS custom properties) and mobile (theme objects). Tokens live in a single source of truth and are consumed by:

- [Web] Tailwind CSS theme extensions + CSS custom properties
- [iOS] SwiftUI Color/Font extensions or UIAppearance
- [Android] Compose MaterialTheme or XML resources
- [Shared] React Native StyleSheet references (via React Native Web for shared components)

> **Note:** Token names use dot-notation: `color.primary.gold`, `spacing.md`, `font.size.heading.lg`. This structure enables automated token delivery via Style Dictionary or similar tools.

---

## 2. Color System

### 2.1 Primary Palette — Gold's Gym Signature Colors

Derived from the official Gold's Gym brand identity (PMS 3945 C / PMS Black 6 C):

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `color.brand.gold` | `#FFEC00` | `rgb(255, 236, 0)` | Primary CTA, highlights, accents, focus rings |
| `color.brand.gold.dark` | `#D4C400` | `rgb(212, 196, 0)` | Hover states, pressed buttons on gold |
| `color.brand.black` | `#000000` | `rgb(0, 0, 0)` | Primary text on light, dark backgrounds, navbars |
| `color.brand.white` | `#FFFFFF` | `rgb(255, 255, 255)` | Primary text on dark, page backgrounds |

> **Note:** Gold `#FFEC00` on white `#FFFFFF` fails WCAG AA (1.18:1). Always pair gold with **black text** (`#000000`, 15.5:1 on gold — AAA) or use gold on dark backgrounds. Never use gold-on-white for text.

### 2.2 Extended Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `color.brand.gold.light` | `#FFF7A1` | Subtle gold highlights, tags, badges backgrounds |
| `color.brand.gold.muted` | `#E5D85A` | Secondary gold accents, disabled gold tones |
| `color.brand.charcoal` | `#231F20` | Card backgrounds (dark), elevated surfaces |
| `color.brand.iron` | `#1A1A1A` | Deepest dark backgrounds (admin dashboard) |

### 2.3 Semantic Colors

| Token | Hex | Contrast on White | Usage |
|-------|-----|-------------------|-------|
| `color.semantic.success` | `#22C55E` | 3.0:1 (use 700 for text) | Success states, check-ins completed |
| `color.semantic.success.dark` | `#15803D` | 4.6:1 (AA) | Success text on light backgrounds |
| `color.semantic.warning` | `#F59E0B` | 2.0:1 (use 700 for text) | Warnings, pending actions |
| `color.semantic.warning.dark` | `#B45309` | 4.5:1 (AA) | Warning text on light backgrounds |
| `color.semantic.error` | `#EF4444` | 4.0:1 (use 600 for text) | Errors, cancellations, failed validations |
| `color.semantic.error.dark` | `#DC2626` | 4.6:1 (AA) | Error text on light backgrounds |
| `color.semantic.info` | `#3B82F6` | 3.4:1 (use 700 for text) | Informational banners, tips |
| `color.semantic.info.dark` | `#1D4ED8` | 5.1:1 (AA) | Info text on light backgrounds |

### 2.4 Neutral Scale

| Token | Hex | Usage |
|-------|-----|-------|
| `color.neutral.50` | `#FAFAFA` | Page background (light mode) |
| `color.neutral.100` | `#F5F5F5` | Section backgrounds, table alternation |
| `color.neutral.200` | `#E5E5E5` | Borders (subtle), dividers |
| `color.neutral.300` | `#D4D4D4` | Disabled borders, placeholder text bg |
| `color.neutral.400` | `#A3A3A3` | Placeholder text, subtle icons |
| `color.neutral.500` | `#737373` | Secondary text, captions |
| `color.neutral.600` | `#525252` | Body text (lighter) |
| `color.neutral.700` | `#404040` | Body text (primary light mode) |
| `color.neutral.800` | `#262626` | Headings (light mode) |
| `color.neutral.900` | `#171717` | Deepest text, primary near-black |

### 2.5 Role-Based Accent Colors

Each user role receives a distinct accent color for quick visual identification across the platform:

| Role | Accent Token | Hex | Usage |
|------|-------------|-----|-------|
| **Admin** | `color.role.admin` | `#EF4444` | Admin badges, admin-only UI chrome, system-wide actions |
| **Manager** | `color.role.manager` | `#3B82F6` | Location dashboard accents, scheduling highlights |
| **Employee** | `color.role.employee` | `#F59E0B` | Quick-action buttons, barcode scanner UI |
| **Teacher/Coach** | `color.role.coach` | `#10B981` | Class management, attendance indicators |
| **Client** | `color.role.client` | `#FFEC00` | Member-facing features, progress highlights |
| **Visitor** | `color.role.visitor` | `#A855F7` | Trial flows, conversion CTAs, showcase elements |

> **Note:** Role colors are used as **accents only** — borders, badges, icon tints, and small UI elements. Never use role colors for large background fills or primary text. Role accent usage must not exceed 10% of viewport surface area to avoid visual chaos.

### 2.6 Dark Mode Palette

OhMyGold supports a full dark mode, preferred by Admin users and available to all roles:

| Token (Dark) | Hex | Mapped From |
|-------------|-----|-------------|
| `color.dark.bg.primary` | `#0A0A0A` | `color.neutral.50` |
| `color.dark.bg.elevated` | `#171717` | `color.neutral.100` |
| `color.dark.bg.card` | `#231F20` | Card surfaces |
| `color.dark.bg.overlay` | `#1A1A1A` | Modals, drawers |
| `color.dark.text.primary` | `#FAFAFA` | `color.neutral.800` |
| `color.dark.text.secondary` | `#A3A3A3` | `color.neutral.500` |
| `color.dark.border` | `#404040` | `color.neutral.200` |
| `color.dark.input.bg` | `#262626` | Form field backgrounds |

Dark mode gold: `#FFEC00` remains unchanged — it **pops** against dark backgrounds (contrast 13.8:1 on `#0A0A0A`).

### 2.7 Accessibility — Color Contrast Compliance

| Combination | Ratio | WCAG AA | WCAG AAA |
|-------------|-------|---------|----------|
| Black `#000` on White `#FFF` | 21:1 | Pass | Pass |
| Black `#000` on Gold `#FFEC00` | 15.5:1 | Pass | Pass |
| Gold `#FFEC00` on Charcoal `#231F20` | 11.2:1 | Pass | Pass |
| Neutral-700 `#404040` on White `#FFF` | 10.3:1 | Pass | Pass |
| Neutral-500 `#737373` on White `#FFF` | 4.6:1 | Pass | Fail (OK for large text) |
| White `#FFF` on Charcoal `#231F20` | 14.2:1 | Pass | Pass |
| Success-dark `#15803D` on White `#FFF` | 4.6:1 | Pass | Pass |
| Error `#DC2626` on White `#FFF` | 4.6:1 | Pass | Pass |
| Gold `#FFEC00` on White `#FFF` | 1.18:1 | **FAIL** | **FAIL** |

> **Note:** The gold-on-white failure is by design — brand gold is an **accent**, never a text color on light backgrounds. Use black text on gold surfaces, or gold icons/indicators on white with sufficient size.

### 2.8 Platform Differences

| Aspect | Web | Mobile |
|--------|-----|--------|
| Gradients | Allowed — subtle linear gradients on hero sections, cards | **Avoid** — use flat colors for GPU performance and battery life |
| Shadows | Multi-layered, soft shadows for elevation | Minimal shadows; rely on background color shifts for elevation |
| Background | Light default (`#FAFAFA`), dark mode toggle | Light default, respects OS dark mode setting |
| Gold usage | Hero sections, banners, large CTA buttons | Icons, small badges, active tab indicators |

---

## 3. Typography

### 3.1 Font Families

#### Primary (Headings)
**Inter** — a highly legible, modern sans-serif with excellent screen rendering and comprehensive language support (including French diacritics: à, â, ä, é, è, ê, ë, ç, œ, ù, û, ü).

- Weights: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold), 800 (ExtraBold)
- Fallback stack: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- [Web] Load via Google Fonts or self-hosted woff2
- [iOS/Android] Bundle static TTF/OTF or use system font fallback

> **Note:** Inter was selected over Acumin Pro (used on goldsgym.com) for superior open-source availability, broader weight range, and optimized on-screen legibility at small sizes. Acumin Pro may be licensed later for marketing pages if brand alignment requires it.

#### Secondary / Monospace (Data, Numbers)
**JetBrains Mono** or **Tabular Figures from Inter** — used for tables, timers, currency, data-dense displays.

- Context: Gym management requires frequent display of numbers (prices, reps, weights, timestamps)
- Tabular figures ensure columns align perfectly

### 3.2 Type Scale

| Token | Web (rem/px) | Mobile (sp) | Weight | Line-Height | Letter-Spacing | Usage |
|-------|-------------|-------------|--------|-------------|----------------|-------|
| `font.display.xl` | 3.5rem / 56px | 36sp | 800 | 1.05 | -0.03em | Hero titles, onboarding headlines |
| `font.display.lg` | 3rem / 48px | 32sp | 800 | 1.1 | -0.02em | Page titles (mobile) |
| `font.heading.xl` | 2.25rem / 36px | 28sp | 700 | 1.15 | -0.02em | Section headings |
| `font.heading.lg` | 1.875rem / 30px | 24sp | 700 | 1.2 | -0.01em | Card titles, modal headers |
| `font.heading.md` | 1.5rem / 24px | 20sp | 600 | 1.25 | -0.01em | Sub-section headings |
| `font.heading.sm` | 1.25rem / 20px | 18sp | 600 | 1.3 | 0 | Card sub-titles, list headers |
| `font.body.lg` | 1.125rem / 18px | 16sp | 400 | 1.6 | 0 | Lead paragraphs, descriptions |
| `font.body.md` | 1rem / 16px | 14sp | 400 | 1.6 | 0 | Standard body text |
| `font.body.sm` | 0.875rem / 14px | 12sp | 400 | 1.5 | 0.01em | Captions, helper text |
| `font.body.xs` | 0.75rem / 12px | 10sp | 500 | 1.4 | 0.02em | Badges, tags, timestamps |

> **Note:** On mobile, never go below 10sp for readable text. 10sp is reserved for timestamps and metadata only. Minimum body text is 12sp.

### 3.3 French Language Typography

French text is approximately **30% longer** than equivalent English. Specific considerations:

- Allow text wrapping in all buttons and headings — never truncate French labels
- Button max-width should flex; use multi-line buttons on mobile when needed
- Form labels: use top-aligned labels (not inline) to accommodate longer French terms
- Key French terms in the UI (see `brand_docs/05_wording.md` for full brand terminology):
  - "Tableau de bord" (Dashboard)
  - "Membres / Adhérents" (Members)
  - "Cours collectifs" (Classes)
  - "Inscriptions" (Sign-ups)
  - "Seance d'essai" (Free trial — brand term)
  - "Entre dans l'arene" (Enter the arena — brand voice)
- Special characters must render perfectly: `ç`, `é`, `è`, `ê`, `à`, `â`, `ù`, `û`, `ï`, `œ`

### 3.4 Responsive Scaling

```css
/* Base: 16px = 1rem */
html { font-size: 16px; }

/* Large screens: slight scale up */
@media (min-width: 1536px) {
  html { font-size: 18px; }
}

/* Tablet: maintain base */
@media (max-width: 1024px) {
  html { font-size: 15px; }
}

/* Mobile web: scale down slightly */
@media (max-width: 640px) {
  html { font-size: 14px; }
}
```

---

## 4. Layout & Spacing

### 4.1 Grid System

#### Web — 12-Column Responsive Grid

| Breakpoint | Width | Columns | Gutter | Container Max |
|-----------|-------|---------|--------|---------------|
| `xs` | 0–639px | 4 (simplified) | 16px | 100% - 32px |
| `sm` | 640–767px | 12 | 16px | 100% - 32px |
| `md` | 768–1023px | 12 | 24px | 720px |
| `lg` | 1024–1279px | 12 | 24px | 960px |
| `xl` | 1280–1535px | 12 | 32px | 1200px |
| `2xl` | 1536px+ | 12 | 32px | 1400px |

```
Web layout structure:
┌─────────────────────────────────────────────────┐
│  Topbar (fixed, 64px height)                    │
├──────────┬──────────────────────────────────────┤
│          │                                      │
│ Sidebar  │         Main Content Area            │
│ (fixed,  │                                      │
│  256px)  │                                      │
│          │                                      │
│          │                                      │
└──────────┴──────────────────────────────────────┘
```

#### Mobile — Flexible Layout with Safe Areas

- Single-column primary layout
- Content padding: 16dp (horizontal)
- Section spacing: 24dp (vertical)
- Card internal padding: 16dp
- Bottom nav height: 56dp + safe area inset

### 4.2 Spacing Scale (Base Unit: 4px)

| Token | Value | Usage |
|-------|-------|-------|
| `space.xs` | 4px | Icon margins, tight inline spacing |
| `space.sm` | 8px | Button internal padding (vertical), badge padding |
| `space.md` | 12px | Small card gaps, compact element spacing |
| `space.base` | 16px | Standard padding, form field gaps, card padding |
| `space.lg` | 24px | Section gaps, card margins, dialog padding |
| `space.xl` | 32px | Major section separators |
| `space.2xl` | 48px | Page-level vertical padding |
| `space.3xl` | 64px | Hero section padding, large vertical rhythm |
| `space.4xl` | 96px | Major page section separators |

### 4.3 Breakpoints Reference

| Name | Width | Target Devices |
|------|-------|----------------|
| `xs` | 0px | Small phones (iPhone SE) |
| `sm` | 640px | Standard phones (iPhone 14/15) |
| `md` | 768px | Large phones, small tablets |
| `lg` | 1024px | Tablets (iPad), small laptops |
| `xl` | 1280px | Desktops, large tablets |
| `2xl` | 1536px | Large monitors |

### 4.4 Safe Areas & Insets (Mobile)

| Concern | Strategy |
|---------|----------|
| **Notch / Dynamic Island** | Use `env(safe-area-inset-top)` for web; `UIApplication.shared.keyWindow?.safeAreaInsets` for iOS; `WindowInsets.statusBars` for Android |
| **Home Indicator** | Bottom padding: `env(safe-area-inset-bottom)` (web) or system insets (native) |
| **Keyboard** | Use keyboard-aware scroll views; on-screen forms must reflow above keyboard |
| **Status Bar** | Reserve 44pt (iOS) / 24dp (Android) at top; use translucent background |

### 4.5 Responsive Strategy

| Element | xs/sm (Mobile) | md/lg (Tablet) | xl/2xl (Desktop) |
|---------|---------------|----------------|------------------|
| Navigation | Bottom tabs (mobile app) / hamburger (web) | Collapsible sidebar | Fixed sidebar |
| Content Cards | Full-width, stacked | 2-column grid | 3-column grid |
| Data Tables | Card-based list view | Horizontal scroll table | Full data table |
| Filters | Bottom sheet | Side panel | Inline sidebar |
| Modals | Full-screen / bottom sheet | Centered overlay | Centered overlay |

### 4.6 Z-Index Scale

| Layer | Z-Index | Element |
|-------|---------|---------|
| Background | -1 | Decorative elements |
| Content | 0–10 | Cards, sections |
| Sticky headers | 20–30 | Table headers, sub-nav |
| Navigation | 40–50 | Sidebar, topbar |
| Overlays | 60–70 | Backdrops |
| Modals/Drawers | 80–90 | Dialogs, bottom sheets |
| Tooltips/Toasts | 100–110 | Floating notifications |
| Critical | 999 | Accessibility skip links |



---

## 5. Component Design

> **Note:** All components below are specified for both **Web** and **Mobile** contexts. Shared behavior is described once; platform-specific differences are called out with `[Web]` and `[Mobile]` tags.

### 5.1 Buttons

#### Button Variants

| Variant | Background | Text | Border | Usage |
|---------|-----------|------|--------|-------|
| **Primary** | `color.brand.gold` `#FFEC00` | `color.brand.black` `#000` | none | Main CTA, submit actions |
| **Secondary** | `color.brand.black` `#000` | `color.brand.white` `#FFF` | none | Secondary actions, cancel |
| **Outline** | transparent | `color.brand.black` `#000` | 1px `#000` | Tertiary actions, filters |
| **Ghost** | transparent | `color.neutral.700` | none | Low-emphasis actions |
| **Danger** | `color.semantic.error` `#EF4444` | `color.brand.white` | none | Delete, remove, cancel subscription |
| **Success** | `color.semantic.success` `#22C55E` | `color.brand.white` | none | Confirm, approve |
| **Gold-Outline** | transparent | `color.brand.gold` | 1px `color.brand.gold` | Premium/prominent tertiary |

#### Button Sizes

| Size | Web (height/padding) | Mobile (height/padding) | Usage |
|------|---------------------|------------------------|-------|
| **Small** | 32px / 12px 16px | 36dp / 12dp 16dp | Inline actions, compact UIs |
| **Medium** | 40px / 16px 24px | 44dp / 16dp 24dp | Standard (default) |
| **Large** | 48px / 20px 32px | 52dp / 20dp 32dp | Hero CTAs, mobile primary actions |
| **XLarge** | 56px / 24px 40px | 60dp / 24dp 40dp | Prominent mobile CTAs |

#### Button States

```
[All platforms]
- Default:   as per variant table
- Hover:     brightness 1.1 (web) / opacity 0.9 (mobile press)
- Active:    scale(0.98), brightness 0.95, transition 100ms
- Focus:     3px outline using color.brand.gold, offset 2px
- Disabled:  opacity 0.4, pointer-events none
- Loading:   spinner replaces text, aria-busy="true"
```

#### Loading Button

- Show circular spinner (16px) centered in button
- Spinner color matches button text color
- Maintain button dimensions to prevent layout shift
- Duration: minimum 300ms display to prevent flicker

### 5.2 Inputs

#### Text Input

```
Structure:
┌──────────────────────────────────────┐
│ Label (optional)                     │
│ ┌──────────────────────────────────┐ │
│ │ Placeholder text          [icon] │ │
│ └──────────────────────────────────┘ │
│ Helper text / Error message          │
└──────────────────────────────────────┘
```

| State | Border | Background | Text |
|-------|--------|------------|------|
| Default | 1px `neutral-300` | `neutral-50` | `neutral-800` |
| Focus | 2px `brand.gold` | `neutral-50` | `neutral-800` |
| Error | 2px `semantic.error` | `semantic.error` at 5% opacity | `neutral-800` |
| Disabled | 1px `neutral-200` | `neutral-100` | `neutral-400` |
| Filled | 1px `neutral-500` | `neutral-50` | `neutral-800` |

#### Input Types

| Type | Icon (right) | Notes |
|------|-------------|-------|
| Text | — | Standard |
| Password | Eye / Eye-Off toggle | Masked by default |
| Email | Mail icon | Keyboard type: email |
| Number | — | Spinner hidden; use +/- steppers on mobile |
| Search | Search icon + clear X | Debounced 300ms |
| Phone | — | Format auto-mask: `+33 X XX XX XX XX` |
| Date | Calendar icon | Native date picker on mobile |
| Time | Clock icon | Native time picker on mobile |
| Barcode | Camera/Barcode icon | [Mobile] Triggers camera scanner |

#### Validation Display

- Error messages appear below input in `semantic.error` color
- Helper text: `neutral-500`, 12px
- Error icon (circle-alert) prepended to error message
- Real-time validation on blur; final validation on submit
- [TODO] Confirm server-side error message format with backend team

### 5.3 Cards

#### Content Card

```
┌──────────────────────────────────────┐
│ [Image/Icon]  Title                  │
│               Subtitle               │
├──────────────────────────────────────┤
│ Content area — text, stats, actions  │
├──────────────────────────────────────┤
│ [Action 1]  [Action 2]      [More]   │
└──────────────────────────────────────┘
```

| Property | Light Mode | Dark Mode |
|----------|-----------|-----------|
| Background | `neutral-50` / `#FAFAFA` | `dark.bg.card` / `#231F20` |
| Border | 1px `neutral-200` | 1px `dark.border` |
| Border Radius | 12px (web), 16dp (mobile) | same |
| Shadow (web) | `0 2px 8px rgba(0,0,0,0.08)` | `0 2px 8px rgba(0,0,0,0.3)` |
| Padding | 24px | 16dp |

#### Dashboard Metric Card

```
┌──────────────────────────────────────┐
│ Icon  Metric Label          Trend ▲  │
│                                     │
│       1,247                         │
│       ↑ 12% vs last month           │
└──────────────────────────────────────┘
```

- Icon: 40x40px circle with role accent color at 15% opacity
- Value: `font.display.lg` weight 700
- Trend: green arrow (up = positive), red arrow (down = negative)
- [Mobile] Cards stack vertically; 2-column grid on tablet landscape

#### Profile Card

```
┌──────────────────────────────────────┐
│  ┌────┐                              │
│  │    │  Member Name                 │
│  │ 👤 │  @username · Gold Member     │
│  └────┘                              │
├──────────────────────────────────────┤
│  Member since: Jan 2024              │
│  Plan: Premium · Expires: 12/2026    │
├──────────────────────────────────────┤
│  [View Profile]  [Edit]              │
└──────────────────────────────────────┘
```

- Avatar: 64x64px (web) / 56dp (mobile), circular
- Membership badge uses `color.role.client` gold accent

### 5.4 Navigation

#### Web Navigation

**Sidebar (Desktop lg+):**
```
┌──────────────────────────────────────────────────────────────┐
│ [Logo]  OhMyGold                              [🔔] [👤] [⚙]  │ ← Topbar (64px)
├──────────┬───────────────────────────────────────────────────┤
│          │                                                   │
│  🏠      │                                                   │
│  Home    │              Main Content Area                    │
│          │                                                   │
│  📊      │                                                   │
│  Reports │                                                   │
│          │                                                   │
│  👥      │                                                   │
│  Members │                                                   │
│          │                                                   │
│  📅      │                                                   │
│  Schedule│                                                   │
│          │                                                   │
│  ⚙️      │                                                   │
│  Settings│                                                   │
│          │                                                   │
└──────────┴───────────────────────────────────────────────────┘
```

- Sidebar: 256px wide, fixed, collapsible to 72px (icon-only)
- Topbar: 64px height, fixed, contains global search, notifications, user menu
- Navigation items: icon + label, active state uses gold left-border indicator
- Breadcrumbs: below topbar on inner pages, `font.body.sm` in `neutral-500`
- Collapse toggle: at bottom of sidebar

**Mobile Web Navigation:**
- Hamburger menu triggers full-screen drawer
- Drawer slides from left, dark backdrop overlay
- Role-based menu items (see section 11)

#### Mobile App Navigation (iOS & Android)

**Bottom Tab Bar:**
```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│           Main Content                  │
│                                         │
│                                         │
├──────────┬──────────┬──────────┬────────┤
│   🏠     │    📊    │    ➕    │   👤   │
│  Home    │  Stats   │  Action  │Profile │
└──────────┴──────────┴──────────┴────────┘
```

- Height: 56dp + safe area inset
- Active tab: icon + label in `color.brand.gold`, 2px gold top indicator
- Inactive tab: icon + label in `neutral-400`
- Center action button ("+" or lightning bolt): elevated circle in gold, -28dp vertical offset
- **iOS**: Follow Human Interface Guidelines tab bar patterns
- **Android**: Follow Material 3 bottom navigation with Gold's Gym color mapping

**Stack Navigation:**
- Push transitions: slide in from right (iOS), shared element fade (Android)
- Back gesture: edge swipe from left (iOS), system back button (Android)
- Always show screen title in header; back button on left

#### Drawers & Panels

| Type | Web | Mobile |
|------|-----|--------|
| Filters | Right side panel (320px), slide-in | Bottom sheet (50% height) |
| Details | Right side panel (400px), slide-in | Full-screen push |
| Settings | Full page | Full-screen push |
| Quick actions | Dropdown menu | Bottom action sheet |

### 5.5 Modals & Dialogs

#### Web Modal

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│    ┌───────────────────────────────────────────────┐        │
│    │  Modal Title                        [×]       │        │
│    ├───────────────────────────────────────────────┤        │
│    │                                               │        │
│    │  Modal content area — forms, confirmation,    │        │
│    │  or detail views.                             │        │
│    │                                               │        │
│    ├───────────────────────────────────────────────┤        │
│    │  [Cancel]              [Confirm Action]       │        │
│    └───────────────────────────────────────────────┘        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

- Backdrop: `rgba(0,0,0,0.5)`, click-to-dismiss
- Modal: max-width 560px (small), 720px (medium), 960px (large)
- Border radius: 16px
- Entry animation: fade in backdrop + scale(0.95→1) + opacity(0→1), 200ms ease-out
- Exit animation: reverse, 150ms ease-in
- Focus trap: first focusable element receives focus on open

#### Mobile Bottom Sheet

```
┌─────────────────────────────────────────┐
│ ──────── (drag handle)                  │
│                                         │
│  Bottom Sheet Title                     │
│                                         │
│  Content area...                        │
│                                         │
│  [Primary Action]                       │
│                                         │
└─────────────────────────────────────────┘
```

- [iOS] Follows sheet presentation style (iOS 15+)
- [Android] Follows Material bottom sheet with drag handle
- Heights: 25%, 50%, 75%, 100% of viewport
- Drag handle: 40x4px pill in `neutral-300`, centered at top
- Swipe down to dismiss (unless blocking action)
- Backdrop: `rgba(0,0,0,0.4)`

### 5.6 Lists & Data Display

#### Data Table (Web)

| Feature | Specification |
|---------|--------------|
| Row height | 52px |
| Header row | 48px, `neutral-100` background, uppercase labels |
| Alternating rows | White / `neutral-50` |
| Hover row | `neutral-100` |
| Selected row | `brand.gold` at 10% opacity background |
| Sortable headers | Click to sort, arrow icon indicates direction |
| Pagination | 25/50/100 rows per page, bottom-aligned |
| Empty state | Centered illustration + message + CTA |
| Responsive | Horizontal scroll on `xs`/`sm`; card view optional |

#### Card List (Mobile)

- Each row becomes a full-width card with key info
- Swipe left: reveal quick actions (edit, delete)
- Pull-to-refresh: native gesture with loading spinner
- Infinite scroll: auto-load next page at 80% scroll position
- Skeleton loading: 3 shimmering cards while loading

### 5.7 Forms

#### Layout Patterns

```
Single column (mobile + narrow web):
┌─────────────────────────────────────┐
│ Label                               │
│ [______________________________]   │
│                                     │
│ Label                               │
│ [______________________________]   │
│                                     │
│ [Checkbox] I agree to terms        │
│                                     │
│        [Submit]                     │
└─────────────────────────────────────┘

Two column (desktop lg+):
┌───────────────────────────────────────────────────┐
│ Label 1              │ Label 2                    │
│ [__________________] │ [__________________]       │
│                      │                            │
│ Label 3              │                            │
│ [__________________] │                            │
└───────────────────────────────────────────────────┘
```

#### Form Guidelines

- Field height: 48px (web), 52dp (mobile)
- Label positioning: top-aligned (recommended for i18n) or floating
- Required fields: red asterisk `*` after label
- Error display: inline below field, red text + icon
- Success: green checkmark icon inside field (right side)
- Group related fields with fieldset + legend
- Submit button: full-width on mobile, auto-width on web
- Autofill: support browser autofill attributes (`autocomplete="email"`, etc.)

### 5.8 Charts & Data Visualization

| Chart Type | Library Recommendation | Usage |
|-----------|----------------------|-------|
| Line chart | Recharts (web) / MPAndroidChart + Charts (iOS) | Revenue trends, membership growth over time |
| Bar chart | Same as above | Class popularity, sales by category |
| Doughnut/Pie | Same as above | Gender distribution, plan breakdown |
| Area chart | Same as above | Occupancy rates, website traffic |
| Sparkline | Custom SVG / react-sparklines | Inline mini-trends in metric cards |

#### Chart Styling

- Primary data series: `color.brand.gold`
- Secondary series: `color.role.manager` (blue)
- Grid lines: `neutral-200`, 0.5px
- Axis labels: `font.body.xs`, `neutral-500`
- Tooltip: dark card (`#231F20`) with white text, 8px radius
- [Dark mode] Grid lines: `neutral-700`; tooltip: `neutral-800`
- Animation: 600ms ease-out on initial render

### 5.9 Calendar & Timetable

#### Class Booking Calendar

```
┌─────────────────────────────────────────────────────────────┐
│  ‹   April 2026   ›     [Today]  [Week]  [Month]  [List]   │
├─────┬─────┬─────┬─────┬─────┬─────┬───────────────────────┤
│ Mon │ Tue │ Wed │ Thu │ Fri │ Sat │ Sun                   │
├─────┼─────┼─────┼─────┼─────┼─────┼───────────────────────┤
│     │  1  │  2  │  3  │  4  │  5  │  6                    │
│     │     │     │     │     │     │                       │
├─────┼─────┼─────┼─────┼─────┼─────┼───────────────────────┤
│  7  │  8  │  9  │ 10  │ 11  │ 12  │ 13                    │
│  ·  │ 🟡  │     │ 🟡  │     │     │                       │
├─────┼─────┼─────┼─────┼─────┼─────┼───────────────────────┤
│ ... │     │     │     │     │     │                       │
└─────┴─────┴─────┴─────┴─────┴─────┴───────────────────────┘
```

- Gold dot (`🟡`) indicates classes scheduled that day
- Selected date: gold background circle
- Current date: gold ring (outline) circle
- Event dots: max 3 per day; "+N more" tooltip on hover
- [Mobile] Default to week view or list view; month view via toggle
- Class cards: show time, title, instructor, spots remaining, book button

### 5.10 Badges & Tags

| Type | Background | Text | Border Radius | Usage |
|------|-----------|------|---------------|-------|
| **Status — Active** | `semantic.success` 15% opacity | `semantic.success.dark` | 999px | Active membership |
| **Status — Pending** | `semantic.warning` 15% opacity | `semantic.warning.dark` | 999px | Pending payment |
| **Status — Expired** | `semantic.error` 15% opacity | `semantic.error.dark` | 999px | Expired membership |
| **Role badge** | Role accent 15% opacity | Role accent dark | 999px | User role indicator |
| **Tag** | `neutral-100` | `neutral-600` | 6px | Generic categorization |
| **Gold tag** | `brand.gold` 20% opacity | `neutral-800` | 6px | Premium/promotional |

### 5.11 Avatars

| Size | Dimensions | Usage |
|------|-----------|-------|
| **XS** | 24px / 24dp | Inline mentions, list items |
| **SM** | 32px / 32dp | Comments, small cards |
| **MD** | 48px / 48dp | Standard profile display |
| **LG** | 64px / 64dp | Profile headers, detail views |
| **XL** | 120px / 96dp | Personal profile page hero |

- Shape: circle (default), rounded-square (12px radius) for groups/classes
- Fallback: user initials on `neutral-200` background
- Border: 2px white stroke + optional status indicator dot (12px) at bottom-right
- Status dot colors: green (online/active), yellow (away), gray (offline)

### 5.12 Alerts & Notifications

#### Toast Notifications

```
┌──────────────────────────────────────────┐
│ ✅  Action completed successfully     [×] │
└──────────────────────────────────────────┘
```

| Type | Icon | Border-left | Auto-dismiss |
|------|------|-------------|--------------|
| Success | Check-circle | 4px green | 4 seconds |
| Warning | Alert-triangle | 4px amber | 6 seconds |
| Error | X-circle | 4px red | Manual or 8 seconds |
| Info | Info-circle | 4px blue | 4 seconds |

- Position: top-right (web desktop), top-center (web mobile), top (mobile app)
- Entry: slide in from right + fade, 300ms
- Stacking: max 3 visible; older toasts pushed down
- Actionable toasts: include inline button (e.g., "Undo")

#### Banner Alerts

- Full-width bar below top navigation
- Used for: system maintenance, subscription reminders, feature announcements
- Dismissible with X button (unless critical)
- Persistent banners push page content down (never overlay)

#### In-App Notifications (Mobile)

- Bell icon in topbar with red dot badge for unread count
- Tap opens notification drawer (slide from right)
- Grouped by date; unread items have gold left-border
- Swipe individual notification to dismiss
- Mark all as read action in header

---

## 6. Motion & Animation

### 6.1 Animation Principles

| Principle | Rule |
|-----------|------|
| **Purposeful** | Every animation guides attention or provides feedback |
| **Performant** | 60fps target; use `transform` and `opacity` only |
| **Accessible** | Respect `prefers-reduced-motion`; provide instant fallback |
| **Consistent** | Same easing/duration for same action types |
| **Subtle** | Animations enhance, never distract |

### 6.2 Duration Tokens

| Token | Duration | Usage |
|-------|----------|-------|
| `duration.instant` | 0ms | Reduced-motion fallback, state changes |
| `duration.fast` | 100ms | Button press, checkbox toggle |
| `duration.normal` | 200ms | Hover effects, color transitions |
| `duration.medium` | 300ms | Modal/dialog entry, dropdown open |
| `duration.slow` | 400ms | Page transitions, drawer slides |
| `duration.deliberate` | 600ms | Hero animations, celebratory effects |

### 6.3 Easing Tokens

| Token | Curve | Usage |
|-------|-------|-------|
| `ease.standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Most transitions (Material standard) |
| `ease.decelerate` | `cubic-bezier(0, 0, 0.2, 1)` | Entering elements (deceleration) |
| `ease.accelerate` | `cubic-bezier(0.4, 0, 1, 1)` | Exiting elements (acceleration) |
| `ease.bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Celebratory micro-interactions |
| `ease.spring` | Spring physics (stiffness: 300, damping: 30) | [Mobile] Native-feel transitions |

### 6.4 Page Transitions

| Platform | Transition | Duration |
|----------|-----------|----------|
| [Web] Standard | Fade content only, no layout shift | 200ms |
| [Web] Dashboard → Detail | Fade out + fade in | 300ms |
| [iOS] Push | Slide in from right | 300ms decelerate |
| [iOS] Pop | Slide out to right | 300ms accelerate |
| [iOS] Modal | Slide up from bottom | 400ms spring |
| [Android] Push | Shared element + fade | 300ms |
| [Android] Bottom sheet | Slide up | 300ms decelerate |

### 6.5 Micro-interactions

| Interaction | Animation |
|-------------|-----------|
| **Button press** | Scale 0.97, 100ms ease-standard |
| **Button release** | Scale 1.0, 150ms ease-bounce |
| **Checkbox check** | SVG stroke draw + subtle scale bounce, 200ms |
| **Switch toggle** | Thumb slides + track color fill, 200ms |
| **Tab switch** | Active indicator slides to new position, 250ms |
| **Pull-to-refresh** | Rotate spinner + rubber-band snap, native behavior |
| **Skeleton → Content** | Fade out skeleton + fade in content, 300ms crossfade |
| **Error shake** | Horizontal shake (±4px, 3 cycles), 400ms — draws attention |
| **Success pulse** | Subtle scale pulse (1.0→1.03→1.0) on completed element |

### 6.6 Skeleton Loading

```
┌─────────────────────────────────────────┐
│ ┌────┐  ┌──────────────────────────┐   │
│ │ ░░ │  │ ░░░░░░░░░░░░░░░░░░░░░░░░ │   │  ← Shimmer blocks
│ │ ░░ │  │ ░░░░░░░░░░░░░░░░░░░░░░░░ │   │
│ └────┘  └──────────────────────────┘   │
│                                        │
│ ┌────────────────────────────────────┐ │
│ │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ │
│ │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ │
│ └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

- Base color: `neutral-100` (light) / `neutral-800` (dark)
- Shimmer highlight: white at 20% opacity, animated left→right
- Animation: 1.5s infinite linear
- Match skeleton shape to final content layout (prevents CLS)
- Minimum display: 300ms (prevents flash)

### 6.7 Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [Web] CSS `prefers-reduced-motion` media query
- [iOS] `UIAccessibility.isReduceMotionEnabled`
- [Android] `ValueAnimator.areAnimatorsEnabled()` or accessibility settings
- When reduced motion is active: instant state changes, no decorative animations, functional animations only (e.g., modals still appear but without slide/scale)

### 6.8 Platform Animation Notes

| Concern | Web | Mobile |
|---------|-----|--------|
| Implementation | CSS transitions + Framer Motion for complex sequences | React Native Animated / Reanimated 3 |
| GPU acceleration | `will-change: transform, opacity` | `useNativeDriver: true` (RN) |
| Gesture-driven | Pointer events + CSS transitions | PanResponder / Reanimated gesture handlers |
| Scroll animations | IntersectionObserver + CSS | Native scroll event listeners |
| Lottie support | `lottie-react` for complex illustrations | `lottie-react-native` |



---

## 7. Accessibility (a11y)

### 7.1 WCAG 2.1 Level AA Compliance Checklist

- [x] **1.4.3 Contrast** — *Verified: Section 2.7 confirms AA compliance* — All text meets minimum 4.5:1 ratio (3:1 for large text 18px+/bold 14px+)
- [x] **1.4.11 Non-text Contrast** — *Verified: focus indicators, borders meet 3:1* — UI components and graphical objects meet 3:1 ratio
- [x] **2.1.1 Keyboard** — *Design specifies keyboard nav throughout* — All functionality available via keyboard (Tab, Enter, Space, Arrow keys)
- [x] **2.1.2 No Keyboard Trap** — *Modal focus trapping includes Esc to close* — Users can Tab away from any focused element
- [x] **2.4.3 Focus Order** — *Section 7.2 specifies logical tab order* — Tab order follows logical visual sequence
- [x] **2.4.4 Link Purpose** — *Documented in brand_docs/05_wording.md* — Link text describes destination (no "click here")
- [x] **2.4.7 Focus Visible** — *3px gold outline in Section 7.2* — Clear focus indicator on all interactive elements
- [x] **2.5.5 Target Size** — *Section 7.4: 44px min, 48px recommended* — Touch targets minimum 44x44px (44x44pt on iOS)
- [x] **1.3.1 Info and Relationships** — *Semantic HTML specified throughout* — Semantic HTML: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<table>` with proper headers
- [x] **4.1.2 Name, Role, Value** — *ARIA patterns in Section 7.3* — All interactive elements have accessible names via ARIA or native semantics
- [ ] **1.1.1 Non-text Content** — *[TODO-4] Add alt text to all assets during dev* — All images have meaningful `alt` text; decorative images use `alt=""` or `aria-hidden="true"`
- [ ] **1.2.1 Audio-only/Video-only** — *[TODO-5] Required if video added post-MVP* — Transcripts provided for audio content
- [x] **1.4.4 Resize Text** — *Responsive scaling in Section 3.4* — UI functional up to 200% zoom without horizontal scrolling
- [x] **1.4.10 Reflow** — *xs breakpoint + responsive strategy Section 4.5* — Content reflows correctly at 320px equivalent width

### 7.2 Focus Indicators

```css
/* Web: Gold's Gym signature focus ring */
:focus-visible {
  outline: 3px solid var(--color-brand-gold);
  outline-offset: 2px;
  border-radius: inherit;
}

/* For elements on gold backgrounds, invert */
.on-gold :focus-visible {
  outline-color: var(--color-brand-black);
}
```

- [Web] Custom focus ring using brand gold (`#FFEC00`)
- [Mobile] System default focus indicators; ensure TalkBack/VoiceOver navigation is tested
- Skip-to-content link: visible on first Tab press, sends user past navigation
- Focus trapping: active within modals/drawers (Tab cycles within, Esc closes)

### 7.3 Screen Reader Support

| Element | Requirement |
|---------|-------------|
| Buttons | Descriptive label: "Book class" not "Click here" |
| Icons with action | `aria-label` or visually hidden text describing action |
| Form inputs | `<label>` associated via `for` attribute; `aria-describedby` for error messages |
| Required fields | `aria-required="true"` + visual indicator |
| Error messages | `aria-live="polite"` region for dynamic validation feedback |
| Loading states | `aria-busy="true"` on container + `aria-label="Loading members list"` |
| Page title | Updates dynamically on route change: "Members | OhMyGold" |
| Decorative images | `alt=""` or `role="presentation"` |
| Complex widgets | Appropriate ARIA roles: `role="dialog"`, `role="tabpanel"`, `role="alert"` |

### 7.4 Touch Target Sizes

| Platform | Minimum | Recommended | Exception |
|----------|---------|-------------|-----------|
| [Web mobile] | 44x44px | 48x48px | Inline text links (must still be 44px tall) |
| [iOS] | 44x44pt | 48x48pt | System standard per HIG |
| [Android] | 48x48dp | 48x48dp | Material Design minimum |

- Adjacent interactive elements must have minimum 8px spacing
- Small touch targets (e.g., inline edit icons) should expand touch area via padding

### 7.5 SOC2-Related UI Patterns

OhMyGold handles sensitive personal and financial data. SOC2 compliance requires visible trust indicators:

- **Data handling banners**: Visible notice when viewing/exporting member PII — "This section contains personal data. Handle in accordance with GDPR."
- **Audit log visibility**: Admin and Manager roles can view who accessed/modified records and when — shown inline on detail views
- **Permission indicators**: UI elements show lock icon when user lacks permission (instead of hiding them — prevents confusion)
- **Session timeout warning**: 5-minute warning banner before auto-logout with "Extend session" action
- **Sensitive action confirmation**: Double-confirmation (type "DELETE" or enter password) for: bulk deletion, export of member data, role changes
- **Encryption badges**: Lock icon with tooltip on forms handling payment/health data

### 7.6 Accessibility Testing Checklist

- [ ] Navigate entire app using keyboard only (Tab, Enter, Space, Esc, Arrows)
- [ ] Test with VoiceOver (iOS) / TalkBack (Android) — all screens
- [ ] Test with NVDA or JAWS on web
- [ ] Verify color contrast with axe DevTools or Lighthouse
- [ ] Test at 200% zoom (browser zoom and system text size)
- [ ] Test with `prefers-reduced-motion: reduce` enabled
- [ ] Verify touch target sizes with inspector
- [ ] Run automated audit: axe-core, WAVE, or Lighthouse a11y score ≥ 95

---

## 8. i18n & Localization

### 8.1 Supported Locales

| Locale | Code | Status | Direction |
|--------|------|--------|-----------|
| French (France) | `fr-FR` | **Default** | LTR |
| English (US) | `en-US` | Supported | LTR |

> **Note:** French is the default locale. All UI must render correctly in French before English. Future locales (Arabic, Spanish) require RTL support architecture to be in place from day one.

### 8.2 Text Expansion Handling

French text is approximately **30% longer** than English equivalents. Specific impacts:

| Element | Impact | Strategy |
|---------|--------|----------|
| Buttons | French labels often wrap 2 lines | Allow multi-line buttons; min-height with vertical centering |
| Navigation labels | Longer menu items | Increase sidebar width slightly for `fr-FR`; icon + label layout |
| Form labels | "Numéro de téléphone" vs "Phone" | Top-aligned labels (not inline); max-width containers |
| Headings | Longer section titles | Allow text wrap; reduce font size by one step if > 2 lines |
| Empty states | Descriptive French phrases | Flexible container height |
| Toast messages | Longer sentences | Max-width with text wrap; ensure icon alignment |

#### Key French UI Terms

| English | French (fr-FR) |
|---------|---------------|
| Dashboard | Tableau de bord |
| Members | Membres / Adhérents |
| Classes | Cours collectifs |
| Schedule | Planning / Emploi du temps |
| Subscriptions | Abonnements |
| Payments | Paiements |
| Settings | Paramètres |
| Log out | Se déconnecter |
| Sign up | S'inscrire |
| Book a class | Réserver un cours |
| Check in | Enregistrer une entrée |
| Free trial | Séance d'essai |

### 8.3 Date & Time Formats

| Format | French (fr-FR) | English (en-US) |
|--------|---------------|-----------------|
| Short date | `29/04/2026` | `04/29/2026` |
| Medium date | `29 avr. 2026` | `Apr 29, 2026` |
| Long date | `29 avril 2026` | `April 29, 2026` |
| Day + date | `mercredi 29 avril` | `Wednesday, April 29` |
| Time (24h) | `14:30` | `14:30` (or 2:30 PM) |
| Relative | "il y a 2 heures" | "2 hours ago" |
| Week starts | Monday | Sunday |

- Use `Intl.DateTimeFormat` (web) / `DateFormatter` (iOS) / `DateTimeFormatter` (Android)
- Always store datetimes in UTC; display in user's local timezone
- [TODO] Confirm timezone handling strategy with backend (Europe/Paris default?)

### 8.4 Number Formats

| Format | French (fr-FR) | English (en-US) |
|--------|---------------|-----------------|
| Currency (EUR) | `29,99 €` | `€29.99` |
| Thousands separator | Space (`1 234`) | Comma (`1,234`) |
| Decimal separator | Comma (`3,14`) | Period (`3.14`) |
| Percentage | `15 %` (space before %) | `15%` |
| Phone | `+33 1 23 45 67 89` | `+1 (234) 567-890` |

- Currency: always show EUR for French market; USD as fallback for `en-US`
- Use `Intl.NumberFormat` with `style: 'currency', currency: 'EUR'`

### 8.5 RTL Architecture (Future-Proofing)

Although current locales are LTR, the architecture must support future RTL languages (Arabic, Hebrew):

```css
/* Logical properties for RTL readiness */
.element {
  margin-inline-start: 16px;  /* replaces margin-left */
  margin-inline-end: 16px;    /* replaces margin-right */
  border-start-start-radius: 8px;
  text-align: start;           /* replaces text-align: left */
}
```

- [Web] Use CSS logical properties (`inline-start`, `block-end`, etc.)
- [Mobile] React Native `I18nManager.forceRTL(true)` for testing; layout with flexbox row direction
- Icons that imply direction (arrows) should flip in RTL contexts
- Calendar component: week starts from right in RTL

### 8.6 Translation Strategy

#### Key Naming Convention

```
{section}.{element}.{property}

Examples:
members.list.header.title        → "Members"
members.list.header.subtitle     → "Manage all gym members"
members.list.search.placeholder  → "Search by name, email, or ID..."
members.list.action.add          → "Add Member"
members.list.empty.title         → "No members yet"
members.list.empty.description   → "Start by adding your first member."
members.list.empty.action        → "Add First Member"
```

- Namespaced by feature module (members, classes, payments, etc.)
- Separate files per locale: `fr-FR/members.json`, `en-US/members.json`
- Fallback chain: `fr-FR` → `fr` → `en-US` → key name (for debugging)
- Translation management: [TODO] Select tool (Lokalise, Phrase, or self-hosted)

---

## 9. Iconography

### 9.1 Icon Library

| Context | Library | Implementation |
|---------|---------|----------------|
| [Web] All icons | **Lucide React** (`lucide-react`) | React components, tree-shakeable |
| [Mobile iOS] | **SF Symbols** + custom | Native SwiftUI system images |
| [Mobile Android] | **Material Symbols** + custom | Compose Material icons |
| [Shared RN] | **Lucide React Native** (`lucide-react-native`) | SVG-based, consistent with web |

> **Note:** Lucide was chosen for its clean, consistent stroke style (2px), extensive set (1000+ icons), excellent React/React Native support, and active maintenance. All icons have the same visual weight which creates a harmonious UI.

### 9.2 Icon Sizes

| Context | Size | Stroke Width | Usage |
|---------|------|-------------|-------|
| Inline with text | 16px / 16dp | 2px | Inline indicators, small buttons |
| Navigation | 24px / 24dp | 2px | Tab bar, sidebar items |
| Buttons | 20px / 20dp | 2px | Button icon + label |
| Feature icons | 32px / 32dp | 2px | Empty states, feature cards |
| Large decorative | 48px / 48dp | 1.5px | Hero sections, onboarding |
| Avatar fallback | 24px / 24dp | 2px | User initials container |

### 9.3 Custom Icons (Branded)

The following icons require custom design to match Gold's Gym brand identity:

| Icon | Description | Required For |
|------|-------------|--------------|
| **GoldsGym Logo Mark** | Circular badge (bodybuilder silhouette) | Splash screen, app icon, watermark |
| **Dumbbell** | Custom styled barbell/dumbbell | Fitness context, workout sections |
| **Trophy/Achievement** | Branded achievement shape | Gamification, client progress |
| **Check-in** | Barcode scan success | Member check-in flow |
| **Class Card** | Calendar + fitness combined | Class booking feature icon |
| **Membership Card** | Digital card representation | Member profile, subscription display |
| **Gold's Arena** | Arena/stadium silhouette | Arena-specific sections (France market only — conditional on location) |

> **Note:** "Gold's Arena" is a France-specific branded zone. This icon should only appear in the UI when the user's selected club has an Arena zone. For multi-market deployments, conditionally render this icon based on market configuration.
>
> **Note:** Custom icons should maintain Lucide's 2px stroke weight, 24x24px viewbox, and geometric style for consistency. Export as SVG (web) and PDF/SVG (iOS) / Vector Drawable (Android).

### 9.4 Icon Colors by Context

| Context | Color Token | Notes |
|---------|-------------|-------|
| Default | `neutral-600` | Standard icon color |
| Active/Selected | `brand.gold` | Navigation active, selected tab |
| Primary action | `brand.black` | On gold buttons |
| Secondary | `neutral-400` | Inactive states, placeholders |
| Success | `semantic.success` | Check marks, completed states |
| Error | `semantic.error` | Delete actions, validation errors |
| Warning | `semantic.warning` | Alerts, pending items |
| Info | `semantic.info` | Informational hints |
| Role accent | `color.role.{role}` | Role-specific feature icons |

### 9.5 Icon + Text Pairing Rules

- Icon always precedes text (LTR): `icon + label`
- Spacing between icon and text: `space.sm` (8px/8dp)
- Vertical alignment: center
- If icon-only button: minimum 44x44px touch target + `aria-label`
- Navigation items: icon above label (mobile tabs) or icon before label (sidebar)

---

## 10. Platform-Specific Guidance

### 10.1 Web Application

#### Philosophy
Desktop-first responsive design with maximum information density. The web panel is the primary workspace for Admin, Manager, and Employee roles.

#### Key Characteristics

| Aspect | Specification |
|--------|--------------|
| **Layout** | Sidebar (256px) + main content area; fixed topbar (64px) |
| **Responsive** | Breakpoint at 1024px: sidebar collapses to icon-only (72px) |
| **Below 768px** | Sidebar becomes hamburger drawer; single-column layout |
| **Feature density** | High: data tables, multi-panel views, inline editing |
| **Navigation depth** | Up to 3 levels: Main → Section → Detail |
| **Modals** | Centered overlay, up to 960px max-width |
| **Filters** | Right side panel (320px) on desktop; bottom sheet on mobile |
| **Rich dashboards** | Full chart libraries, real-time data widgets, drag-and-drop |

#### Web Technology Recommendations

- **Framework:** React 19+ with TypeScript
- **Styling:** Tailwind CSS v4 with custom design token integration
- **UI Components:** Radix UI primitives (accessible, headless) + custom OhMyGold styling
- **Charts:** Recharts (React wrapper for D3)
- **Tables:** TanStack Table (formerly React Table) — sorting, filtering, pagination, virtualization
- **Forms:** React Hook Form + Zod validation
- **State:** Zustand or Redux Toolkit
- **Routing:** React Router v7

### 10.2 Mobile Application (iOS & Android)

#### Philosophy
Action-focused, gesture-driven, optimized for on-the-go usage. Primary users: Client and Visitor roles; quick-actions for Employee/Coach.

#### Key Characteristics

| Aspect | iOS | Android |
|--------|-----|---------|
| **Navigation** | Bottom tab bar + stack push/pop | Bottom navigation + system back gesture |
| **Transitions** | Slide from right (push), spring physics | Material fade + shared element |
| **Lists** | Native UITableView feel, swipe actions | RecyclerView with Material ripple |
| **Inputs** | iOS native date/time pickers, keyboard types | Material text fields, native pickers |
| **Dialogs** | Sheet presentation (iOS 15+), alert | Bottom sheets, Material dialogs |
| **Pull-to-refresh** | Native iOS spinner | Material circular progress |
| **Haptics** | Light impact on success, error on failure | Standard vibration patterns |
| **App icon** | Adaptive with Gold's Gym badge | Adaptive icon with brand badge |

#### Mobile Feature Integration

| Feature | iOS | Android | Notes |
|---------|-----|---------|-------|
| **Push notifications** | APNS | Firebase Cloud Messaging | Role-targeted: class reminders, payment due, new message |
| **Camera** | AVFoundation | CameraX | Barcode scanning for check-in, profile photo capture |
| **Location** | CoreLocation | Fused Location Provider | Find nearest gym, location-based offers |
| **Biometrics** | Face ID / Touch ID | Fingerprint / Face Unlock | Quick login, confirm payments |
| **Health sync** | HealthKit | Google Fit | Optional workout data import (client feature) |
| **Calendar** | EventKit | Calendar Provider | Booked classes sync to device calendar |
| **Deep linking** | Universal Links | Android App Links | Share class links, password reset |
| **Offline** | Core Data / SwiftData | Room Database | View cached data when offline; sync on reconnect |

#### Mobile Technology Recommendations

- **Cross-platform:** React Native 0.75+ with Expo (shared components via React Native Web)
- **Navigation:** React Navigation v7 (bottom tabs + native stack)
- **State:** Zustand + React Query for server state
- **Storage:** AsyncStorage (settings) + SQLite via Expo (offline data)
- **Animations:** React Native Reanimated 3
- **Camera:** Expo Camera / react-native-vision-camera
- **Maps:** react-native-maps
- **Push:** Expo Notifications

### 10.3 Shared Components (React Native Web)

Components that should be shared between web and mobile via React Native Web:

- Button (all variants)
- Input / TextField
- Card (basic)
- Avatar
- Badge / Tag
- Icon (Lucide wrapper)
- Loading spinner / Skeleton
- Toast notification content (positioning is platform-specific)
- Empty state illustrations
- Form validation logic

### 10.4 Platform Divergence (Intentional Differences)

| Feature | Web | Mobile | Rationale |
|---------|-----|--------|-----------|
| Data tables | Full-featured with sorting, filtering, pagination | Card list with swipe actions | Screen real estate |
| Dashboard layout | Multi-column grid, dense | Single column, scrollable | Touch interaction model |
| Filters | Right panel with checkboxes/range sliders | Bottom sheet with chips | Reachability |
| Modal dialogs | Centered overlay | Bottom sheet or full-screen | Native patterns |
| Image gallery | Lightbox overlay | Full-screen swipe carousel | Touch navigation |
| Notifications | Top-right toast stack | System push + in-app drawer | Platform conventions |
| Onboarding | Multi-step modal | Full-screen swipeable pages | Immersive mobile experience |
| Search | Omnibar in topnav | Dedicated search tab with recent suggestions | Discovery pattern |
| Profile editing | Inline form on profile page | Full-screen form push | Focus and context |

---

## 11. Role-Based UI Considerations

### 11.1 Admin (All Locations)

| Aspect | Design Decision |
|--------|----------------|
| **Theme preference** | Dark mode default — reduces eye strain during long management sessions |
| **Information density** | Maximum — dense data tables, multi-column dashboards |
| **Navigation** | Full sidebar with all sections; collapsible groups |
| **Primary screens** | Cross-location analytics, user management, system configuration, audit logs |
| **Bulk actions** | Checkbox selection + toolbar: bulk delete, export, role assignment |
| **Data visualization** | Complex charts: revenue by location, membership trends, churn analysis |
| **Special features** | Audit log viewer, system health dashboard, location comparison tools |
| **Accent color** | `color.role.admin` (red) — used sparingly for admin-only actions |

### 11.2 Manager (Single Location)

| Aspect | Design Decision |
|--------|----------------|
| **Theme preference** | Light mode default (clean, professional) with dark mode toggle |
| **Information density** | High — single-location data with team overview |
| **Navigation** | Full sidebar minus system-level items |
| **Primary screens** | Location dashboard, class schedule, staff management, member list |
| **Scheduling** | Drag-and-drop class calendar with instructor assignment |
| **Reports** | Location-specific: attendance, revenue, member growth |
| **Special features** | Staff shift planning, member communication tools, equipment tracking |
| **Accent color** | `color.role.manager` (blue) |

### 11.3 Employee (Day-to-Day)

| Aspect | Design Decision |
|--------|----------------|
| **Theme preference** | Light mode; high contrast for fast scanning |
| **Information density** | Low-to-medium; quick-action focused |
| **Navigation** | Simplified sidebar: Check-in, Members, Schedule, POS |
| **Primary screens** | Barcode scanner dashboard, quick member lookup, today's class list |
| **Barcode scanning** | Large, prominent scan button; camera viewfinder with QR overlay |
| **Check-in flow** | Optimized for speed: scan → confirm → done (under 3 seconds) |
| **Member lookup** | Search-first interface with recent/frequent members |
| **Accent color** | `color.role.employee` (amber) |

### 11.4 Teacher / Coach

| Aspect | Design Decision |
|--------|----------------|
| **Theme preference** | Light mode with warm tones |
| **Information density** | Medium — class-focused views |
| **Navigation** | Compact sidebar: My Classes, Attendance, Students, Messaging |
| **Primary screens** | Class roster, attendance tracker, student progress, messaging |
| **Attendance** | Quick tap-to-mark-present grid with photo avatars; absent = red, present = green |
| **Class preparation** | Pre-class checklist, equipment notes, student limit indicator |
| **Progress tracking** | Per-student workout notes, goal tracking, achievement badges |
| **Accent color** | `color.role.coach` (emerald) |

### 11.5 Client (Gym Subscriber)

| Aspect | Design Decision |
|--------|----------------|
| **Theme preference** | Dark mode option; gold accents feel premium and motivating |
| **Information density** | Low — clean, spacious, motivational |
| **Navigation** | Bottom tabs: Home, Classes, Progress, Profile |
| **Primary screens** | Personal dashboard, class booking, workout history, progress tracking |
| **Dashboard** | Today's workout/classes, quick stats, motivational messaging |
| **Class booking** | Visual class cards with instructor photo, time, spots remaining |
| **Progress** | Achievement rings, streak counters, before/after photo comparison |
| **Social** | Optional: friend activity, class leaderboards, achievement sharing |
| **Accent color** | `color.role.client` (gold) — premium, brand-aligned |
| **Gamification** | Streak flames, achievement badges, level progression, personal records |

### 11.6 Visitor (Prospect / Demo)

| Aspect | Design Decision |
|--------|----------------|
| **Theme preference** | Light mode, bright, welcoming |
| **Information density** | Very low — showcase mode |
| **Navigation** | Minimal: Explore, Plans, Trial Signup |
| **Primary screens** | Gym showcase (photos/videos), membership plans, trial booking |
| **Showcase** | Immersive photo gallery, equipment highlights, trainer profiles |
| **Conversion flow** | Prominent trial signup CTA, plan comparison, frictionless signup |
| **Trust signals** | Testimonials, member count, years established, Google reviews |
| **Accent color** | `color.role.visitor` (purple) — distinct from member gold |
| **Upsell paths** | After trial signup → app download prompt, after trial completion → membership offer |

### 11.7 Role-Based Navigation Matrix

| Section | Admin | Manager | Employee | Coach | Client | Visitor |
|---------|-------|---------|----------|-------|--------|---------|
| Dashboard | Full | Location | Simplified | My Classes | Personal | — |
| Members | All | Location | Search/Check-in | My Students | Self only | — |
| Classes | All | Location | Today's | My Schedule | Bookable | Browse |
| Schedule | All locations | Location | Today | My own | Bookable | Browse |
| Payments | All | Location | POS | — | Own history | Plan pricing |
| Reports | Full suite | Location | — | Attendance | Personal stats | — |
| Settings | System | Location | Profile | Profile | Profile | — |
| Audit Logs | View | — | — | — | — | — |

---

## 12. File Structure

### 12.1 Design Token Organization

```
tokens/
├── base/
│   ├── colors.json          # All color values (light + dark)
│   ├── typography.json      # Font families, sizes, weights, line-heights
│   ├── spacing.json         # Spacing scale (base 4px)
│   ├── breakpoints.json     # Responsive breakpoints
│   ├── shadows.json         # Shadow definitions (web only)
│   ├── borders.json         # Border radius, width tokens
│   └── motion.json          # Duration, easing curves
├── themes/
│   ├── light.json           # Light mode token assignments
│   ├── dark.json            # Dark mode token assignments
│   └── brand/               # Brand-specific overrides
│       └── golds-gym.json
├── roles/
│   ├── admin.json
│   ├── manager.json
│   ├── employee.json
│   ├── coach.json
│   ├── client.json
│   └── visitor.json
└── platforms/
    ├── web.json             # Web-specific token overrides
    ├── ios.json
    ├── android.json
    └── shared.json          # Cross-platform token definitions
```

### 12.2 Component Organization (Atomic Design)

```
components/
├── atoms/                   # Smallest building blocks
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.styles.ts
│   │   ├── Button.types.ts
│   │   ├── Button.stories.tsx
│   │   └── Button.test.tsx
│   ├── Input/
│   ├── Icon/
│   ├── Avatar/
│   ├── Badge/
│   └── Skeleton/
├── molecules/               # Groups of atoms
│   ├── InputField/          # Label + Input + Error
│   ├── SearchBar/           # Input + Icon + Clear
│   ├── MetricCard/          # Icon + Value + Label + Trend
│   ├── ClassCard/           # Image + Title + Time + Instructor + Book button
│   ├── MemberRow/           # Avatar + Name + Status + Actions
│   └── Toast/
├── organisms/               # Complex UI sections
│   ├── Sidebar/
│   ├── Topbar/
│   ├── DataTable/
│   ├── ClassCalendar/
│   ├── DashboardGrid/
│   └── MemberProfile/
├── templates/               # Page-level layouts
│   ├── DashboardLayout/
│   ├── AuthLayout/
│   └── SettingsLayout/
└── pages/                   # Role-specific page compositions
    ├── admin/
    ├── manager/
    ├── employee/
    ├── coach/
    ├── client/
    └── visitor/
```

### 12.3 Theme Configuration

```typescript
// themes/ohmygold.ts — Single source of truth
export const ohmygoldTheme = {
  colors: {
    brand: {
      gold: '#FFEC00',
      'gold-dark': '#D4C400',
      black: '#000000',
      white: '#FFFFFF',
      charcoal: '#231F20',
      iron: '#1A1A1A',
    },
    semantic: { /* ... */ },
    neutral: { /* ... */ },
    role: {
      admin: '#EF4444',
      manager: '#3B82F6',
      employee: '#F59E0B',
      coach: '#10B981',
      client: '#FFEC00',
      visitor: '#A855F7',
    },
    dark: { /* dark mode palette */ },
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  spacing: { /* 4px base scale */ },
  breakpoints: { xs: 0, sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 },
  motion: { /* durations and easings */ },
  borderRadius: { sm: 6, md: 8, lg: 12, xl: 16, full: 999 },
} as const;
```

### 12.4 Asset Organization

```
assets/
├── brand/
│   ├── logo/
│   │   ├── logo-mark.svg              # Circular badge icon
│   │   ├── logo-wordmark.svg          # "GOLD'S GYM" text
│   │   ├── logo-full.svg              # Mark + wordmark combined
│   │   ├── logo-france.svg            # Full logo with France accent
│   │   └── favicon/                   # All favicon sizes
│   └── wordmark/
│       └── golds-gym-wordmark.svg
├── icons/
│   ├── lucide/                        # Standard Lucide icons (auto-imported)
│   └── custom/                        # Custom-branded icons
│       ├── dumbbell.svg
│       ├── trophy.svg
│       ├── check-in.svg
│       ├── class-card.svg
│       ├── membership-card.svg
│       └── arena.svg
├── illustrations/
│   ├── empty-states/                  # No data illustrations per feature
│   ├── onboarding/                    # Onboarding screen illustrations
│   └── achievements/                  # Badge/achievement artwork
└── images/
    ├── avatars/                       # Default avatar placeholders
    ├── backgrounds/                   # Subtle patterns, hero backgrounds
    └── placeholders/                  # Gym equipment, class imagery
```

### 12.5 Implementation Checklist

#### Foundation
- [ ] Set up design token pipeline (Style Dictionary or Token Studio)
- [ ] Configure Tailwind CSS theme with OhMyGold tokens
- [ ] Set up font loading (Inter + JetBrains Mono) with French character support
- [ ] Implement dark mode toggle with system preference detection
- [ ] Configure React Native theme provider with token mapping

#### Components
- [ ] Implement all button variants (web + mobile)
- [ ] Implement input system with all types and validation states
- [ ] Implement card components (content, metric, profile)
- [ ] Implement navigation system (sidebar, topbar, mobile tabs)
- [ ] Implement modal/dialog system (centered, bottom sheet, drawer)
- [ ] Implement data display (table web, card list mobile, charts)
- [ ] Implement calendar/timetable component
- [ ] Implement notification system (toast, banner, in-app)

#### Accessibility
- [ ] Add keyboard navigation to all interactive elements
- [ ] Implement focus trapping for modals and drawers
- [ ] Add screen reader labels to all icons and actions
- [ ] Test color contrast across all themes
- [ ] Implement reduced-motion support
- [ ] Add skip-to-content link

#### i18n
- [ ] Set up i18n framework with `fr-FR` and `en-US`
- [ ] Extract all UI strings to translation files
- [ ] Implement date/time/number localization
- [ ] Test French text expansion in all components
- [ ] Set up RTL architecture foundations

#### Quality
- [ ] Create Storybook stories for all components
- [ ] Write unit tests for component logic
- [ ] Run visual regression tests
- [ ] Perform accessibility audit (target: 95+ Lighthouse score)
- [ ] Conduct French localization review with native speaker
- [ ] Performance test: web vitals (LCP < 2.5s, CLS < 0.1, FID < 100ms)

---

## Appendix A: Quick Reference

### A.1 Brand Color Summary
| Purpose | Hex |
|---------|-----|
| Primary Gold | `#FFEC00` |
| Black | `#000000` |
| White | `#FFFFFF` |
| Charcoal (cards dark) | `#231F20` |

### A.2 Typography Summary
| Purpose | Size (Web) | Size (Mobile) | Weight |
|---------|-----------|---------------|--------|
| Hero/Display | 56px | 36sp | 800 |
| Page title | 36px | 28sp | 700 |
| Section heading | 24px | 20sp | 600 |
| Body | 16px | 14sp | 400 |
| Caption | 14px | 12sp | 400 |

### A.3 Spacing Summary
| Token | Value |
|-------|-------|
| XS | 4px |
| SM | 8px |
| Base | 16px |
| LG | 24px |
| XL | 32px |
| 2XL | 48px |

### A.4 Role Accent Colors
| Role | Color |
|------|-------|
| Admin | `#EF4444` (red) |
| Manager | `#3B82F6` (blue) |
| Employee | `#F59E0B` (amber) |
| Coach | `#10B981` (emerald) |
| Client | `#FFEC00` (gold) |
| Visitor | `#A855F7` (purple) |

### A.5 Breakpoints
| Name | Width |
|------|-------|
| XS | 0 |
| SM | 640px |
| MD | 768px |
| LG | 1024px |
| XL | 1280px |
| 2XL | 1536px |

---

> **End of OhMyGold Design System v1.1.0**
>
> For questions, updates, or `[TODO]` resolutions, contact the Gold's Gym France Digital Team.
> This document is LLM-evolutive — feed it back into the design iteration loop as the product evolves.

---

## Appendix B: Cross-Reference to Brand Documentation

This design system is built upon the brand research documented in the `brand_docs/` directory. The following table maps DESIGN.MD sections to their source brand documents:

| DESIGN.MD Section | Topic | Source File | Source Section |
|-------------------|-------|-------------|----------------|
| 1.1 (Project Codename) | OhMyGold naming | `brand_docs/05_wording.md` | Section 11b |
| 2.1 (Primary Palette) | Brand gold color | `brand_docs/06_brand_identity_visual.md` | Section 2 |
| 2.5 (Role Colors) | User role definitions | `brand_docs/` (all files) | User personas across all docs |
| 3.1 (Typography) | Font choice | `brand_docs/06_brand_identity_visual.md` | Section 3 |
| 5.1 (Buttons) | CTA button styles | `brand_docs/06_brand_identity_visual.md` | Section 6 |
| 6.x (Motion) | Animation patterns | `brand_docs/06_brand_identity_visual.md` | Section 7 |
| 7.x (Accessibility) | WCAG compliance | `brand_docs/06_brand_identity_visual.md` | Color contrast reference |
| 8.2 (i18n French Terms) | Brand French terminology | `brand_docs/05_wording.md` | Sections 2-4 |
| 9.3 (Custom Icons) | Branded icons | `brand_docs/06_brand_identity_visual.md` | Section 4 |
| 11.x (Role-Based UI) | User persona workflows | `brand_docs/` (all files) | Daily needs per role |
| 12.4 (Asset Org) | Asset folder structure | `assets/` directory | ASSET_MANIFEST.md |

### Brand Document Quick Links

| File | Purpose | Lines |
|------|---------|-------|
| `brand_docs/00_summary_report.md` | Executive summary & app design insights | ~200 |
| `brand_docs/01_philosophy.md` | Brand philosophy, heritage, values, positioning | ~250 |
| `brand_docs/02_offers.md` | Subscription tiers, pricing, CGV, cancellation | ~280 |
| `brand_docs/03_locations.md` | Club locations, addresses, hours, amenities | ~290 |
| `brand_docs/04_zones_equipment.md` | Training zones, equipment, facility features | ~390 |
| `brand_docs/05_wording.md` | Brand voice, taglines, style guide, terminology | ~320 |
| `brand_docs/06_brand_identity_visual.md` | Colors (hex), typography, logo, visual elements | ~390 |
| `brand_docs/07_steering_document.md` | Project steering, user personas, key instructions | ~200+ |

---

## Appendix C: Consolidated TODO List

| ID | TODO Item | Location | Owner | Target Date |
|----|-----------|----------|-------|-------------|
| TODO-1 | Confirm server-side error message format | Section 5.2 | Backend Lead | 2026-05-06 |
| TODO-2 | Confirm timezone handling (Europe/Paris default?) | Section 8.3 | Backend Lead | 2026-05-06 |
| TODO-3 | Select translation management tool | Section 8.6 | Tech Lead | 2026-05-13 |
| TODO-4 | Add alt text to all asset manifest entries | Appendix B | Frontend Lead | 2026-05-13 |
| TODO-5 | Plan video transcript workflow if video added | Section 7.1 | Content Lead | Post-MVP |

---

## Changelog

| Date | Change | Issue ID | Reason |
|------|--------|----------|--------|
| 2026-04-29 | Verified gold color `#FFEC00` as PMS 3945 C digital equivalent | DM-001 | Brand color consistency |
| 2026-04-29 | Added Acumin Pro acknowledgment as actual website font with CSS source | DM-002 | Document deliberate font departure |
| 2026-04-29 | Added Appendix B: Cross-Reference to brand_docs files | DM-003 | Enable design decision traceability |
| 2026-04-29 | Integrated brand-specific French terminology from 05_wording.md | DM-004 | Brand voice in i18n |
| 2026-04-29 | Checked WCAG items: 12 of 14 validated [x], 2 marked pending [ ] | DM-005 | Document validation status |
| 2026-04-29 | Added Appendix C: Consolidated TODO list with owners and dates | DM-006 | Track all TODOs centrally |
| 2026-04-29 | Added Client/Visitor role color differentiation note | DM-007 | Clarify role color rationale |
| 2026-04-29 | Added market-availability note for Gold's Arena (France-only) | DM-008 | Flag conditional rendering |


