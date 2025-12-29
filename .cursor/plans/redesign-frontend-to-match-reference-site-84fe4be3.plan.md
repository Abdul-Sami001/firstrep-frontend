<!-- 84fe4be3-6af9-4af4-ab3b-60f5d2a0f076 9fe6d5f6-f8aa-4dde-972a-07ea72a34d0c -->
# Frontend Redesign Plan: Match Reference Site UI/UX

## Overview

Refactor existing Next.js components to match the design and structure of https://1strep.qanzakglobal.com/ while maintaining all existing API integrations and functionality.

## Analysis Summary

### Reference Site Structure:

- **Promo Banner**: Scrolling text banner at top
- **Header**: Logo, navigation (ACTIVE RANGE, 1R COLLECTION, RESELLERS, ABOUT US), search, account, cart icons
- **Hero Section**: YouTube video embed
- **Gender Selector**: Men/Women buttons
- **Category Sections**: Multiple sections with category badges, headings, descriptions, and Shop Men/Women buttons
- **Footer**: Newsletter signup, brand section, 4-column layout (Shop, Customer Care, Company, Connect), copyright

### Current State:

- Components exist but need styling refactor
- APIs integrated in `lib/api/` folder
- Mobile-first Tailwind setup
- Skeleton component exists but underutilized
- Some images use Next.js Image, some don't

## Implementation Plan

### Phase 1: Header & Navigation Refactor

**Files**: `components/Header.tsx`

**Changes**:

- Update navigation items to match reference: "ACTIVE RANGE", "1R COLLECTION", "RESELLERS", "ABOUT US"
- Adjust navigation styling (uppercase, spacing, hover states)
- Ensure logo positioning matches reference
- Maintain existing functionality (cart count, wishlist, user dropdown)
- Add optional chaining for all user/profile data access

### Phase 2: Promo Banner Refactor

**Files**: `components/PromoBanner.tsx`

**Changes**:

- Implement scrolling/marquee text effect matching reference
- Update text content to match reference: "Holiday Magic - Start of 2026 will see our brand new product line. Claim 15% discount on your first order when you register with us."
- Adjust styling (background, text color, close button)
- Ensure mobile responsiveness

### Phase 3: Homepage Layout Refactor

**Files**: `app/(site)/page.tsx`

**Changes**:

- Replace current hero with YouTube video embed section
- Add gender selector (Men/Women buttons) below hero
- Restructure category sections to match reference layout:
- Category badge (Collection, Essentials, Performance Range, etc.)
- Heading (e.g., "Hoodies and Sweaters")
- Description text
- Shop Men / Shop Women buttons
- Product grid with skeleton loaders
- Fetch categories from API (`productsApi.getCategories()`)
- For each category, fetch products and display with ProductCard
- Add skeleton loaders for all product grids
- Use optional chaining for all API data: `product?.title`, `category?.name`, etc.
- Remove static product data, use only API data

### Phase 4: ProductCard Optimization

**Files**: `components/ProductCard.tsx`

**Changes**:

- Ensure all images use Next.js `<Image />` with proper optimization
- Add optional chaining: `product?.images?.[0]?.image`, `product?.variants?.[0]?.stock`
- Verify `sizes` prop is set correctly for responsive images
- Ensure `priority` prop is used for above-fold products
- Add skeleton loader state during image loading

### Phase 5: Footer Refactor

**Files**: `components/Footer.tsx`

**Changes**:

- Restructure to match reference layout:
- Newsletter signup section at top (centered)
- Brand section with logo, description, social links
- Four columns: Shop, Customer Care, Company, Connect
- Update link lists to match reference
- Bottom section: Copyright, "Built by Qanzak Global", legal links
- Update social media links to match reference
- Ensure mobile stacking works correctly

### Phase 6: Skeleton Loaders Implementation

**Files**: Multiple (homepage, product pages, category pages)

**Changes**:

- Create ProductGridSkeleton component for product listings
- Create CategorySectionSkeleton for category sections
- Add skeleton loaders to:
- Homepage product grids
- Category/collection pages
- Shop page
- Product detail page (image gallery, details)
- Replace loading spinners with skeleton loaders

### Phase 7: Image Optimization Audit

**Files**: All components using images

**Changes**:

