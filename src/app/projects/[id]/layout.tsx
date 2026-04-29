import { type Metadata } from "next";
import { db } from "~/server/db";
import { env } from "~/env";

const siteUrl = env.NEXT_PUBLIC_SITE_URL ?? "https://mejjadonk.mid4s.site";

interface ProjectLayoutProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProjectLayoutProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const project = await db.project.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        category: true,
        ward: true,
        updatedAt: true,
      },
    });

    if (!project) {
      return {
        title: "Project Not Found",
        description: "The project you are looking for does not exist.",
      };
    }

    const projectUrl = `${siteUrl}/projects/${project.id}`;
    const imageUrl = project.image ? `${siteUrl}${project.image}` : `${siteUrl}/og-image.svg`;

    return {
      title: project.title,
      description:
        project.description ??
        `Development project in ${project.ward ?? "Embakasi Central"}`,
      keywords: [
        project.title,
        project.category ?? "Development",
        project.ward ?? "Embakasi Central",
        "project",
        "maendeleo",
      ],
      alternates: {
        canonical: projectUrl,
      },
      openGraph: {
        type: "article",
        url: projectUrl,
        title: project.title,
        description:
          project.description ??
          `Development project in ${project.ward ?? "Embakasi Central"}`,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: project.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: project.title,
        description:
          project.description ??
          `Development project in ${project.ward ?? "Embakasi Central"}`,
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error("Error generating metadata for project:", error);
    return {
      title: "Development Project",
      description: "Explore our development projects across Embakasi Central",
    };
  }
}

export default function ProjectLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {/* Project Schema will be injected by page component */}
      {children}
    </>
  );
}
