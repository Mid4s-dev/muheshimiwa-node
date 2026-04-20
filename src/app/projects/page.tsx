"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "~/trpc/react";

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: projects, isLoading } = api.project.getAll.useQuery({
    category: selectedCategory ?? undefined,
  });

  const categories = Array.from(new Set((projects ?? []).map((project) => project.category)));

  const filteredProjects = selectedCategory
    ? projects?.filter((p) => p.category === selectedCategory)
    : projects;

  return (
    <div className="min-h-screen bg-gradient-to-b from-md-green/10 via-white to-white py-12">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-md-green">Projects & Development Blog</h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Explore ongoing and completed projects across Embakasi Central. Click any project card to read the full project blog with photos, impact, and updates.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-12 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`rounded-full px-6 py-2 font-semibold transition ${
              selectedCategory === null
                ? "bg-md-green text-white"
                : "bg-white text-md-green ring-2 ring-md-green"
            }`}
          >
            All Projects
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-6 py-2 font-semibold transition ${
                selectedCategory === cat
                  ? "bg-md-green text-white"
                  : "bg-white text-md-green ring-2 ring-md-green"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {!isLoading && filteredProjects && filteredProjects.length > 0 && (
          <div className="mb-6 text-center text-sm text-gray-500">
            Showing {filteredProjects.length} project{filteredProjects.length === 1 ? "" : "s"}
            {selectedCategory ? ` in ${selectedCategory}` : " across all categories"}.
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div className="col-span-full text-center py-12 text-gray-600">
              Loading projects...
            </div>
          ) : !filteredProjects || filteredProjects.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-600">
              <p className="text-lg font-semibold">No projects found</p>
              <p className="text-sm">Check back soon for more updates!</p>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-2xl"
              >
                {project.image && (
                  <div className="h-48 overflow-hidden bg-gradient-to-br from-md-green/10 to-md-gold/10">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="inline-block rounded-full bg-md-gold/20 px-3 py-1 text-xs font-bold text-md-dark">
                      {project.category}
                    </span>
                    <span className="text-xs font-semibold text-gray-600 capitalize">
                      {project.status}
                    </span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">{project.title}</h3>
                  <p className="mb-4 text-sm text-gray-600 line-clamp-3">
                    {project.description}
                  </p>

                  {project.ward && (
                    <p className="mb-3 text-sm text-md-green font-semibold">
                      📍 {project.ward}
                    </p>
                  )}

                  {project.location && (
                    <p className="mb-3 text-sm text-gray-600">
                      <span className="font-semibold">Location:</span> {project.location}
                    </p>
                  )}

                  {project.impact && (
                    <p className="mb-4 text-sm text-gray-700">
                      <strong>Impact:</strong> {project.impact}
                    </p>
                  )}

                  <Link
                    href={`/projects/${project.id}`}
                    className="inline-flex items-center gap-2 font-bold text-md-green transition hover:text-green-700"
                  >
                    Open project blog <span>→</span>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
