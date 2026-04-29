# Gold's Gym - Asset Usage Guidelines

## Project: OhMyGold Team 1 - Gold's Gym Resource Base
**Version:** 1.0
**Applies to:** React Webapp + React Native Mobile App

---

## Table of Contents
1. [Logo Usage Rules](#1-logo-usage-rules)
2. [Icon Usage Rules](#2-icon-usage-rules)
3. [Image Placement Guidelines](#3-image-placement-guidelines)
4. [Responsive Image Strategy](#4-responsive-image-strategy)
5. [Dark Mode Asset Handling](#5-dark-mode-asset-handling)
6. [Performance Optimization](#6-performance-optimization)
7. [Platform-Specific Notes](#7-platform-specific-notes)

---

## 1. Logo Usage Rules

### Primary Logo: `golds-gym-logo-primary.png`

The Gold's Gym logo consists of:
- **Yellow circle background** (#FFEC00 — Gold's Gym brand yellow, PMS 3945 C digital equivalent)
- **Black silhouette** of a bodybuilder (Joe Gold)
- **"GOLD'S GYM"** text in black, arched around the circle
- **Registered trademark symbol** (R)

### Logo Clear Space
Maintain a minimum clear space around the logo equal to 1/4 of the logo's height on all sides. Never place text, graphics, or other visual elements within this clear space.

### Logo Size Guidelines

| Context | Recommended Size | File to Use |
|---|---|---|
| Mobile app header | 32-40px height | `logo-primary-small` or `@1x` |
| Desktop web header | 48-60px height | `logo-primary-medium` |
| Hero section | 120-200px height | `logo-primary-large` |
| Footer | 40-60px height | `logo-primary-medium` |
| Print materials | 2+ inches | `logo-primary-large` or `@3x` |
| Loading/spinner | 60-80px height | `logo-primary-medium` |
| Social media profile | 400x400px+ | `logo-primary-@2x` |
| App icon | Use app-icon variants | `icons/app-icon/` |
| Favicon | 16x16, 32x32 | `logos/favicon/` |

### Logo Color Variants

| Variant | File | When to Use |
|---|---|---|
| **Primary** (yellow bg, black text) | `logos/primary/golds-gym-logo-primary.png` | Default on light backgrounds |
| **Inverse** (white text) | `logos/inverse/golds-gym-logo-inverse.png` | Dark backgrounds, dark mode |
| **Monochrome Black** | `logos/monochrome/golds-gym-logo-monochrome.png` | Single-color printing, stamps |
| **Monochrome White** | `logos/monochrome/golds-gym-logo-monochrome-white.png` | Watermarks, dark overlays |

### Logo Don'ts
- [x] **DON'T** stretch or distort the logo
- [x] **DON'T** rotate the logo
- [x] **DON'T** change logo colors (except using approved variants)
- [x] **DON'T** add effects (drop shadows, glows, gradients)
- [x] **DON'T** place on busy/cluttered backgrounds
- [x] **DON'T** crop the logo
- [x] **DON'T** use the silhouette without the full logo circle
- [x] **DON'T** place primary logo on dark backgrounds (use inverse)

### Minimum Logo Size
- **Digital:** Never display smaller than 24px height
- **Print:** Never print smaller than 0.5 inch height

---

## 2. Icon Usage Rules

### App Icons

The app icon set covers all required iOS and Android sizes:

**iOS Implementation:**
```
- App Store: app-icon-app-store.png (1024x1024)
- iPhone: app-icon-ios-180.png (180x180 @3x = 60pt)
- iPad Pro: app-icon-ios-167.png (167x167 @2x = 83.5pt)
- iPad: app-icon-ios-152.png (152x152 @2x = 76pt)
- iPhone Spotlight: app-icon-ios-120.png (120x120 @3x = 40pt)
```

**Android Implementation:**
```
- Play Store: app-icon-play-store.png (512x512)
- xxxhdpi: app-icon-android-192.png (192x192)
- xxhdpi: app-icon-android-144.png (144x144) - scale from 192
- xhdpi: app-icon-android-96.png (96x96)
- hdpi: app-icon-android-72.png (72x72)
- mdpi: app-icon-android-48.png (48x48)
```

### React Native Icon Naming
```
icon-name.png      (mdpi / @1x)
icon-name@2x.png   (xhdpi / @2x)
icon-name@3x.png   (xxhdpi / @3x)
```

### Social Media Icons
The social icons (Instagram, Facebook, YouTube) are provided in brand yellow (#FFEC00).
- Use at consistent sizes across all pages (recommend 24-32px)
- Ensure minimum touch target of 44x44px on mobile
- Add appropriate `aria-label` attributes for accessibility

### UI Icons (To Be Generated)
When UI icons are created, follow these rules:
- Use consistent stroke width (recommend 1.5-2px)
- Use consistent corner radius (recommend 2px for sharp, 4px for rounded style)
- All icons should be optically balanced (same visual weight)
- Provide filled and outlined variants
- Export at 24x24px base size with @2x and @3x variants

---

## 3. Image Placement Guidelines

### Facility Photos

| Context | Recommended Photo | Notes |
|---|---|---|
| Homepage hero | `hero-gym-logo-wall-web` | Most recognizable - logo on brick wall |
| Membership page | `facility-free-weights-area` | Shows equipment quality |
| Classes page | `facility-boxing-bags-area` | Shows training variety |
| Amenities page | `facility-hydro-massage` | Premium amenity highlight |
| Women's section | `facility-women-only-area` | Inclusive messaging |
| Location finder | `facility-cardio-zone` | Shows scale of facility |

### Hero Image Rules
- Always use the web-optimized variant for desktop (1920x1080)
- Use mobile variant for screens < 768px (750x1334)
- Use thumbnail for previews/cards (400x300)
- Apply a dark gradient overlay (black 30-50% opacity) when placing text on top
- Never stretch hero images - use `object-fit: cover` (CSS) or `resizeMode: 'cover'` (RN)

### Team Photos
- Use consistent aspect ratio (recommend 3:4 or 1:1 for portraits)
- Apply consistent filters/lighting across all team member photos
- Crop to head-and-shoulders for trainer profiles

### Background Images
- `texture-diamond-plate-metal.jpg` - Use sparingly as section background
- Apply `background-blend-mode: overlay` with brand color at 10-20% opacity
- Minimum contrast ratio of 4.5:1 with overlaid text

---

## 4. Responsive Image Strategy

### Web (React/Next.js)

**Use `<picture>` element with srcset:**
```html
<picture>
  <source 
    media="(min-width: 1200px)" 
    srcset="hero-gym-logo-wall-web.webp"
    type="image/webp">
  <source 
    media="(min-width: 768px)" 
    srcset="hero-gym-logo-wall-web.jpg"
    type="image/jpeg">
  <source 
    srcset="hero-gym-logo-wall-mobile.webp"
    type="image/webp">
  <img 
    src="hero-gym-logo-wall-mobile.jpg" 
    alt="Gold's Gym facility interior with illuminated logo">
</picture>
```

**Next.js Image Component:**
```jsx
import Image from 'next/image';

<Image
  src="/images/hero/hero-gym-logo-wall-web.jpg"
  alt="Gold's Gym facility"
  width={1920}
  height={1080}
  priority={true}  // For above-the-fold images
  sizes="(max-width: 768px) 100vw, 1920px"
/>
```

### React Native

**Use proper @2x/@3x suffixes:**
```
images/hero/hero-web.png      // @1x
images/hero/hero-web@2x.png   // @2x
images/hero/hero-web@3x.png   // @3x
```

**React Native Image:**
```jsx
<Image
  source={require('./images/hero/hero-web.png')}
  style={{ width: '100%', height: 200 }}
  resizeMode="cover"
/>
```

### Breakpoint Summary

| Breakpoint | Width | Image Variant | Format |
|---|---|---|---|
| Mobile | < 768px | `-mobile` (750px wide) | WebP > JPG |
| Tablet | 768-1199px | `-web` scaled down | WebP > JPG |
| Desktop | 1200-1919px | `-web` (1920px) | WebP > JPG |
| Wide | 1920px+ | `-web` (1920px) | WebP > JPG |
| Thumbnail/Cards | Any | `-thumb` (400x300) | WebP > JPG |

---

## 5. Dark Mode Asset Handling

### Logo Handling
| Mode | Asset | Background |
|---|---|---|
| Light mode | `golds-gym-logo-primary.png` (yellow circle) | Light/white backgrounds |
| Dark mode | `golds-gym-logo-inverse.png` (white elements) | Dark/black backgrounds |

### Implementation (CSS)
```css
.logo {
  content: url('/assets/logos/primary/golds-gym-logo-primary.png');
}

@media (prefers-color-scheme: dark) {
  .logo {
    content: url('/assets/logos/inverse/golds-gym-logo-inverse.png');
  }
}
```

### Implementation (React with styled-components/emotion)
```jsx
import { useColorScheme } from 'react-native';
import logoLight from './logos/primary/golds-gym-logo-primary.png';
import logoDark from './logos/inverse/golds-gym-logo-inverse.png';

const Logo = () => {
  const colorScheme = useColorScheme();
  return <Image source={colorScheme === 'dark' ? logoDark : logoLight} />;
};
```

### Image Treatment for Dark Mode
- Apply `brightness(0.8)` CSS filter to photos in dark mode
- Use darker gradient overlays on hero images
- Social icons: keep yellow or switch to white based on theme
- Team photos: no change needed, natural skin tones

---

## 6. Performance Optimization

### File Size Targets

| Asset Type | Max Size (Web) | Max Size (Mobile) |
|---|---|---|
| Logo | 50KB | 25KB |
| Icons | 5KB each | 3KB each |
| Hero images | 200KB | 100KB |
| Facility photos | 150KB | 80KB |
| Thumbnails | 30KB | 15KB |
| Splash screen | 100KB | 50KB |

### Format Selection Priority

**Web:**
1. AVIF (if supported by build pipeline) - best compression
2. WebP (with JPG/PNG fallback)
3. JPG for photos, PNG for transparency

**React Native:**
1. PNG for logos/icons (supports transparency)
2. JPG for photos (smaller file size)
3. WebP (if targeting API 18+)

### Lazy Loading
- All below-the-fold images should be lazy-loaded
- Use `loading="lazy"` attribute on web
- Use `react-native-fast-image` for optimized image loading in RN
- Hero images and logos should be eagerly loaded (`loading="eager"` / `priority`)

### Caching Strategy
```
Logos & Icons    -> Cache: immutable (1 year)
Facility Photos  -> Cache: max-age=7 days
Hero Images      -> Cache: max-age=30 days
Splash Screens   -> Cache: immutable (1 year)
```

### Image CDN Configuration
If using a CDN (Cloudinary, Imgix, etc.):
- Enable automatic format selection (`f_auto`)
- Enable automatic quality (`q_auto`)
- Use responsive sizing (`w_auto` or `dpr_auto`)

### Preloading Critical Assets
```html
<!-- In HTML <head> for web -->
<link rel="preload" as="image" href="/assets/logos/primary/golds-gym-logo-primary.png">
<link rel="preload" as="image" href="/assets/splash/splash-web.jpg">
```

---

## 7. Platform-Specific Notes

### Web (React/Next.js)
- Use WebP with JPG fallback via `<picture>` element
- Implement responsive images with `srcset` and `sizes`
- Use `next/image` for automatic optimization
- Keep all assets in `/public/assets/` or serve from CDN

### iOS (React Native)
- App icons: Add all sizes to `Images.xcassets/AppIcon.appiconset`
- Launch screen: Use `LaunchScreen.storyboard` with `splash-ios.jpg`
- Tab bar icons: Use 25x25pt @1x, @2x, @3x (25x25, 50x50, 75x75)
- Navigation bar: Use `logo-primary-small` (max 30pt height)

### Android (React Native)
- App icons: Place in `mipmap-xxxhdpi`, `mipmap-xxhdpi`, etc.
- Adaptive icons: Provide foreground + background layers
- Splash: Use `react-native-splash-screen` with `splash-android.jpg`
- Status bar: Consider light/dark status bar with logo placement

### Asset Path Convention
```
# React Native
const assets = {
  logo: require('./assets/logos/primary/golds-gym-logo-primary.png'),
  splash: require('./assets/splash/splash-ios.jpg'),
};

# Web (import or public folder)
import logo from './assets/logos/primary/golds-gym-logo-primary.png';
// OR
<img src="/assets/logos/primary/golds-gym-logo-primary.png" />
```

---

## Quick Reference

| Need | Use This |
|---|---|
| App header logo | `logos/primary/golds-gym-logo-primary-medium.png` |
| Footer logo | `logos/primary/golds-gym-logo-primary-small.png` |
| Dark mode logo | `logos/inverse/golds-gym-logo-inverse.png` |
| Favicon | `logos/favicon/favicon-32x32.png` |
| iOS app icon | `icons/app-icon/app-icon-ios-180.png` |
| Android app icon | `icons/app-icon/app-icon-android-192.png` |
| Homepage hero | `images/hero/hero-gym-logo-wall-web.jpg` + `.webp` |
| Mobile hero | `images/hero/hero-gym-logo-wall-mobile.jpg` + `.webp` |
| Card thumbnail | `images/hero/hero-gym-logo-wall-thumb.jpg` |
| Splash screen | `splash/splash-[platform].jpg` |
| Social share | `logos/primary/golds-gym-logo-primary-@2x.png` |
| Print material | `logos/primary/golds-gym-logo-primary-large.png` |

---

## Changelog

| Date | Change | Issue ID | Reason |
|------|--------|----------|--------|
| 2026-04-29 | Updated all gold color references from #FFD700 to #FFEC00 | AS-003 | Brand color consistency |
| 2026-04-29 | Added note: logo color is #FFEC00 (PMS 3945 C digital equivalent) | AS-003 | Document canonical brand gold |
