# Gold's Gym France -- Visual Identity Elements

> **Document Version:** 1.0
> **Last Updated:** 2026-04-29
> **Source:** Gold's Gym France website (goldsgymfrance.fr), global brand identity research, logo history analysis

> **Brand Gold Color Note:** The hex value `#FFEC00` used throughout this document is the **PMS 3945 C digital equivalent** — the official Gold's Gym brand gold color. This value was cross-referenced against the official Gold's Gym brand guidelines. The Gold's Gym France website CSS uses a slightly different value (`#fedb00`) for web rendering purposes, but `#FFEC00` is the canonical brand color specification.

---

## 1. Logo System

### Primary Logo: The Iconic Bodybuilder

The Gold's Gym logo features a **muscular bodybuilder silhouette holding a barbell** inside a **yellow circle**. This is one of the most recognizable fitness brand marks in the world.

#### Logo History Timeline

| Era | Year | Description |
|-----|------|-------------|
| **Version 1** | 1965 -- 1990 | Detailed bodybuilder illustration with "Venice, California" and "Since 1965" encircling. Shaded metallic text with 3D gold effect. |
| **Version 2** | 1990 -- 2000 | Streamlined, more graphic bodybuilder. Strong bold lines, less detail. Determined, confident expression with slight smile. |
| **Version 3** | 2000 -- Present | Minimalist yet realistic black bodybuilder silhouette holding barbell. Encircled by "GOLD'S GYM" text. Yellow circle background. |

#### Logo Composition

```
    +---------------------------+
    |      GOLD'S  GYM          |
    |   +------------------+    |
    |   |   [Bodybuilder   |    |
    |   |    silhouette    |    |
    |   |    with barbell] |    |
    |   +------------------+    |
    |      (c) 1965             |
    +---------------------------+
          Yellow Circle
```

#### Logo Variants (France Website)

1. **Full Logo** -- Bodybuilder icon + "GOLD'S GYM" wordmark (primary)
2. **Icon Only** -- Yellow circle bodybuilder (favicon, app icon)
3. **Wordmark Only** -- "GOLD'S GYM" text (secondary usage)
4. **Social Media Avatars** -- Circular cropped bodybuilder icon

---

## 2. Color Palette

### Primary Colors

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Gold's Yellow** | `#FFEC00` | rgb(255, 236, 0) | Primary brand color, logo circle, accents. *Source: PMS 3945 C digital equivalent — official Gold's Gym brand gold* |
| **Gold's Black** | `#000000` | rgb(0, 0, 0) | Bodybuilder silhouette, text, backgrounds |
| **Gold's Gold** | `#D4AF37` | rgb(212, 175, 55) | Metallic accents, premium elements |

### Secondary Colors

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **White** | `#FFFFFF` | rgb(255, 255, 255) | Text on dark backgrounds, negative space |
| **Dark Gray** | `#1A1A1A` | rgb(26, 26, 26) | Backgrounds, cards, sections |
| **Medium Gray** | `#333333` | rgb(51, 51, 51) | Secondary backgrounds |
| **Light Gray** | `#F5F5F5` | rgb(245, 245, 245) | Subtle backgrounds, dividers |

### Accent Colors (Digital/UI)

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Success Green** | `#4CAF50` | Success states, checkmarks |
| **Alert Red** | `#E53935` | Errors, warnings, cancellation |
| **Info Blue** | `#2196F3` | Links, informational elements |
| **CTA Orange** | `#FF6B00` | Call-to-action buttons (observed on French site) |

### France Website Color Observations

Based on analysis of goldsgymfrance.fr:

- **Hero sections**: Dark backgrounds (black/dark gray) with gold/yellow text
- **Content sections**: Alternating dark/light for visual rhythm
- **Buttons**: Gold/yellow primary CTA, outlined secondary CTA
- **Text**: White on dark, black on light -- high contrast throughout
- **Promotional banners**: Gold gradient backgrounds with black text

---

## 3. Typography

### Primary Typeface

**Global Gold's Gym Font**: A custom or heavily modified **serif typeface** with pronounced thick/thin stroke contrast.

- **Style**: Classic serif with elegant, slightly old-fashioned character
- **Weight**: Bold for headlines, Regular for body
- **Case**: ALL CAPS for brand name and major headlines
- **Character**: Combines strokes of various thicknesses, creating an elegant, premium feel

### Typography Characteristics

| Element | Style | Size/Weight |
|---------|-------|-------------|
| **Brand Name** | Serif, ALL CAPS | Bold, tracking slightly loose |
| **Headlines (H1)** | Sans-serif, Bold | Large (48-72px) |
| **Headlines (H2)** | Sans-serif, Bold | Medium (32-48px) |
| **Subheadings** | Sans-serif, Semi-bold | Medium (20-28px) |
| **Body Text** | Sans-serif, Regular | 16-18px, line-height 1.5-1.7 |
| **CTA Buttons** | Sans-serif, Bold | 14-16px, ALL CAPS or Title Case |
| **Captions** | Sans-serif, Regular | 12-14px |
| **Pricing** | Sans-serif, Bold | Large (32-48px), gold color |

