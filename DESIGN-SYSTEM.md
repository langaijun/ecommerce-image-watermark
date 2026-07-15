# E-Commerce Image Watermark Design System

> A professional, trustworthy design language for e-commerce sellers — calm confidence with subtle purple-blue gradients.

**Tech stack**: Next.js 14 + React 18 + Tailwind CSS v3  
**UI library**: Custom components + Lucide icons  
**Theme**: Dark + Light mode via `next-themes`

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Border Radius](#5-border-radius)
6. [Shadows & Depth](#6-shadows--depth)
7. [Component Patterns](#7-component-patterns)
8. [Animation & Transitions](#8-animation--transitions)
9. [Responsive Design](#9-responsive-design)
10. [Icons](#10-icons)
11. [Accessibility](#11-accessibility)
12. [CSS Architecture](#12-css-architecture)

---

## 1. Design Philosophy

| Principle | Description |
|-----------|-------------|
| **Professional confidence** | Clean, structured layout that signals reliability. E-commerce sellers need to trust the tool with their product images. |
| **Glass panels over shadows** | Depth comes from `panel-glass` (backdrop-blur + semi-transparent bg), not heavy box-shadows. |
| **`rounded-xl` everywhere** | 12px border-radius is the universal container shape — cards, panels, buttons, inputs. `rounded-2xl` for major sections. |
| **Subtle gradients** | Gradient accents on logo, buttons, and progress bars — never on large surfaces. Adds warmth without distraction. |
| **Purple-blue primary** | HSL 245° base — conveys creativity + technology. Distinct from the sea of blue SaaS tools. |
| **Dark + Light parity** | Every component must look polished in both modes. Dark mode uses deeper purples, not pure black. |
| **Privacy-first signals** | The shield icon and privacy banner are prominent — users need constant reassurance that images stay local. |

---

## 2. Color System

### 2.1 Primary Palette (Purple-Blue)

| Role | Light Mode | Dark Mode | Usage |
|------|-----------|-----------|-------|
| **Primary** | `hsl(245, 58%, 51%)` | `hsl(250, 72%, 65%)` | Buttons, active tabs, focus rings, links |
| **Primary Foreground** | `#FFFFFF` | `#FFFFFF` | Text on primary backgrounds |
| **Primary (hover)** | Slightly lighter | Slightly lighter | Button hover states |

### 2.2 Neutral Palette

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `background` | `hsl(220, 20%, 97%)` | `hsl(230, 25%, 7%)` | Page background |
| `foreground` | `hsl(230, 25%, 10%)` | `hsl(220, 20%, 95%)` | Primary text, headings |
| `card` | `#FFFFFF` | `hsl(230, 22%, 10%)` | Card/panel backgrounds |
| `muted` | `hsl(240, 15%, 94%)` | `hsl(230, 18%, 16%)` | Subtle backgrounds, inactive tabs |
| `muted-foreground` | `hsl(230, 10%, 46%)` | `hsl(220, 12%, 60%)` | Secondary text, labels |
| `border` | `hsl(240, 15%, 90%)` | `hsl(230, 18%, 18%)` | Default border for all containers |
| `input` | Same as border | Same as border | Input field borders |
| `ring` | `hsl(245, 58%, 51%)` | `hsl(250, 72%, 65%)` | Focus rings |

### 2.3 Accent & Semantic Colors

| Role | Light Mode | Dark Mode | Usage |
|------|-----------|-----------|-------|
| `accent` | `hsl(260, 40%, 95%)` | `hsl(260, 30%, 18%)` | Highlighted panels, secondary buttons |
| `accent-foreground` | `hsl(245, 58%, 40%)` | `hsl(250, 72%, 75%)` | Text on accent backgrounds |
| `destructive` | `hsl(0, 72%, 51%)` | `hsl(0, 62%, 45%)` | Error states, delete actions |
| `success` | `#059669` (emerald-600) | `#34D399` (emerald-400) | Success states, download button |
| `warning` | `#D97706` (amber-600) | `#FBBF24` (amber-400) | Platform watermark warnings |

### 2.4 Background Gradients

Subtle radial gradients on the page body for visual warmth:

```css
/* Light mode */
background-image:
  radial-gradient(at 20% 0%, hsl(245 58% 51% / 0.04) 0px, transparent 50%),
  radial-gradient(at 80% 100%, hsl(260 50% 55% / 0.04) 0px, transparent 50%);

/* Dark mode */
background-image:
  radial-gradient(at 20% 0%, hsl(250 72% 65% / 0.06) 0px, transparent 50%),
  radial-gradient(at 80% 100%, hsl(280 50% 50% / 0.05) 0px, transparent 50%);
```

### 2.5 Color Usage Rules

| Rule | Guideline |
|------|-----------|
| **Backgrounds** | `bg-card` for panels. `bg-muted` for subtle differentiation. Never use raw `bg-white` — use CSS variables. |
| **Borders** | `border-border` for containers. `border-border/60` for lighter dividers. `border-primary/30` for active/selected states. |
| **Active states** | `bg-primary/10` + `border-primary/30` + `text-primary` — triple signal for selected items. |
| **Warnings** | `bg-destructive/10` + `border-destructive/20` + `text-destructive` — consistent error/warning pattern. |
| **Text hierarchy** | `text-foreground` → `text-muted-foreground` → `text-muted-foreground/60` for primary → secondary → tertiary. |
| **Gradients** | Logo only (`from-primary to-purple-500`). Buttons use `bg-primary` solid, not gradient. |

### 2.6 CSS Variables

```css
:root {
  --background: 220 20% 97%;
  --foreground: 230 25% 10%;
  --card: 0 0% 100%;
  --card-foreground: 230 25% 10%;
  --primary: 245 58% 51%;
  --primary-foreground: 0 0% 100%;
  --secondary: 240 20% 95%;
  --muted: 240 15% 94%;
  --muted-foreground: 230 10% 46%;
  --accent: 260 40% 95%;
  --destructive: 0 72% 51%;
  --border: 240 15% 90%;
  --ring: 245 58% 51%;
  --radius: 0.625rem;
}
```

---

## 3. Typography

### 3.1 Font Stack

System font stack via Tailwind's default `font-sans`. No custom font loading — performance first.

Fallback: `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans SC", sans-serif`

### 3.2 Type Scale

| Size | Tailwind | Px | Usage |
|------|----------|-----|-------|
| Micro | `text-[10px]` | 10 | Image dimensions overlay, micro-copy |
| Tiny | `text-[11px]` | 11 | Hints, subtle labels |
| Small | `text-xs` | 12 | Form labels, card subtitles, panel sub-labels, pills |
| **Body** | **`text-sm`** | **14** | **Primary body**, buttons, inputs, panel titles |
| Base | `text-base` | 16 | Logo text, section headings |
| Large | `text-lg` | 18 | Page title (reserved) |

### 3.3 Font Weights

| Weight | Tailwind | Usage |
|--------|----------|-------|
| 400 (regular) | default | Body text, inputs, descriptions |
| 500 (medium) | `font-medium` | Labels, buttons, panel sub-titles |
| 600 (semibold) | `font-semibold` | Panel titles, section headings, important labels |
| 700 (bold) | `font-bold` | Logo text only |

### 3.4 Heading Hierarchy

```tsx
// Logo / Brand
<h1 className="text-base font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">

// Panel title (with icon)
<label className="text-sm font-semibold">水印设置</label>

// Sub-label
<label className="text-xs text-muted-foreground font-medium">字号: 48px</label>

// Hint text
<p className="text-[11px] text-muted-foreground">点击缩略图可预览水印效果</p>
```

---

## 4. Spacing & Layout

### 4.1 Page Layout

Three-column layout on desktop, stacked on mobile:

```tsx
<div className="container mx-auto px-4 py-4">
  <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-10rem)]">
    <div className="lg:w-1/4">{/* Upload */}</div>
    <div className="lg:w-1/2">{/* Canvas Preview */}</div>
    <div className="lg:w-1/4">{/* Controls + Export */}</div>
  </div>
</div>
```

| Context | Value | Tailwind |
|---------|-------|----------|
| Page horizontal padding | 16px | `px-4` |
| Page vertical padding | 16px | `py-4` |
| Column gap | 16px | `gap-4` |
| Panel gap (right column) | 16px | `gap-4` |

### 4.2 Panel Spacing

| Context | Value | Tailwind |
|---------|-------|----------|
| Panel padding | 12px | `p-3` |
| Inner section gap | 16–20px | `space-y-4` / `space-y-5` |
| Between form fields | 12px | `space-y-3` |
| Border-top separator | — | `border-t pt-3` |

### 4.3 Grid Layouts

| Context | Pattern |
|---------|---------|
| Image thumbnails | `grid grid-cols-3 sm:grid-cols-4 gap-2.5` |
| Platform selector | `grid grid-cols-2 gap-1.5` |
| Position grid (3×3) | `grid grid-cols-3 gap-1` |
| Font + Color row | `grid grid-cols-2 gap-3` |

---

## 5. Border Radius

Three-tier system:

| Radius | Tailwind | Px | Usage |
|--------|----------|-----|-------|
| **Large** | **`rounded-xl`** | **12** | **Dominant**: all panels, cards, inputs, selects, color pickers |
| **XL** | `rounded-2xl` | 16 | FAQ items, major section containers, privacy banner |
| Full | `rounded-full` | 9999 | Pill tabs, circular buttons, range slider thumbs, badges |

Additional:
- `rounded-lg` (8px) — inner content cards (stroke/shadow panels), image thumbnails
- `rounded-md` (6px) — compact buttons, format toggle buttons

**Rule**: When in doubt, use `rounded-xl`.

---

## 6. Shadows & Depth

### 6.1 Glass Effect (Primary Depth Pattern)

```css
.panel-glass {
  @apply bg-card/80 backdrop-blur-sm border border-border/60 shadow-sm;
}
.dark .panel-glass {
  @apply bg-card/60;
}
```

All main panels use `panel-glass` class — semi-transparent background + backdrop blur + subtle border + minimal shadow.

### 6.2 Shadow Scale

| Shadow | Tailwind | Usage |
|--------|----------|-------|
| Small | `shadow-sm` | Active pill tabs, primary buttons |
| Subtle primary | `shadow-primary/20` | Active tab glow, selected platform button |
| None | — | Most containers (border provides depth) |

**Never used**: `shadow-md`, `shadow-lg`, `shadow-xl`. Depth comes from borders and glass effects.

### 6.3 Elevation Hierarchy

```
Level 0: bg-background             → page body
Level 1: panel-glass (bg-card/80)  → main panels
Level 2: bg-muted/40               → nested groups (stroke/shadow cards)
Level 3: bg-primary/10             → active/selected items
```

---

## 7. Component Patterns

### 7.1 Pill Tabs (Watermark Type Selector)

```tsx
<div className="flex gap-1 p-1 bg-muted/80 rounded-full">
  <button className={`flex-1 flex items-center justify-center gap-1.5 rounded-full py-2 text-xs font-medium
    transition-all duration-200 ${
      active
        ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
        : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
    }`}>
    <Icon className="h-3.5 w-3.5" />
    {label}
  </button>
</div>
```

### 7.2 Platform Selector (Card Grid)

```tsx
<div className="grid grid-cols-2 gap-1.5">
  <button className={`px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 border
    flex items-center gap-1.5 ${
      selected
        ? 'bg-primary/10 border-primary/30 text-primary'
        : 'bg-background border-border/50 text-muted-foreground hover:border-primary/20 hover:text-foreground'
    }`}>
    <span>{icon}</span>
    <span className="truncate">{name}</span>
  </button>
</div>
```

### 7.3 Form Inputs

```tsx
// Text input
<input className="w-full rounded-lg border bg-background px-3 py-2 text-sm
  focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />

// Select
<select className="w-full rounded-lg border bg-background px-2 py-2 text-sm
  focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />

// Color picker
<input type="color" className="h-9 w-9 rounded-lg cursor-pointer border-2 border-border/50 shadow-sm" />

// Range slider (custom CSS in globals.css)
<input type="range" className="w-full" />
```

**Custom range slider styling**:
```css
input[type="range"] {
  @apply h-1.5 rounded-full appearance-none bg-muted cursor-pointer;
}
input[type="range"]::-webkit-slider-thumb {
  @apply appearance-none w-4 h-4 rounded-full bg-primary shadow-md border-2 border-white cursor-pointer;
  box-shadow: 0 1px 4px hsl(245 58% 51% / 0.3);
}
```

### 7.4 Image Upload Zone

```tsx
<div className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer
  transition-all duration-300 overflow-hidden ${
    isDragActive
      ? 'border-primary bg-primary/10 scale-[1.02]'
      : 'border-border/70 hover:border-primary/50 hover:bg-primary/[0.03]'
  }`}>
  <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-accent/[0.04] pointer-events-none" />
  {/* Icon container */}
  <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-primary/10">
    <Upload className="h-5 w-5 text-primary/70" />
  </div>
</div>
```

### 7.5 Image Thumbnail

```tsx
<div className={`relative group aspect-square rounded-lg overflow-hidden cursor-pointer border-2
  transition-all duration-200 ${
    selected
      ? 'border-primary ring-2 ring-primary/20 scale-[1.02]'
      : 'border-transparent hover:border-primary/30 hover:scale-[1.02]'
  }`}>
  <img className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
  {/* Hover overlay with dimensions */}
  <div className="w-full p-1.5 bg-gradient-to-t from-black/70 to-transparent text-white text-[10px]
    opacity-0 group-hover:opacity-100 transition-opacity duration-200">
    {width}×{height}
  </div>
  {/* Delete button */}
  <button className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 backdrop-blur-sm
    text-white opacity-0 group-hover:opacity-100 hover:bg-destructive hover:scale-110">
    <X className="h-3 w-3" />
  </button>
</div>
```

### 7.6 Process & Download Buttons

```tsx
// Process button (gradient)
<button className="w-full py-2.5 rounded-lg bg-gradient-to-r from-primary to-purple-600
  text-primary-foreground font-medium text-sm hover:shadow-lg hover:shadow-primary/25
  disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
  开始处理 ({count} images)
</button>

// Download button (green gradient)
<button className="w-full py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600
  text-white font-medium text-sm hover:shadow-lg hover:shadow-emerald-500/25
  transition-all duration-200 flex items-center justify-center gap-2">
  <Download className="h-4 w-4" />
  下载 ZIP
</button>
```

### 7.7 Progress Bar

```tsx
<div className="w-full bg-muted rounded-full h-2 overflow-hidden">
  <div className="bg-gradient-to-r from-primary to-purple-500 h-2 rounded-full
    transition-all duration-300 ease-out" style={{ width: `${percent}%` }} />
</div>
```

### 7.8 Privacy Banner

```tsx
<div className="bg-gradient-to-r from-primary/[0.06] to-accent/[0.06] border border-primary/15
  rounded-xl px-4 py-2.5 flex items-center gap-3 text-sm">
  <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 flex-shrink-0">
    <ShieldCheck className="h-4 w-4 text-primary" />
  </div>
  <span className="text-foreground/80 font-medium">{message}</span>
</div>
```

### 7.9 Header / Navigation

```tsx
<header className="sticky top-0 z-50 border-b border-border/60 bg-background/80
  backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
  <div className="container mx-auto flex h-14 items-center justify-between px-4">
    {/* Logo with gradient glow */}
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-500 rounded-lg blur-md opacity-40" />
      <div className="relative flex items-center justify-center w-9 h-9 rounded-lg
        bg-gradient-to-br from-primary to-purple-500 shadow-sm">
        <Droplets className="h-5 w-5 text-white" />
      </div>
    </div>
  </div>
</header>
```

### 7.10 Nested Group Card (Stroke/Shadow Panels)

```tsx
<div className="space-y-2 p-3 rounded-lg bg-muted/40">
  <label className="flex items-center gap-2 text-xs font-medium">
    <input type="checkbox" className="rounded accent-primary" />
    描边
  </label>
  {/* Nested controls */}
</div>
```

### 7.11 FAQ Accordion

```tsx
<details className="group rounded-2xl border border-border bg-card p-5">
  <summary className="flex cursor-pointer list-none items-center justify-between gap-3
    [&::-webkit-details-marker]:hidden">
    <span className="text-sm font-semibold text-foreground">{question}</span>
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full
      bg-muted text-muted-foreground transition-transform duration-200 group-open:rotate-45">+</span>
  </summary>
  <div className="mt-3 text-sm leading-relaxed text-muted-foreground">{answer}</div>
</details>
```

### 7.12 Warning Banner

```tsx
<div className="flex items-start gap-2 text-xs bg-destructive/10 border border-destructive/20
  rounded-lg p-2.5 text-destructive">
  <AlertTriangle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
  <span>{warningMessage}</span>
</div>
```

---

## 8. Animation & Transitions

### 8.1 Global Transitions

```css
button, a, input, select, textarea {
  @apply transition-all duration-200 ease-in-out;
}
```

All interactive elements have a default 200ms ease-in-out transition.

### 8.2 Transition Patterns

| Pattern | Duration | Usage |
|---------|----------|-------|
| `transition-all duration-200` | 200ms | Default for all interactive elements |
| `transition-colors` | 150ms | Color-only changes |
| `transition-transform duration-300` | 300ms | Thumbnail hover scale, tab switches |
| `transition-opacity duration-200` | 200ms | Overlay fade-in (image dimensions) |
| `transition-all duration-300` | 300ms | Upload zone drag state, scale effects |

### 8.3 Hover Effects

| Element | Effect |
|---------|--------|
| Image thumbnail | `group-hover:scale-105` + `group-hover:opacity-100` overlay |
| Selected thumbnail | `scale-[1.02]` + `ring-2 ring-primary/20` |
| Upload zone (drag) | `scale-[1.02]` + `border-primary` + `bg-primary/10` |
| Platform button | `hover:border-primary/20` + `hover:text-foreground` |
| Position grid cell | `hover:bg-muted/80` |
| Delete button | `hover:bg-destructive` + `hover:scale-110` |

---

## 9. Responsive Design

### 9.1 Breakpoints

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Default (mobile) | < 1024px | Stacked single column |
| `lg` | ≥ 1024px | Three-column layout (1:2:1 ratio) |

### 9.2 Responsive Patterns

```tsx
// Three-column layout
className="flex flex-col lg:flex-row gap-4"

// Column widths
className="lg:w-1/4"  // Upload & Controls
className="lg:w-1/2"  // Canvas Preview

// Right column split
className="lg:max-h-[40%]"  // Export panel max height

// Thumbnail grid
className="grid grid-cols-3 sm:grid-cols-4 gap-2.5"
```

### 9.3 Mobile Considerations

- Logo text hides on small screens: `hidden sm:block` / `sm:hidden`
- Panels stack vertically with full width
- Export panel uses `lg:max-h-[40%]` to prevent overflow on desktop
- All panels use `overflow-y-auto` for scrollable content

---

## 10. Icons

### 10.1 Strategy: Lucide React

All icons from `lucide-react`. Consistent stroke width (2px), rounded caps.

### 10.2 Icon Usage Map

| Icon | Size | Context |
|------|------|---------|
| `Droplets` | `h-5 w-5` (in 36px container) | Logo |
| `Type` | `h-3.5 w-3.5` | Text watermark tab |
| `Image` | `h-3.5 w-3.5` | Image watermark tab |
| `Grid3x3` | `h-3.5 w-3.5` | Tiled watermark tab |
| `Upload` | `h-5 w-5` | Upload zone icon |
| `X` | `h-3 w-3` | Delete buttons |
| `ShieldCheck` | `h-4 w-4` | Privacy banner |
| `Sun` / `Moon` | `h-4 w-4` | Theme toggle |
| `Globe` | `h-4 w-4` | Language switcher |
| `Download` | `h-4 w-4` | Download button |
| `Loader2` | `h-4 w-4` | Processing spinner (`animate-spin`) |
| `CheckCircle2` | `h-4 w-4` | Success result |
| `XCircle` | `h-4 w-4` | Failed result |
| `AlertTriangle` | `h-3.5 w-3.5` | Platform watermark warning |
| `MapPin` | `h-3 w-3` | Position section icon |
| `RotateCcw` | `h-3 w-3` | Transform section icon |

---

## 11. Accessibility

### 11.1 Color Contrast

| Combination | Light Mode | Dark Mode |
|-------------|-----------|-----------|
| `foreground` on `background` | ≥ 7:1 (AAA) | ≥ 7:1 (AAA) |
| `muted-foreground` on `card` | ≥ 4.5:1 (AA) | ≥ 4.5:1 (AA) |
| `primary-foreground` on `primary` | ≥ 4.5:1 (AA) | ≥ 4.5:1 (AA) |

### 11.2 Focus States

All inputs use a consistent focus pattern:
```css
focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none
```

### 11.3 Interactive Elements

- All clickable items use `<button>` or `<a>` (natively focusable)
- Checkbox inputs use `accent-primary` for native styling
- Range sliders have custom thumb with visible focus indicator
- `<details>`/`<summary>` for FAQ (natively keyboard-accessible)

### 11.4 Screen Reader

- Logo icon: `aria-hidden="true"` (decorative)
- Theme toggle: `<span className="sr-only">主题</span>`
- Error messages: visible text, no separate ARIA needed

---

## 12. CSS Architecture

### 12.1 Tailwind CSS v3 + CSS Variables

Configuration via `tailwind.config.ts` with HSL CSS variables:

```ts
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      border: 'hsl(var(--border))',
      primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
      muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
      // ...
    },
  },
}
```

### 12.2 Custom Utility Classes

| Class | Definition | Usage |
|-------|-----------|-------|
| `.panel-glass` | `bg-card/80 backdrop-blur-sm border border-border/60 shadow-sm` | All main panels |
| `.dark .panel-glass` | `bg-card/60` | Dark mode variant |

### 12.3 Color Application Pattern

Most colors use Tailwind CSS variable syntax:
```tsx
className="bg-primary text-primary-foreground border-border"
```

Opacity modifiers for subtle effects:
```tsx
className="bg-primary/10 border-primary/30 ring-primary/20"
```

Gradient accents (logo + buttons only):
```tsx
className="bg-gradient-to-r from-primary to-purple-500"
```

### 12.4 Dark Mode

Activated via `class` strategy (`next-themes`). Every CSS variable has a `.dark` variant:

```css
.dark {
  --background: 230 25% 7%;
  --primary: 250 72% 65%;
  /* deeper, more saturated colors for dark backgrounds */
}
```
