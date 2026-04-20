"use client";

import Link from "next/link";
import { useRef } from "react";

type ProjectCarouselItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string | null;
};

export function ProjectsCarousel({ projects }: { projects: ProjectCarouselItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByViewport = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;

    const activeCard = track.querySelector<HTMLElement>('[data-carousel-card="true"]');
    const distance = activeCard?.getBoundingClientRect().width ?? Math.max(track.clientWidth * 0.85, 280);
    track.scrollBy({ left: distance * direction, behavior: "smooth" });
  };

  if (projects.length === 0) {
    return <p className="text-center text-gray-500">No projects available yet.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={() => scrollByViewport(-1)}
          className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 active:scale-[0.98] sm:px-5"
          aria-label="Scroll projects left"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={() => scrollByViewport(1)}
          className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 active:scale-[0.98] sm:px-5"
          aria-label="Scroll projects right"
        >
          Next
        </button>
      </div>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-3 pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-x" }}
      >
        {projects.map((project) => (
          <article
            key={project.id}
            data-carousel-card="true"
            className="w-[86vw] max-w-[24rem] shrink-0 snap-start rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-sm transition hover:shadow-lg sm:w-[68%] sm:max-w-none sm:p-5 md:w-[48%] lg:w-[31.5%]"
          >
            {project.image && (
              <div className="mb-4 aspect-[16/10] overflow-hidden rounded-xl bg-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
              </div>
            )}
            <div className="mb-3 inline-block rounded-full bg-md-gold px-3 py-1 text-xs font-semibold text-md-dark sm:text-sm">
              {project.category}
            </div>
            <h3 className="mb-2 text-lg font-bold text-md-dark sm:text-xl">{project.title}</h3>
            <p className="mb-4 line-clamp-3 text-sm leading-6 text-gray-700 sm:text-base">
              {project.description}
            </p>
            <Link href="/projects" className="inline-flex font-semibold text-md-green hover:underline">
              Learn More
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