### France Website Typography Notes

The French site uses **"Acumin Pro"** (and "Acumin Pro ExtraCondensed" for headings) — the actual font declared in the goldsgymfrance.fr website CSS via `font-family: var(--wp--preset--font-family--acumin-pro)`. This is a professional sans-serif typeface.

**Actual Website Font Stack:**
```css
/* From goldsgymfrance.fr CSS */
font-family: acumin-pro, "Acumin Pro", sans-serif;
```

**Note for App Design:** The OhMyGold design system uses **Inter** as the app font (see DESIGN.MD Section 3.1) — a deliberate departure chosen for superior open-source availability, broader weight range, and optimized on-screen legibility at small sizes. Acumin Pro may be licensed later for marketing pages if strict brand alignment is required.

For brand headings on the website, a **bold condensed sans-serif** (Acumin Pro ExtraCondensed) is used for impact.

---

## 4. Imagery Style

### Photography Direction

| Aspect | Style |
|--------|-------|
| **Lighting** | Dramatic, high-contrast, moody |
| **Color Grading** | Warm tones, desaturated backgrounds, gold accents |
| **Subjects** | Diverse athletes, muscular physiques, intense expressions |
| **Setting** | Gym floor, dramatic architectural spaces |
| **Mood** | Intense, aspirational, powerful, heroic |
| **Composition** | Low angles, heroic framing, dramatic shadows |

### Key Visual Motifs

1. **The Barbell** -- Central equipment symbol, represents serious training
2. **The Arena** -- Gladiatorial/combat framing of workout spaces
3. **Gold Elements** -- Metallic gold accents, premium feel
4. **Black Backgrounds** -- Dramatic, high-contrast presentation
5. **Sweat & Intensity** -- Close-ups of effort and determination
6. **Venice Beach** -- Nostalgic references to the original location

### Iconography Style

- **Bold, geometric icons** -- Minimal line work
- **Filled icons** -- Solid shapes rather than outlines
- **Gold or white** -- On dark backgrounds
- **Consistent stroke weight** -- Uniform visual language

---

## 5. Layout & Composition

### Website Layout Patterns (France)

| Element | Pattern |
|---------|---------|
| **Header** | Fixed top, dark background, logo left, nav center, CTA right |
| **Hero Section** | Full-width, dark background, large headline left, image right |
| **Content Sections** | Alternating dark/light, two-column layouts |
| **Cards** | Dark cards on light bg, or light cards on dark bg, subtle rounded corners (4-8px) |
| **CTA Buttons** | Pill-shaped (border-radius: 50px), gold fill with black text |
| **Footer** | Dark background, multi-column link layout, social icons |

### Spacing System

| Token | Value | Usage |
|-------|-------|-------|
| **XS** | 4px | Tight gaps, icon padding |
| **SM** | 8px | Small gaps, button padding |
| **MD** | 16px | Standard gaps, card padding |
| **LG** | 32px | Section internal spacing |
| **XL** | 64px | Section-to-section spacing |
| **XXL** | 128px | Major section breaks |

---

## 6. Button & Component Styles

### Primary CTA Button

```
Background: Gold/Yellow (#FFEC00 or gradient)
Text: Black (#000000)
Border-radius: 50px (pill shape)
Padding: 12px 32px
Font: Bold, 14-16px
Shadow: Subtle drop shadow
Hover: Slightly brighter gold, subtle lift
```

### Secondary CTA Button

```
Background: Transparent
Text: White or Gold
Border: 2px solid Gold
Border-radius: 50px
Padding: 12px 32px
Font: Bold, 14-16px
Hover: Gold fill, black text
```

### Card Component

```
Background: Dark Gray (#1A1A1A)
Border-radius: 8-12px
Padding: 24-32px
Border: None or 1px subtle gray
Shadow: Subtle depth shadow
Hover: Slight brightness increase
```

### Input Fields

```
Background: Dark (#0A0A0A or #1A1A1A)
Border: 1px solid #333333
Border-radius: 8px
Text: White
Placeholder: Gray (#666666)
Focus: Gold border
```

---

## 7. Animation & Motion

### Observed Patterns

| Element | Animation | Timing |
|---------|-----------|--------|
| **Page Load** | Fade in + slight upward translate | 0.3-0.5s ease-out |
| **Scroll Reveal** | Fade in + translate Y (20-40px) | 0.4-0.6s ease-out |
| **Button Hover** | Scale 1.02, brightness increase | 0.2s ease |
| **Card Hover** | Subtle lift (translateY -4px), shadow increase | 0.2s ease |
| **Carousel** | Smooth horizontal scroll | 0.4s ease-in-out |
| **Counter** | Number count-up animation | 1-2s ease-out |

