---
name: Safa Kesar
colors:
  surface: '#fcf9f5'
  surface-dim: '#dcdad6'
  surface-bright: '#fcf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ef'
  surface-container: '#f0edea'
  surface-container-high: '#ebe8e4'
  surface-container-highest: '#e5e2de'
  on-surface: '#1c1c1a'
  on-surface-variant: '#46483f'
  inverse-surface: '#31302e'
  inverse-on-surface: '#f3f0ec'
  outline: '#77786e'
  outline-variant: '#c7c7bc'
  surface-tint: '#5b614a'
  primary: '#252b18'
  on-primary: '#ffffff'
  primary-container: '#3b412c'
  on-primary-container: '#a6ad92'
  inverse-primary: '#c3caad'
  secondary: '#775a19'
  on-secondary: '#ffffff'
  secondary-container: '#fed488'
  on-secondary-container: '#785a1a'
  tertiary: '#272927'
  on-tertiary: '#ffffff'
  tertiary-container: '#3d3f3d'
  on-tertiary-container: '#a9aaa7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dfe6c8'
  primary-fixed-dim: '#c3caad'
  on-primary-fixed: '#181e0b'
  on-primary-fixed-variant: '#434934'
  secondary-fixed: '#ffdea5'
  secondary-fixed-dim: '#e9c176'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5d4201'
  tertiary-fixed: '#e2e3e0'
  tertiary-fixed-dim: '#c6c7c4'
  on-tertiary-fixed: '#1a1c1a'
  on-tertiary-fixed-variant: '#454745'
  background: '#fcf9f5'
  on-background: '#1c1c1a'
  surface-variant: '#e5e2de'
  success-green: '#4CAF50'
  error-red: '#F44336'
  kesar-deep-red: '#8B0000'
typography:
  display-lg:
    fontFamily: Epilogue
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Epilogue
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Epilogue
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Epilogue
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  caption:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The brand personality for Safa Kesar is rooted in **Heritage Minimalism**. It evokes a sense of premium quality, natural purity, and "wholesome luxury." The target audience consists of health-conscious connoisseurs who value the artisanal origins of saffron and dry fruits.

The design style is **Corporate / Modern** with a **Tactile** focus. It utilizes high-contrast typography and a grounded color palette to establish authority, while relying on high-quality product photography—specifically imagery featuring hands and natural textures—to create an emotional connection to the earth and the harvester. 

The UI should feel clean, spacious, and trustworthy, avoiding excessive decoration to let the vibrant colors of the products (like the deep red of Kesar) be the focus.

## Colors

The palette is anchored by **Forest Green**, representing the natural, grounded origins of the product. **Warm Gold** is used sparingly for accents, badges (like "Premium Quality"), and specific call-to-action highlights to denote the "Gold Standard" of Safa Kesar.

- **Primary:** Forest Green (#3B412C) for typography, primary buttons, and navigation.
- **Secondary:** Warm Gold (#C5A059) for highlighting value, premium tiers, and active states.
- **Neutral:** A range of clean whites and the Tertiary Light Gray (#F4F4F1) for section backgrounds to maintain a fresh, airy feel.
- **Named Colors:** Used for functional feedback (validation) and a signature "Kesar Red" for specific product markers.

## Typography

This design system pairs the distinctive, geometric **Epilogue** for headings with the sharp, professional **Hanken Grotesk** for body and functional text. 

- **Headlines:** Use Epilogue with tight letter-spacing to create a bold, editorial look for banners and product categories.
- **Body:** Hanken Grotesk provides a modern, neutral canvas for nutritional information and product descriptions.
- **Hierarchy:** Maintain clear distinction between product titles (Headline MD) and pricing/labels (Label MD).

## Layout & Spacing

The design system utilizes a **Fixed Grid** model for desktop to maintain a premium "boutique" feel, while transitioning to a fluid layout for mobile devices.

- **Grid:** A 12-column grid on desktop with 24px gutters. Elements typically span 3 columns for product cards (4 per row) or 6 columns for editorial content.
- **Vertical Rhythm:** Spacing is managed in multiples of 8px. Use `stack-lg` to separate major sections and `stack-sm` for internal component elements like labels and inputs.
- **Mobile Adaptivity:** At the 768px breakpoint, margins shrink to 16px and product grids reflow to a 2-column layout. Horizontal scrolling carousels are preferred for category browsing on mobile to save vertical space.

## Elevation & Depth

Visual hierarchy is established primarily through **Tonal Layers** and **Low-contrast outlines**.

- **Surfaces:** Use subtle background shifts (Tertiary color) to define sections like the footer or product carousels.
- **Outlines:** Instead of heavy shadows, use 1px borders in Light Gray (#D1D1D1) or Forest Green (at 10% opacity) to define cards and inputs.
- **Elevated States:** For modals or active dropdowns, use an **Ambient Shadow** that is highly diffused (20px blur, 5% opacity) with a slight Forest Green tint to maintain a soft, natural feel.

## Shapes

The shape language is **Soft** and intentional. A slight corner radius (0.25rem/4px) is applied to most UI elements to move away from the harshness of sharp corners while remaining more professional than fully rounded designs.

- **Buttons & Inputs:** Use the base 4px radius.
- **Product Cards:** Use `rounded-lg` (8px) to soften the large grid containers.
- **Category Tags/Chips:** May use the pill-shape style to differentiate them from functional buttons.

## Components

- **Buttons:** Primary buttons are Forest Green with white text, utilizing a bold weight from Hanken Grotesk. Secondary buttons use a Forest Green outline or clear background with a Gold accent.
- **Chips:** Used for "Best Seller" or "Organic" tags. Use the Warm Gold background with dark primary text for high-value tags, and light gray for standard categories.
- **Input Fields:** Minimalist style with a 1px bottom border or soft-rounded outline. Use the Forest Green for the focus state and Success/Error colors for validation.
- **Cards:** Product cards must prioritize the image. Text is bottom-aligned with the title in Epilogue and price in Hanken Grotesk.
- **Navigation:** A clean white header with a centered "Safa Kesar" logo. Search and User icons should be thin-stroke Forest Green icons.
- **BMI/Health Widget:** Retain the functional "Nutripanel" logic from the reference but style the gauge with the brand's sophisticated color transitions rather than bright rainbow tones.