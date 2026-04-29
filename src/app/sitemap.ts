import { type MetadataRoute } from "next";
import { db } from "~/server/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mejjadonk.mid4s.site";
  const now = new Date();

  // Static routes with priorities and change frequencies
  const staticRoutes = [
    { path: "/", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/manifesto", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/projects", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/bursaries", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/polling-stations", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/register", priority: 0.7, changeFrequency: "monthly" as const },
  ].map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  })) as MetadataRoute.Sitemap;

  // Dynamic project routes
  const projects = await db.project.findMany({
    select: {
      id: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  const projectRoutes = projects.map((project) => ({
    url: `${siteUrl}/projects/${project.id}`,
    lastModified: project.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  })) as MetadataRoute.Sitemap;

  // Dynamic impact story routes
  const impactStories = await db.impactStory.findMany({
    select: {
      id: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  const storyRoutes = impactStories.map((story) => ({
    url: `${siteUrl}/impact/${story.id}`,
    lastModified: story.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  })) as MetadataRoute.Sitemap;

  return [...staticRoutes, ...projectRoutes, ...storyRoutes];
}