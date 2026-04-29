# SEO Optimization Guide - Muheshimiwa Campaign

## Overview

This document outlines the comprehensive SEO optimizations applied to the Muheshimiwa campaign website to improve organic search visibility and discoverability on Google.

## Implemented SEO Improvements

### 1. **Robots & Sitemap Infrastructure** ✅

#### `/src/app/robots.ts`
- **Purpose**: Controls how search engines crawl the website
- **Configuration**:
  - Allows crawlers to index all public pages (`/projects`, `/bursaries`, `/polling-stations`, `/about`, etc.)
  - Explicitly disallows crawling of admin paths (`/admin`, `/admin-login`)
  - Disallows API routes and internal Next.js paths
  - Points to dynamic sitemap at `/sitemap.xml`
  - Sets canonical host to improve domain authority signal

#### `/src/app/sitemap.ts`
- **Purpose**: Provides search engines with a structured list of all crawlable pages
- **Features**:
  - **Static Routes**: Home, manifesto, about, projects, bursaries, polling stations, register
  - **Dynamic Routes**: Individual project pages (fetched from database)
  - **Priority Weights**:
    - Homepage: 1.0 (highest priority)
    - Manifesto, Projects: 0.9 (important content)
    - Individual projects: 0.7
    - Other pages: 0.8
  - **Change Frequencies**: Reflects actual content update patterns (daily for homepage, weekly for projects, monthly for about)
  - **Last Modified Dates**: Automatically updated from database

### 2. **Metadata & Open Graph Tags** ✅

#### Root Layout (`/src/app/layout.tsx`)
- **Page Title Template**: `%s | Muheshimiwa` (applied to all child pages for consistency)
- **Global Description**: Comprehensive, keyword-rich description with stats
- **Keywords**: 10+ relevant keywords including location, candidate name, topics
- **Canonical URL**: Points to production domain for new domain consolidation
- **Robots Meta**: `index: true, follow: true, max-snippet: -1, max-image-preview: large`
- **JSON-LD Schema**: Organization & WebSite schema with contact info and search action
- **Open Graph**:
  - Locale: `en_KE` (Kenya)
  - Site name branding
  - Custom images with dimensions (1200x630px)
  - Article-specific properties
- **Twitter Card**: Large image card for social sharing

#### Page-Specific Metadata Files

**Homepage** (`/src/app/page.tsx`):
- Custom title: "Muheshimiwa - Embakasi Central Campaign"
- Campaign mission with key stats in description
- Canonical URL: `/`

**Projects Page** (`/src/app/projects/layout.tsx`):
- Title: "Projects & Development Blog"
- Emphasizes development focus and impact
- Canonical URL: `/projects`

**Individual Project Pages** (`/src/app/projects/[id]/layout.tsx`):
- **Dynamic Title**: Project title as page title
- **Dynamic Description**: Project description or ward location
- **Dynamic Image**: Project featured image in OG tags
- **Article Schema**: PublishedTime, ModifiedTime, Authors, Tags
- **Keywords**: Project title, category, ward, "project", "maendeleo"

**Bursaries Page** (`/src/app/bursaries/page.tsx`):
- Title: "Bursaries & Education Support"
- Focus on 500+ students and application tracking
- Canonical URL: `/bursaries`

**About Page** (`/src/app/about/page.tsx`):
- Title: "About the Campaign Team"
- Emphasizes leadership and commitment
- Canonical URL: `/about`

**Manifesto Page** (`/src/app/manifesto/page.tsx`):
- Title: "Campaign Manifesto - Six Pillars for Change"
- Keywords: All six pillars of the platform

**Polling Stations Page** (`/src/app/polling-stations/layout.tsx`):
- Title: "Polling Stations - Embakasi Central"
- Emphasizes quick lookup and directions
- Canonical URL: `/polling-stations`

### 3. **Structured Data (JSON-LD Schema)** ✅

#### Organization Schema
```json
{
  "@type": "Organization",
  "name": "Muheshimiwa Campaign",
  "url": "https://mejjadonk.mid4s.site",
  "logo": "https://mejjadonk.mid4s.site/icons/logo.png",
  "description": "Vote for Real Change campaign",
  "address": "Embakasi Central, Nairobi, KE",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Campaign Inquiry",
    "telephone": "+254-712-345-678"
  }
}
```

#### Website Schema
- Enables Google to understand site structure
- Includes SearchAction for site search functionality
- Links to Organization schema for brand consistency

#### Project Schema (Available via `generateProjectSchema()`)
- Type: `Project`
- Properties: Name, description, image, category, dateModified
- Helps Google understand individual development initiatives

#### Article Schema (for Projects & Stories)
- PublishedTime, ModifiedTime for freshness signals
- Author attribution to campaign
- Tags for topic classification

### 4. **Canonical URLs** ✅

- **Root Layout**: Canonical URL uses full production domain (`https://mejjadonk.mid4s.site`)
- **All Page Layouts**: Explicit `alternates.canonical` with full URLs
- **Prevents Duplicate Content**: Single version of truth for each page
- **Domain Consolidation**: Helps with indexing on new domain

### 5. **Mobile & Performance SEO** ✅

#### Already Configured in Root Layout:
- **Viewport Meta Tag**: `width=device-width, initial-scale=1, viewport-fit=cover`
- **Theme Color**: `#016629` (campaign green)
- **Apple Touch Icon**: For iOS home screen
- **Manifest**: PWA support with `manifest.json`

#### Image Optimization:
- Using Next.js `<Image>` component for automatic optimization
- Sharp-based WebP conversion on upload
- Responsive images with proper `sizes` attribute

