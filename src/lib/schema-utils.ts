/**
 * Utility functions for generating JSON-LD structured data
 * for better SEO and search engine understanding
 */

export interface Project {
  id: string;
  title: string;
  description?: string;
  image?: string;
  category?: string;
  updatedAt?: Date;
}

export interface ImpactStory {
  id: string;
  title: string;
  description?: string;
  image?: string;
  impact?: string;
  ward?: string;
}

/**
 * Generate JSON-LD schema for a Project
 */
export function generateProjectSchema(
  project: Project,
  siteUrl: string
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Project",
    "@id": `${siteUrl}/projects/${project.id}`,
    name: project.title,
    description: project.description ?? project.title,
    image: project.image ? `${siteUrl}${project.image}` : undefined,
    url: `${siteUrl}/projects/${project.id}`,
    category: project.category ?? "Community Development",
    dateModified: project.updatedAt
      ? new Date(project.updatedAt).toISOString()
      : new Date().toISOString(),
  };
}

/**
 * Generate JSON-LD schema for an Impact Story
 */
export function generateImpactStorySchema(
  story: ImpactStory,
  siteUrl: string
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": `${siteUrl}/impact/${story.id}`,
    headline: story.title,
    description: story.description ?? story.title,
    image: story.image ? `${siteUrl}${story.image}` : undefined,
    url: `${siteUrl}/impact/${story.id}`,
    articleBody: story.description,
    keywords: story.impact ? [story.impact, story.ward ?? "Embakasi Central"] : [],
    isPartOf: {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
    },
  };
}

/**
 * Generate JSON-LD schema for Breadcrumb navigation
 */
export function generateBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; url: string }>,
  siteUrl: string
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  };
}

/**
 * Generate FAQ Schema for common questions
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
