---
name: Corporate Integrity System
colors:
  surface: '#f9f9ff'
  surface-dim: '#cadaff'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e8edff'
  surface-container-high: '#e0e8ff'
  surface-container-highest: '#d7e2ff'
  on-surface: '#041b3c'
  on-surface-variant: '#434654'
  inverse-surface: '#1d3052'
  inverse-on-surface: '#edf0ff'
  outline: '#737685'
  outline-variant: '#c3c6d6'
  surface-tint: '#0c56d0'
  primary: '#003d9b'
  on-primary: '#ffffff'
  primary-container: '#0052cc'
  on-primary-container: '#c4d2ff'
  inverse-primary: '#b2c5ff'
  secondary: '#285ab9'
  on-secondary: '#ffffff'
  secondary-container: '#709bfe'
  on-secondary-container: '#003179'
  tertiary: '#004b59'
  on-tertiary: '#ffffff'
  tertiary-container: '#006477'
  on-tertiary-container: '#76e2ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b2c5ff'
  on-primary-fixed: '#001848'
  on-primary-fixed-variant: '#0040a2'
  secondary-fixed: '#d9e2ff'
  secondary-fixed-dim: '#b1c6ff'
  on-secondary-fixed: '#001946'
  on-secondary-fixed-variant: '#00419d'
  tertiary-fixed: '#afecff'
  tertiary-fixed-dim: '#48d7f9'
  on-tertiary-fixed: '#001f27'
  on-tertiary-fixed-variant: '#004e5d'
  background: '#f9f9ff'
  on-background: '#041b3c'
  surface-variant: '#d7e2ff'
typography:
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Hanken Grotesk
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
  label-bold:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  margin-mobile: 16px
  margin-desktop: 32px
  gutter: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style

The design system is engineered for corporate reliability and operational efficiency. It targets a professional workforce, prioritizing clarity, security, and a "zero-friction" user experience for daily attendance and committee management.

The aesthetic follows a **Modern Corporate** approach with a focus on **High-Contrast** accessibility. It utilizes a structured hierarchy, ample white space, and a refined professional finish to evoke feelings of institutional trust and systemic precision. Every interface element is designed to minimize cognitive load, ensuring that administrative tasks feel secure and authoritative.

## Colors

The palette is anchored by a deep "Trustworthy Blue" which serves as the primary driver for actions and brand presence. 

- **Primary (#0052CC):** Used for primary buttons, active states, and critical navigation.
- **Secondary (#0747A6):** A deeper blue for hovered states or secondary headers to maintain a sober tone.
- **Tertiary (#00B8D9):** A bright teal for informational accents and "success" indicators related to attendance.
- **Neutral (#172B4D):** A rich charcoal for high-contrast typography and iconography, ensuring maximum readability.
- **Backgrounds:** Utilize a crisp white (#FFFFFF) for surfaces with subtle light gray (#F4F5F7) for structural grouping.

## Typography

The typography system pairs **Hanken Grotesk** for headlines with **Inter** for body and functional text. Hanken Grotesk provides a sharp, contemporary corporate look, while Inter is utilized for its exceptional legibility in data-dense mobile environments.

For committee lists and attendance logs, use `body-md` for standard entries and `label-bold` for status indicators (e.g., "PRESENT", "ABSENT"). Large mobile headlines are reserved for dashboard summaries and module titles.

## Layout & Spacing

This design system employs a **Fluid Grid** model optimized for mobile-first workflows. It relies on an 8px base grid to ensure consistent alignment and rhythmic vertical stacking.

- **Mobile:** 4-column layout with 16px side margins.
- **Tablet/Desktop:** 12-column layout with 32px side margins and a max-width container of 1200px.
- **Density:** High-density spacing is used for data tables and logs, while generous "Stack" spacing (24px+) is used to separate distinct functional modules like "Clock In" and "Recent Activity."

## Elevation & Depth

To maintain a secure and professional feel, the design system avoids heavy shadows. Instead, it uses **Tonal Layers** and **Low-Contrast Outlines**.

- **Surface Tiers:** The main background is pure white. Secondary containers (like cards for committee meetings) use a subtle #F4F5F7 background with a 1px border (#DFE1E6).
- **Interactive Elevation:** Only primary action buttons receive a subtle, focused shadow (4px blur, 10% opacity, Neutral color) to indicate "pressability" without compromising the clean, flat aesthetic.
- **Separation:** Depth is primarily communicated through color contrast and dividers rather than physical height.

## Shapes

The shape language is **Soft (Level 1)**, reflecting a professional and structured environment. 

- **Standard Elements:** Buttons and input fields use a 4px (0.25rem) radius.
- **Containers:** Large cards or modal sheets use an 8px (0.5rem) radius to feel modern but grounded.
- **Icons:** Use 24px bounding boxes with a "2pt" stroke weight, featuring slightly rounded joins to match the UI's geometry.

## Components

### Buttons
- **Primary:** Solid #0052CC background with white text. High-contrast, sharp 4px corners.
- **Secondary:** Transparent background with #0052CC 1px border and text.
- **Action Size:** Minimum 48px height for mobile accessibility.

### Cards & Lists
- **Attendance Card:** White background, 1px border (#DFE1E6), no shadow. Left-accent border (4px width) in Primary Blue to indicate active items.
- **Lists:** Clean row-based layout with 1px bottom dividers.

### Input Fields
- **States:** Focused states must use a 2px #0052CC border. Labels are always visible above the field using `label-bold`.
- **Validation:** Use #DE350B (Red) for errors and #36B37E (Green) for verified attendance markers.

### Specialized Components
- **Attendance Toggle:** Large, high-contrast switch for "Clock In/Out" with clear haptic feedback cues.
- **Status Chips:** Small, rounded-pill badges for committee roles (e.g., "Chair", "Member") using light tinted backgrounds of the primary color.
- **Data Tables:** Used for attendance history, featuring sticky headers and high-contrast row zebra-striping (#F4F5F7).