### Motion Principles
- **Smooth, not snappy** -- Premium feel over speed
- **Subtle, not flashy** -- Enhance content, don't distract
- **Consistent easing** -- Ease-out for entrances, ease for interactions

---

## 8. App-Specific Visual Elements

### App Icon
- **Primary**: Gold's Gym bodybuilder silhouette on yellow circle
- **Secondary**: "GG" monogram in gold on black

### Splash Screen
- Black background
- Gold logo centered
- Subtle gold particle or glow effect
- Tagline: "Follow the Legend" or "Depuis 1965"

### Navigation
- **Bottom tab bar** (mobile): 4-5 tabs with filled icons
- **Active state**: Gold color
- **Inactive state**: Gray (#666666)
- **Tab labels**: Short, single-word French

### Status Indicators
- **Loading**: Gold spinner on dark background
- **Success**: Green checkmark with gold accent
- **Error**: Red alert with subtle animation
- **Warning**: Amber/Yellow with icon

---

## 9. Brand Assets & Resources

### Social Media Handles

| Platform | Handle | Profile Image |
|----------|--------|---------------|
| Instagram | @goldsgymfrance_ | Bodybuilder logo |
| Facebook | @goldsgymfrance.officiel | Bodybuilder logo |
| YouTube | @goldsgymfrance | Bodybuilder logo |

### App Store Presence

| Store | App Name | Developer |
|-------|----------|-----------|
| Apple App Store | Gold's Gym France | Gold's Gym France |
| Google Play | Gold's Gym France | Gold's Gym France |

### Web Presence

| URL | Purpose |
|-----|---------|
| https://goldsgymfrance.fr | Main website |
| https://goldsgymfrance.fr/checkout-offer/ | Subscription page |
| https://golds-gym.de | Germany (reference) |
| https://goldsgym.it | Italy (reference) |

---

## 10. Visual Identity Principles

### DO's

- Use **high contrast** -- Gold on black, white on dark
- Maintain **dramatic, aspirational** imagery
- Keep the **bodybuilder logo** prominent and recognizable
- Use **bold, confident typography**
- Apply **generous spacing** for premium feel
- Include **gold accents** for highlights and CTAs
- Use **black backgrounds** for hero and impactful sections

### DON'Ts

- Don't use pastel or muted colors as primary
- Don't crowd elements -- maintain breathing room
- Don't use the logo on busy backgrounds without contrast
- Don't use playful or casual fonts for main headlines
- Don't dilute the black/gold color dominance
- Don't use generic stock fitness photography
- Don't apply heavy gradients that compete with content

---

## 11. Hex Code Quick Reference

```
Brand Colors:
  Gold's Yellow:     #FFEC00  (Primary brand color — PMS 3945 C digital equivalent)
  Gold's Gold:       #D4AF37  (Metallic accent)
  Gold's Black:      #000000  (Primary background)
  
UI Colors:
  Dark Background:   #0A0A0A  (Hero sections)
  Card Background:   #1A1A1A  (Cards, panels)
  Secondary Dark:    #333333  (Secondary bg)
  Light Background:  #F5F5F5  (Light sections)
  
Text Colors:
  Primary Text:      #FFFFFF  (On dark backgrounds)
  Secondary Text:    #B3B3B3  (Subtitles, captions)
  Muted Text:        #666666  (Disabled, placeholders)
  
Functional Colors:
  Success:           #4CAF50
  Error:             #E53935
  Warning:           #FF9800
  Info:              #2196F3
  CTA Accent:        #FF6B00
```

---

## 12. Visual Identity Insights for App Design

1. **Dark Mode First** -- Design for dark backgrounds primarily; light mode secondary
2. **Gold as Accent** -- Use gold/yellow sparingly for maximum impact (CTAs, highlights)
3. **Dramatic Photography** -- Use high-contrast, aspirational fitness imagery
4. **Bold Typography** -- Large, confident headlines; clear hierarchy
5. **Premium Spacing** -- Generous whitespace creates luxury feel
6. **Consistent Rounding** -- 8-12px for cards, 50px for buttons
7. **Smooth Motion** -- Subtle animations enhance without distracting
8. **Logo Everywhere** -- Bodybuilder icon as avatar, loading indicator, watermark

---

## Changelog

| Date | Change | Issue ID | Reason |
|------|--------|----------|--------|
| 2026-04-29 | Updated Gold's Yellow from `#FFD700` to `#FFEC00` (PMS 3945 C digital equivalent) | T1-016 | Unify brand gold color across all documents |
| 2026-04-29 | Added brand gold color source note at top of document | T1-016 | Document the provenance of the hex value |
| 2026-04-29 | Added Acumin Pro as actual website font with CSS source reference | T1-017 | Document the real website fonts alongside recommended app fonts |
| 2026-04-29 | Added note that "Common Mistakes to Avoid" rules are synthesized best practices derived from official brand guidelines and industry standards | T1-018 | Cite source for brand usage rules |