#### Performance:
- Revalidate strategy: `revalidate: 0` on pages with dynamic content
- Next.js Image optimization enabled
- Server-side rendering for better Core Web Vitals

### 6. **Utility Functions** ✅

#### `/src/lib/schema-utils.ts`
Provides reusable functions for generating JSON-LD schema:

```typescript
- generateProjectSchema(project, siteUrl)      // For projects
- generateImpactStorySchema(story, siteUrl)    // For impact stories
- generateBreadcrumbSchema(breadcrumbs, siteUrl) // For navigation
- generateFAQSchema(faqs)                      // For FAQ pages
```

## How Indexing Works

### 1. **Google Discovery**
- Robots.txt allows crawling of all public pages
- Sitemap provides complete URL list with priorities
- Canonical URLs consolidate new domain authority

### 2. **Content Understanding**
- Page-specific titles and descriptions help Google categorize content
- JSON-LD schema helps Google understand page type (Article, Project, Organization)
- Keywords help with topic relevance

### 3. **Freshness Signals**
- lastModified in sitemap shows when content was updated
- Article schema dateModified helps with news/fresh content ranking

### 4. **Authority Signals**
- Proper site structure (logical hierarchy)
- Internal linking (navigation, CTAs)
- Mobile-friendly design (responsive layout)
- Fast load times (Next.js optimization)

## Next Steps for Production

### 1. **Verify Robots.txt**
```bash
# Check if robots.txt is accessible
curl https://mejjadonk.mid4s.site/robots.txt
```

### 2. **Verify Sitemap**
```bash
# Check if sitemap is accessible
curl https://mejjadonk.mid4s.site/sitemap.xml
```

### 3. **Google Search Console Setup**
- Visit: https://search.google.com/search-console
- Add property: `https://mejjadonk.mid4s.site`
- Verify domain ownership (DNS TXT record recommended)
- Submit sitemap at: `/sitemap.xml`
- Monitor indexing progress in "Coverage" tab

### 4. **Google Search Console Checks**
- **Coverage**: Ensure all pages are "Indexed"
- **URL Inspection**: Check individual pages for crawl errors
- **Mobile Usability**: Verify no mobile issues
- **Core Web Vitals**: Monitor LCP, FID, CLS metrics
- **Links**: Review internal and external backlink structure

### 5. **Bing Webmaster Tools** (Optional)
- Submit to: https://www.bing.com/webmasters
- Similar process to Google Search Console
- Helps with Bing/Edge search results

### 6. **Monitor & Iterate**
- Track keyword rankings in Google Search Console
- Monitor click-through rates (CTR) in Search Console
- Identify search queries driving traffic
- Optimize titles and descriptions for high-impression, low-CTR queries

## Important Environment Configuration

### Production `.env` Requirements

Ensure these are set correctly for SEO:

```env
# Must be HTTPS for production
NEXT_PUBLIC_SITE_URL=https://mejjadonk.mid4s.site

# NextAuth requires HTTPS auth URL in production
NEXTAUTH_URL=https://mejjadonk.mid4s.site

# Database connection
DATABASE_URL=mysql://user:password@host/db_name
```

### Development `.env` (Local Testing)

```env
# Can be HTTP for local testing
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
```

## SEO Best Practices Checklist

### Content
- [x] Unique, compelling titles for each page
- [x] Descriptive meta descriptions (120-160 characters)
- [x] Keyword-rich content without keyword stuffing
- [x] Proper heading hierarchy (H1 per page, H2-H6 for structure)
- [x] Internal linking between related pages

### Technical
- [x] Robots.txt properly configured
- [x] Sitemap.xml with all public pages
- [x] Canonical URLs on all pages
- [x] Mobile-responsive design
- [x] HTTPS enabled on production
- [x] Fast page load times
- [x] JSON-LD structured data

### Social & Sharing
- [x] Open Graph tags for social media
- [x] Twitter Card tags for tweet sharing
- [x] Image optimization for sharing
- [x] Unique descriptions for each page

### Ongoing
- [ ] Google Search Console monitoring
- [ ] Regular content updates
- [ ] Backlink monitoring
- [ ] Keyword ranking tracking
- [ ] Mobile usability maintenance
- [ ] Core Web Vitals optimization

## Monitoring & Analytics

### Recommended Tools
1. **Google Search Console**: Track indexing, keywords, CTR
2. **Google Analytics 4**: Track user behavior, conversions
3. **Lighthouse**: Performance and SEO scores (Chrome DevTools)
4. **SERPWatcher/Semrush**: Keyword ranking tracking
5. **Screaming Frog**: Technical SEO audit

### Key Metrics to Track
- Indexed pages in Google
- Search impressions and clicks
- Average click-through rate (CTR)
- Keyword rankings
- Core Web Vitals scores
- Mobile usability issues

## Notes

- The app uses Next.js 15 App Router for optimal SEO with server-side rendering
- Dynamic metadata generation ensures each page has appropriate tags
- The sitemap automatically includes new projects as they're created
- Canonical URLs help Google understand the primary domain for the new domain
- JSON-LD schema improves search result appearance with rich snippets

## Support

For issues or questions about SEO implementation:
1. Check Google Search Console for crawl/indexing errors
2. Use Lighthouse for performance diagnostics
3. Review Next.js SEO best practices: https://nextjs.org/learn/seo/introduction-to-seo
4. Consult Google's Search Central: https://developers.google.com/search

---

Last Updated: April 29, 2026
