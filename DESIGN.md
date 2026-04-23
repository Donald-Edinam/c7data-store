Source: https://raw.githubusercontent.com/Donald-Edinam/weft/master/systems/e-commerce-minimal/DESIGN.md

---

> The product is the hero. The interface is the stage. Every pixel exists to move the customer closer to purchase.

---

**Product type:** Online storefronts, product pages, checkout flows, brand-direct commerce
**Target audience:** Consumers shopping online. Broad age range (18-55). Mix of browse-and-buy and intent-driven shoppers. Mobile-heavy (65%+ traffic from phones).
**Design philosophy:** Inspired by Everlane, Aesop, and Apple Store. Product photography dominates. The UI is minimal to the point of disappearing — no visual element competes with the product. Conversion comes from clarity, not urgency tactics.
**Personality keywords:** Clean, product-forward, premium, effortless, trustworthy
**Reference products:** Everlane, Aesop.com, Apple Store, SSENSE, Mejuri

- **Headlines:** Product-focused, sensory. "Cotton Canvas Tote" not "Shop Our Amazing New Bag Collection!"
- **Body text:** Short, descriptive, benefit-oriented. Materials, dimensions, care instructions.
- **Microcopy:** Confident and helpful. "Added to bag" not "Great choice! 🎉"
- **Pricing:** Clear and upfront. No hidden costs until checkout.

---

### Primary
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | #1A1A1A | Primary buttons, text, emphasis |
| `--color-primary-hover` | #333333 | Hover state |

### Neutrals
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-bg` | #FFFFFF | Page background — pure white |
| `--color-bg-warm` | #F8F7F4 | Alternate section bg, footer bg |
| `--color-surface` | #FFFFFF | Product cards, modals |
| `--color-border` | #E8E8E8 | Borders, dividers, input outlines |
| `--color-border-light` | #F0F0F0 | Subtle separators |
| `--color-text-primary` | #1A1A1A | Product names, prices, headings |
| `--color-text-secondary` | #666666 | Descriptions, secondary info |
| `--color-text-muted` | #999999 | Help text, metadata |

### Semantic
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-success` | #2E7D32 | Added to cart confirmation, in-stock indicator |
| `--color-error` | #C62828 | Out of stock, form errors, removal |
| `--color-sale` | #C62828 | Sale prices (same red as error — urgency) |
| `--color-warning` | #E65100 | Low stock ("Only 3 left") |

