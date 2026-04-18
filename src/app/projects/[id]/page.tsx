"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";

export default function ProjectBlogPage() {
  const params = useParams();
  const projectId = typeof params.id === "string" ? params.id : "";

  const { data: project, isLoading } = api.project.getById.useQuery(
    { id: projectId },
    { enabled: !!projectId }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 text-center shadow">
          <p className="text-gray-600">Loading project blog...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 text-center shadow">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Project not found</h1>
          <p className="mb-6 text-gray-600">The project you are looking for does not exist.</p>
          <Link
            href="/projects"
            className="inline-flex rounded-lg bg-md-green px-5 py-2.5 font-semibold text-white"
          >
            Back to projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-md-green/10 to-white px-4 py-12">
      <article className="mx-auto max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl">
        {project.image && (
          <div className="h-72 w-full overflow-hidden bg-gray-100 md:h-96">
            <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
          </div>
        )}

        <div className="p-6 md:p-10">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-md-gold/20 px-3 py-1 text-xs font-bold text-md-dark">
              {project.category}
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold capitalize text-gray-700">
              {project.status}
            </span>
            {project.ward && (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                {project.ward}
              </span>
            )}
          </div>

          <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">{project.title}</h1>

          {project.impact && (
            <div className="mb-6 rounded-lg border border-md-green/20 bg-md-green/5 p-4">
              <p className="text-sm font-semibold text-md-green">Project Impact</p>
              <p className="text-gray-800">{project.impact}</p>
            </div>
          )}

          <div className="prose max-w-none text-gray-700">
            {project.description.split("\n").map((paragraph, index) => (
              <p key={`${project.id}-${index}`} className="mb-4 leading-7">
                {paragraph}
              </p>
            ))}
          </div>

          {project.image && (
            <section className="mt-10">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Project Photos</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <img
                  src={project.image}
                  alt={`${project.title} photo 1`}
                  className="h-64 w-full rounded-xl object-cover"
                />
                <img
                  src={project.image}
                  alt={`${project.title} photo 2`}
                  className="h-64 w-full rounded-xl object-cover"
                />
              </div>
            </section>
          )}

          <div className="mt-10 flex flex-wrap gap-3 border-t pt-6">
            <Link
              href="/projects"
              className="rounded-lg border border-md-green px-4 py-2 font-semibold text-md-green transition hover:bg-md-green hover:text-white"
            >
              Back to all projects
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