- Audit all image usage:
- Replace `<img>` tags with Next.js `<Image />`
- Ensure all images have proper `sizes` prop
- Set `priority={true}` for above-fold images
- Add `quality={85}` for optimized images
- Use `fill` with proper aspect ratios where appropriate
- Files to check:
- `components/CategoryCard.tsx` (currently uses `<img>`)
- `components/Hero.tsx` (already uses Image)
- `app/(site)/page.tsx` (check all Image components)
- `components/ProductCard.tsx` (already uses Image)

### Phase 8: Optional Chaining & Error Handling

**Files**: All components using API data

**Changes**:

- Add optional chaining (`?.`) to all API data access:
- `product?.title` instead of `product.title`
- `product?.images?.[0]?.image` instead of `product.images[0].image`
- `category?.name` instead of `category.name`
- `user?.first_name` instead of `user.first_name`
- Add fallback values where appropriate
- Files to update:
- `components/ProductCard.tsx`
- `components/Header.tsx`
- `app/(site)/page.tsx`
- `app/(site)/product/[id]/page.tsx`
- All other pages using API data

### Phase 9: CSS Cleanup

**Files**: `app/globals.css`, component files

**Changes**:

- Remove unused CSS classes
- Remove commented-out styles
- Consolidate duplicate styles
- Ensure all custom utilities in `tailwind.config.js` are being used
- Remove any inline styles that should be in Tailwind classes

### Phase 10: Mobile Responsiveness Verification

**Files**: All components

**Changes**:

- Test all components at mobile breakpoints (320px, 375px, 414px)
- Verify touch targets are minimum 44px
- Ensure text is readable without zooming
- Verify navigation works on mobile
- Test category sections stack properly on mobile
- Verify footer columns stack on mobile
- Test product grids on mobile (should be 1-2 columns)

## Key Technical Requirements

1. **No Mock Data**: All data must come from existing APIs
2. **Optional Chaining**: Use `?.` for all API data access
3. **Skeleton Loaders**: Implement for all data-driven sections
4. **Image Optimization**: All images use Next.js `<Image />` with proper props
5. **Mobile First**: Ensure 100% mobile responsiveness
6. **Clean Code**: Remove unused styles and dead code

## Files to Modify

### Primary Files:

- `components/Header.tsx` - Navigation refactor
- `components/PromoBanner.tsx` - Scrolling banner
- `components/Footer.tsx` - Layout restructure
- `components/ProductCard.tsx` - Image optimization, optional chaining
- `components/CategoryCard.tsx` - Convert to Next.js Image
- `app/(site)/page.tsx` - Complete homepage restructure
- `components/ui/skeleton.tsx` - Already exists, will be used

### Secondary Files (if needed):

- `app/(site)/shop/page.tsx` - Add skeleton loaders
- `app/(site)/collections/page.tsx` - Add skeleton loaders
- `app/(site)/product/[id]/page.tsx` - Image optimization, optional chaining

## New Components to Create (if needed)

1. `components/ProductGridSkeleton.tsx` - Skeleton for product grids
2. `components/CategorySectionSkeleton.tsx` - Skeleton for category sections
3. `components/GenderSelector.tsx` - Men/Women button selector (if not exists)

## Testing Checklist

- [ ] Header navigation matches reference
- [ ] Promo banner scrolls correctly
- [ ] Homepage category sections match reference layout
- [ ] All product images load and are optimized
- [ ] Skeleton loaders appear during data fetching
- [ ] Optional chaining prevents crashes on null data
- [ ] Mobile responsiveness verified (320px - 1920px)
- [ ] All API integrations work correctly
- [ ] No console errors
- [ ] No unused CSS/styles remain

### To-dos

- [ ] Refactor Header component to match reference site navigation (ACTIVE RANGE, 1R COLLECTION, RESELLERS, ABOUT US) and styling
- [ ] Update PromoBanner to implement scrolling text effect matching reference site content
- [ ] Restructure homepage to match reference: YouTube hero, gender selector, category sections with badges and Shop Men/Women buttons
- [ ] Restructure Footer to match reference: newsletter signup, brand section, 4-column layout (Shop, Customer Care, Company, Connect)
- [ ] Audit and convert all image tags to Next.js Image component with proper optimization (sizes, priority, quality)
- [ ] Implement skeleton loaders for all data-driven sections (product grids, category sections, product detail pages)
- [ ] Add optional chaining (?.) to all API data access throughout the codebase to prevent crashes
- [ ] Remove unused CSS/styles and consolidate duplicate styles
- [ ] Verify 100% mobile responsiveness across all breakpoints (320px - 1920px)