### Color Rules
- The palette is nearly monochrome. Black, white, warm gray. Product photography provides color.
- Sale red is the only color that "pops" — reserved for discounted prices and sale badges.
- No colored category labels or tag backgrounds. Use text weight and size for hierarchy.
- Backgrounds alternate between pure white (#FFFFFF) and warm off-white (#F8F7F4).
- Product page backgrounds are always white — nothing competes with the product.

---

### Font Stack
- **Headings:** "Satoshi", "DM Sans", -apple-system, sans-serif
- **Body:** Same as headings — one font family for the entire site
- **Monospace:** "JetBrains Mono", monospace — for order numbers, SKUs

### Type Scale
| Level | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| Display | 40px | 500 | 1.15 | -0.5px | Hero headlines |
| H1 | 28px | 500 | 1.20 | -0.3px | Product names on detail page |
| H2 | 22px | 500 | 1.25 | -0.2px | Section headings |
| H3 | 16px | 500 | 1.35 | 0px | Card titles, cart items |
| Price-lg | 24px | 600 | 1.20 | 0px | Product detail page price |
| Price-md | 16px | 500 | 1.30 | 0px | Product card price |
| Body | 15px | 400 | 1.65 | 0px | Descriptions, product details |
| Small | 13px | 400 | 1.50 | 0px | Help text, care instructions |
| Caption | 11px | 500 | 1.40 | 1px | Badges, labels (uppercase) |

### Typography Rules
- Font weight 500 (medium) is the primary weight — 400 for body, 600 for prices. Never 700.
- Product names are always sentence case. Never ALL CAPS for product names.
- Prices: no decimal if .00 ($45 not $45.00) unless cents exist ($45.50).
- Sale prices: original in --color-text-muted with line-through, sale price in --color-sale.
- Free shipping labels: 11px uppercase badge, not a banner.

---

### Buttons
**Primary (Add to Bag)**
```
Background: var(--color-primary) → #1A1A1A
Text: #FFFFFF
Padding: 16px 32px
Border-radius: 0px (sharp — premium feel)
Font: 14px/500, uppercase, letter-spacing 1px
Width: 100% on product pages
Height: 52px
Hover: bg #333333
Active: bg #000000
Disabled (out of stock): bg #E8E8E8, text #999999, cursor not-allowed
Focus-visible: 2px solid #1A1A1A, 2px offset
```

**Secondary**
```
Background: transparent
Border: 1px solid var(--color-border) → #E8E8E8
Text: var(--color-text-primary)
Same dimensions
Hover: border #1A1A1A
```

**Text Link / Underline**
```
Font: 14px/400
Color: var(--color-text-primary)
Text-decoration: underline, underline-offset 3px, decoration-thickness 1px
Hover: color var(--color-text-secondary)
```

### Button Rules
- "Add to Bag" is always full-width on product pages. It's the primary action of the entire site.
- "Buy Now" (if present) is secondary — below Add to Bag, outline style.
- Out of stock: button replaced with "Notify Me" (secondary style) + email input.
- Cart flyout "Checkout" button: primary, full-width, at bottom of flyout.
- No urgency design patterns (pulsing buttons, countdown timers, "BUY NOW!!!").

### Product Card
```
Structure: image → details (stacked)
Image: aspect-ratio 3:4 (portrait), bg #F8F7F4, object-fit contain
  Hover: swap to second image if available (crossfade 300ms)
  Padding: 8% internal (product floats on background, not edge-to-edge)
Gap: 12px between image and text
Product name: 14px/500, --color-text-primary, 2-line clamp
Price: 14px/500, --color-text-primary
  Sale: original struck through in muted, sale price in red
Category/Color: 12px/400, --color-text-muted
Card border: none
Card shadow: none
Card padding: 0
Tap target: entire card is clickable
```

### Product Grid
```
Desktop: 4 columns
Tablet: 3 columns
Mobile: 2 columns
Gap: 24px horizontal, 40px vertical
```

### Product Detail Page
```
Layout: 2-column on desktop (image left 55%, details right 45%)
  Mobile: stacked, image gallery on top

Image gallery:
  Main image: aspect-ratio 3:4, bg #F8F7F4
  Thumbnails: 64px × 80px, row below main, 8px gap, active has 2px bottom border
  Zoom: click or pinch opens full-screen lightbox

Details column:
  Category: 12px/500 uppercase muted, letter-spacing 1px
  Product name: 28px/500
  Price: 24px/600, 16px below name
  Description: 15px/400, 24px below price, max 480px width
  Size selector: pill buttons, 40px height, 1px border, selected has black bg/white text
  Color selector: 24px circles, 2px border on selected, tooltip with color name
  "Add to Bag": full-width, 52px, 32px below selectors
  Details accordion: materials, sizing, shipping, care — 1px border-top per section
```

### Size Selector
```
Type: horizontal pill row
Each pill: padding 0 16px, height 40px, border 1px solid #E8E8E8, radius 0px
Selected: bg #1A1A1A, text #FFFFFF, border transparent
Unavailable: text #CCCCCC, diagonal line-through, cursor not-allowed
Hover (available): border #1A1A1A
```

### Cart Flyout / Sidebar
```
Width: 420px (desktop), full-screen (mobile)
Background: #FFFFFF
Slide in from right, 300ms ease-out
Overlay: rgba(0,0,0,0.3)
Header: "Your Bag (3)" — 18px/500 + close button
Cart items:
  Image: 80px × 100px, bg #F8F7F4
  Name: 14px/500
  Details: 13px muted (Size, Color)
  Quantity: stepper (- [2] +), 32px height
  Price: 14px/500, right-aligned
  Remove: "Remove" text link, 12px, muted
Divider: 1px #F0F0F0 between items
Subtotal: 16px/500, right-aligned, above checkout
Shipping: 13px muted, "Calculated at checkout" or "Free"
Checkout button: primary, full-width, bottom of flyout, sticky
```

### Navigation
```
Type: centered logo, split nav
Height: 64px
Background: white, transparent on hero pages
Logo: centered, 20px Satoshi bold or wordmark
Left nav: categories (Shop, New, Sale)
Right nav: utilities (Search, Account, Bag)
Items: 13px/500 uppercase, letter-spacing 1px
Hover: opacity 0.6
Bag counter: 10px circle, red, white text, absolute top-right of bag icon
Sticky on scroll: white bg + 1px bottom border
Mobile: hamburger left, logo center, bag right
```

---

### Grid System
- **Max content width:** 1440px
- **Product grid max:** 1200px
- **Gutter:** 24px
- **Page margin:** 48px desktop, 24px tablet, 16px mobile

### Spacing Scale (4px base)
| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Icon-text gap |
| `--space-2` | 8px | Tight element gaps |
| `--space-3` | 12px | Card internal gaps |
| `--space-4` | 16px | Component padding |
| `--space-6` | 24px | Product grid gap, section padding |
| `--space-8` | 32px | Between page sections |
| `--space-10` | 40px | Product grid vertical gap |
| `--space-12` | 48px | Page margins |
| `--space-16` | 64px | Major section breaks |
| `--space-20` | 80px | Hero padding, footer padding |

### Responsive Breakpoints
| Name | Width | Behavior |
|------|-------|----------|
| Mobile | < 640px | 2-col product grid, stacked PDP, full-screen cart |
| Tablet | 640px – 1024px | 3-col grid, stacked PDP with side info |
| Desktop | > 1024px | 4-col grid, 2-col PDP, cart flyout |

---

### Shadow Scale
| Level | Value | Usage |
|-------|-------|-------|
| None | `none` | Default — almost everything |
| SM | `0 2px 8px rgba(0,0,0,0.06)` | Dropdown menus, search overlay |
| MD | `0 4px 24px rgba(0,0,0,0.08)` | Cart flyout, image lightbox |

### Depth Philosophy
- Near-zero shadow usage. Products float on background color alone (#F8F7F4 on cards).
- Cart flyout uses MD shadow to separate from page.
- Product images create depth through the product's own shadows in photography.

---

### Icons
- **Library:** Lucide or custom line icons
- **Size:** 20px nav, 16px inline
- **Stroke:** 1.5px
- **Key icons:** search, user, shopping-bag, heart, x, chevron-down, minus, plus, arrow-right

### Product Photography
- **Background:** Consistent #F8F7F4 warm gray across all product images.
- **Padding:** Product never touches the edge — 8-10% padding inside the image frame.
- **Consistency:** Same lighting, same background, same padding on every product.
- **Second image on hover:** Alternate angle or on-model shot.
- **Zoom:** Click-to-zoom on desktop, pinch on mobile.

---

### Timing
| Type | Duration | Easing | Usage |
|------|----------|--------|-------|
| Micro | 150ms | ease-out | Button hover, link color |
| Image swap | 300ms | ease-in-out | Product card hover image change |
| Flyout | 300ms | ease-out | Cart sidebar slide in |
| Fade | 200ms | ease-out | Page content fade in |
| Lightbox | 250ms | ease-out | Image zoom open |

### Motion Rules
- Product card image swap: crossfade, never slide or flip.
- Cart flyout: slide from right + overlay fade.
- Add to bag: brief button text change ("Added ✓" for 1.5s, then revert).
- Quantity stepper: no animation — instant update.
- Page transitions: simple fade, no slide.
- `prefers-reduced-motion`: disable image swap, use instant transitions.

---

### Do
- Let product photography dominate every page.
- Maintain consistent product image backgrounds (#F8F7F4) and aspect ratios (3:4).
- Show prices clearly and upfront — no "click to see price."
- Display real-time stock status: "In stock", "Only 3 left", "Out of stock."
- Make size/color selection visible without scrolling on product pages.
- Include product details (materials, dimensions) in accordion format.

### Don't
- Don't use urgency dark patterns: fake countdown timers, "X people viewing this."
- Don't use border-radius on buttons, cards, or images. Sharp corners only.
- Don't add decorative elements. No badges saying "BESTSELLER" or "HOT."
- Don't use more than 2 font weights (400 and 500, with 600 for prices only).
- Don't auto-play product videos.
- Don't use carousel sliders for product grids — static grid always.
- Don't hide the price or total cost until checkout.
- Don't use pop-up modals for promotions or email capture.

---

### Compliance Level
WCAG 2.1 AA.

### Color Contrast
| Element | Ratio | Verified |
|---------|-------|----------|
| Primary text (#1A1A1A) on white | 16.8:1 | ✓ |
| Secondary text (#666666) on white | 5.7:1 | ✓ |
| Sale red (#C62828) on white | 5.9:1 | ✓ |
| Muted text (#999999) on white | 2.8:1 | Non-essential only |

### Keyboard & Screen Reader
- Product cards: focusable, Enter opens product page.
- Size selectors: arrow keys navigate, Space/Enter selects.
- Image gallery: arrow keys cycle images, Escape closes lightbox.
- Cart flyout: focus trapped inside, Escape closes.
- Quantity stepper: buttons labeled "Decrease quantity" / "Increase quantity."
- Product images: descriptive alt text including product name and color.
- Price changes (sale): `<del>` for original price, `<ins>` for sale price.
- Stock status announced via `aria-live` when size selection changes availability.

---

### Empty States
- **Empty cart:** "Your bag is empty" + "Continue Shopping" link. No sad illustrations.
- **No search results:** "No results for '[query]'" + "Try a different search" + popular categories.
- **Out of stock:** Grey out size, show "Notify Me" input replacing Add to Bag.

### Loading States
- Product grid: skeleton cards matching 3:4 aspect ratio, pulse on #F0F0F0.
- Product detail: skeleton for image (solid #F8F7F4) + text blocks.
- Cart operations: inline spinner next to affected item, no full-page loading.

### Error States
- Add to bag failure: toast at top "Couldn't add to bag. Please try again."
- Checkout errors: inline below the relevant field, red text + border.
- Payment failure: stay on checkout page with error banner, don't redirect.

---

### Before Generating
1. Read this entire DESIGN.md.
2. Import Satoshi (400, 500, 600). JetBrains Mono (400) for order numbers.
3. Background: #FFFFFF. Product image backgrounds: #F8F7F4.
4. No border-radius anywhere. Sharp corners are the aesthetic.

### CSS Reset Baseline
```css
*, *::before, *::after { box-sizing: border-box; margin: 0; }
body {
  font-family: 'Satoshi', 'DM Sans', -apple-system, sans-serif;
  font-size: 15px; line-height: 1.65; color: #1A1A1A;
  background: #FFFFFF;
  -webkit-font-smoothing: antialiased;
}
```

### Agent Prompt Templates
**Product listing page:**
"Build a product grid page: centered nav with logo, category title 'New Arrivals', 4-column product grid with 3:4 images on #F8F7F4 bg, product name + price below each. Image hover swaps to second image."

**Product detail page:**
"Create a product detail page: 2-column layout, image gallery left (main + thumbnails), details right (category label, product name 28px, price 24px, size pills, color circles, full-width Add to Bag button, details accordion)."

### Common AI Agent Mistakes to Avoid
- Using border-radius on buttons or cards.
- Using font-weight 700 (bold) — max is 600, and only for prices.
- Making product images edge-to-edge — products need breathing room inside the frame.
- Using colored backgrounds for sections — only white and #F8F7F4.
- Adding decorative badges or promotional banners.
- Left-aligning prices in cart — prices are right-aligned.
- Using modal popups — use flyout/sidebar for cart, bottom sheet for mobile.

