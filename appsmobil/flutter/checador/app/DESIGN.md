---
name: Executive Precision
colors:
  surface: '#fdf7ff'
  surface-dim: '#ded8e0'
  surface-bright: '#fdf7ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f2fa'
  surface-container: '#f2ecf4'
  surface-container-high: '#ece6ee'
  surface-container-highest: '#e6e0e9'
  on-surface: '#1d1b20'
  on-surface-variant: '#494551'
  inverse-surface: '#322f35'
  inverse-on-surface: '#f5eff7'
  outline: '#7a7582'
  outline-variant: '#cbc4d2'
  surface-tint: '#6750a4'
  primary: '#4f378a'
  on-primary: '#ffffff'
  primary-container: '#6750a4'
  on-primary-container: '#e0d2ff'
  inverse-primary: '#cfbcff'
  secondary: '#63597c'
  on-secondary: '#ffffff'
  secondary-container: '#e1d4fd'
  on-secondary-container: '#645a7d'
  tertiary: '#765b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#c9a74d'
  on-tertiary-container: '#503d00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#cfbcff'
  on-primary-fixed: '#22005d'
  on-primary-fixed-variant: '#4f378a'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#cdc0e9'
  on-secondary-fixed: '#1f1635'
  on-secondary-fixed-variant: '#4b4263'
  tertiary-fixed: '#ffdf93'
  tertiary-fixed-dim: '#e7c365'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#594400'
  background: '#fdf7ff'
  on-background: '#1d1b20'
  surface-variant: '#e6e0e9'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max-width: 1440px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system is engineered for high-stakes corporate environments where clarity, authority, and efficiency are paramount. The brand personality is "Institutional Modernism"—combining the stability of traditional corporate identities with the fluid, data-driven interfaces of modern SaaS. 

The aesthetic leans into **Minimalism** with a **Corporate Modern** execution. It prioritizes high-quality typography and strategic whitespace to reduce cognitive load for executive decision-makers. Visual interest is generated through precise geometry and a "Content-First" hierarchy, ensuring that data visualization and key performance indicators remain the focal point of every view.

## Colors
This design system utilizes five distinct color themes to cater to different corporate sub-brands or functional modules. Each palette is anchored by a high-contrast Primary color used for navigation and brand presence, and a Secondary color for interactive elements and accents.

- **Surface Tones:** Backgrounds utilize very light desaturated tints of the primary hue (98-95% lightness) to maintain brand cohesion without sacrificing readability.
- **Contrast:** A strict adherence to WCAG AAA standards (7:1) for all body text is required.
- **Functional Colors:** Success (Emerald), Warning (Amber), and Error (Crimson) should be desaturated to align with the professional tone of the primary palettes.

## Typography
**Inter** is the sole typeface for this design system to ensure maximum legibility across high-density data grids and complex dashboards. 

- **Weight Strategy:** Use `SemiBold` (600) for section headings to provide a strong visual anchor. Use `Medium` (500) for UI labels to differentiate them from static body text.
- **Letter Spacing:** Headlines utilize negative tracking (-1% to -2%) to appear tighter and more "editorial," while small labels use positive tracking (+5%) to maintain legibility at small scales.
- **Scaling:** On mobile devices, Display and Headline sizes scale down by approximately 25% to avoid excessive line-wrapping in narrow viewports.

## Layout & Spacing
The design system follows a **Fixed-Fluid Hybrid Grid**. The content is housed within a 1440px max-width container, centered on the screen. 

- **Grid:** A 12-column system is used for desktop, 8-column for tablet, and 4-column for mobile.
- **Rhythm:** An 8px linear scale governs all spatial relationships. 
- **Density:** Executive interfaces should default to a "Comfortable" density (16px/24px padding), but data-heavy modules (like financial tables) may switch to a "Compact" density (8px/12px) to maximize information per screen.
- **Reflow:** On mobile, sidebars collapse into bottom-navigation bars or "hamburger" menus, and multi-column forms reflow into a single vertical stack.

## Elevation & Depth
Depth is conveyed through **Tonal Layers** rather than heavy shadows. This maintains the clean, "flat-modern" aesthetic favored in corporate software.

- **Level 0 (Base):** The primary background color.
- **Level 1 (Cards/Surface):** White or slightly off-white surfaces with a 1px border (#E0E0E0).
- **Level 2 (Interaction):** A subtle, ultra-diffused shadow (Y: 4, Blur: 12, Opacity: 0.05) is applied only when an element is hovered or active.
- **Outlines:** Use "Ghost Borders"—low-contrast (10-15% opacity) strokes—to define structure without creating visual noise.

## Shapes
The shape language is **Soft (0.25rem)**. This provides a professional, "tailored" appearance that feels modern without being overly casual or "bubbly."

- **Buttons:** 4px (0.25rem) corner radius.
- **Cards/Modals:** 8px (0.5rem) corner radius for larger containers.
- **Form Inputs:** 4px (0.25rem) to match buttons, creating a unified horizontal line across forms.

## Components
- **Buttons:** Primary buttons use the palette's `Primary` color with white text. Secondary buttons use a "Ghost" style (Primary color border and text).
- **Cards:** Used for grouping related data. Cards should have a 1px solid border with no shadow in their default state.
- **Input Fields:** Use a floating label or top-aligned label. The "Active" state is indicated by a 2px bottom border or a full-border tint in the `Secondary` color.
- **Data Tables:** Highly structured with `body-md` typography. Use zebra-striping (tinted at 2% opacity) for row readability.
- **Chips:** Used for status indicators (e.g., "Pending," "Approved"). These use a desaturated background of the status color with high-contrast text.
- **Navigation:** A persistent left-hand sidebar for desktop, utilizing the `Primary` color at 100% saturation for the background to anchor the application.