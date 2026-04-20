import Link from "next/link";
import { api } from "~/trpc/server";

export const revalidate = 0;

export default async function HomePage() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const impactStories = await api.impactStory.getFeatured();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const projects = await api.project.getAll();
  const featuredProjects = projects.slice(0, 3);

  const stats = [
    { number: "500+", label: "Students Sponsored", description: "Higher education scholarships" },
    { number: "8", label: "Wards Impacted", description: "Infrastructure projects" },
    { number: "50+", label: "Security Initiatives", description: "Community safety programs" },
    { number: "10K+", label: "Supporter List", description: "Campaign movement" },
  ];

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-md-dark py-24 text-white md:py-40">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/images/mejjadonkk_bg%20_cover.jpg")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-md-green/80 via-md-dark/75 to-md-dark/90" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <div className="mb-6 inline-block rounded-full border border-white/20 bg-black/25 px-4 py-2 text-md-gold backdrop-blur-sm">
            Vote for Real Change
          </div>
          <h1 className="mb-6 text-5xl font-black leading-tight md:text-6xl">
            MejjaDonk for 3 term 
          </h1>
          <p className="mb-8 text-lg text-white/90 md:text-xl">
            Real leadership, real results. Hon. Mejja Donk has delivered for Embakasi Central.
            Now it&apos;s time to go further.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/manifesto"
              className="transform rounded-lg bg-md-gold px-8 py-4 text-lg font-bold text-md-dark shadow-xl transition hover:scale-105"
            >
              Read Manifesto
            </Link>
            <Link
              href="/about"
              className="rounded-lg border-2 border-white bg-white/20 px-8 py-4 text-lg font-bold text-white transition hover:bg-white/30"
            >
              Meet the Team
            </Link>
          </div>
        </div>
      </section>

      {/* What We Stand For */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-12 text-center text-4xl font-bold text-md-green md:text-5xl">
            What We Stand For
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-white p-8 shadow">
              <h3 className="mb-3 text-xl font-bold text-md-green">Maendeleo</h3>
              <p className="text-gray-700">
                Infrastructure that transforms lives. New roads, water systems, healthcare facilities.
              </p>
            </div>
            <div className="rounded-lg bg-white p-8 shadow">
              <h3 className="mb-3 text-xl font-bold text-md-green">Accountability</h3>
              <p className="text-gray-700">
                Transparent governance with clear deliverables and community oversight.
              </p>
            </div>
            <div className="rounded-lg bg-white p-8 shadow">
              <h3 className="mb-3 text-xl font-bold text-md-green">Safety</h3>
              <p className="text-gray-700">
                Community policing and youth programs creating safer neighborhoods.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Pitch */}
      <section id="pitch" className="bg-gradient-to-r from-md-dark to-md-green py-16 text-white md:py-24">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="mb-8 text-center text-4xl font-bold md:text-5xl">The Pitch</h2>
          <div className="rounded-lg border-l-4 border-md-gold bg-white/10 p-8 backdrop-blur md:p-12">
            <p className="mb-6 text-lg leading-relaxed text-white/95">
              <strong>Hon. Mejja Donk has consistently fought for Embakasi Central.</strong> Not
              with empty promises, but with results you can see and feel.
            </p>
            <p className="mb-8 text-lg leading-relaxed text-white/95">We&apos;ve proven our commitment through:</p>
            <ul className="mb-8 space-y-3 text-white/90">
              <li className="flex items-start gap-3">
                <span className="text-xl font-bold text-md-gold">01</span>
                <span>
                  <strong>500+ students</strong> sponsored for higher education
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl font-bold text-md-gold">02</span>
                <span>
                  <strong>8 wards impacted</strong> with new infrastructure: roads, water,
                  healthcare
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl font-bold text-md-gold">03</span>
                <span>
                  <strong>50+ security initiatives</strong> creating safer communities
                </span>
              </li>
            </ul>
            <p className="text-xl font-bold text-md-gold">
              Your vote means we go further. Together, we build a prosperous Embakasi Central.
            </p>
          </div>
        </div>
      </section>

      {/* Parliamentary Contributions */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-4 text-center text-4xl font-bold text-md-green md:text-5xl">
            Parliamentary Contributions
          </h2>
          <p className="mx-auto mb-12 max-w-3xl text-center text-lg text-gray-600">
            In Parliament and within the constituency, Hon. Mejja Donk has focused on practical
            legislation support, oversight, and grassroots delivery that residents can measure.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <article className="rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
              <h3 className="mb-2 text-xl font-bold text-md-dark">Education and Bursary Access</h3>
              <p className="text-gray-700">
                Championed fairer bursary processes, improved follow-up for disbursement timelines,
                and supported pathways for more students from vulnerable households.
              </p>
              <p className="mt-3 text-sm font-semibold text-md-green">Result: Wider student support coverage</p>
            </article>

            <article className="rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
              <h3 className="mb-2 text-xl font-bold text-md-dark">Infrastructure Oversight</h3>
              <p className="text-gray-700">
                Pushed for implementation tracking on roads, drainage, and public utilities to ensure
                budgeted projects move from paperwork to completed community assets.
              </p>
              <p className="mt-3 text-sm font-semibold text-md-green">Result: Better project accountability</p>
            </article>

            <article className="rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
              <h3 className="mb-2 text-xl font-bold text-md-dark">Security and Public Safety</h3>
              <p className="text-gray-700">
                Supported resource allocation and local safety interventions, including lighting and
                community safety coordination in high-risk areas.
              </p>
              <p className="mt-3 text-sm font-semibold text-md-green">Result: Safer movement in key zones</p>
            </article>

            <article className="rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
              <h3 className="mb-2 text-xl font-bold text-md-dark">Constituency Voice in Parliament</h3>
              <p className="text-gray-700">
                Consistently raised local service-delivery priorities and pressed ministries to respond
                to issues affecting Embakasi Central families and small businesses.
              </p>
              <p className="mt-3 text-sm font-semibold text-md-green">Result: Stronger representation on local priorities</p>
            </article>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-12 text-center text-4xl font-bold text-md-green md:text-5xl">
            Recent Maendeleo Successes
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {featuredProjects.map((project) => {
              const projectImage = project.image ?? project.media?.[0]?.url ?? null;

              return (
              <div key={project.id} className="rounded-lg bg-gray-50 p-6 shadow transition hover:shadow-lg">
                {projectImage && (
                  <div className="mb-4 h-40 overflow-hidden rounded-lg bg-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={projectImage} alt={project.title} className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="mb-3 inline-block rounded-full bg-md-gold px-3 py-1 text-sm font-semibold text-md-dark">
                  {project.category}
                </div>
                <h3 className="mb-2 text-xl font-bold text-md-dark">{project.title}</h3>
                <p className="mb-4 line-clamp-2 text-gray-700">{project.description}</p>
                <Link href="/projects" className="text-md-green font-semibold hover:underline">
                  Learn More
                </Link>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="bg-md-dark text-white py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-12 text-center text-4xl font-bold md:text-5xl">Our Impact by Numbers</h2>
          <div className="grid gap-8 md:grid-cols-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="mb-2 text-4xl font-black text-md-gold md:text-5xl">
                  {stat.number}
                </div>
                <div className="mb-1 font-bold md:text-lg">{stat.label}</div>
                <div className="text-sm text-gray-300">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stories */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-4 text-center text-4xl font-bold text-md-green md:text-5xl">
            Impact Stories
          </h2>
          <p className="mb-12 text-center text-lg text-gray-600">
            Real stories of transformation and positive change from our community
          </p>
          {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
          {impactStories && impactStories.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-3">
              {/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */}
              {impactStories.map((story) => (
                <div key={story.id} className="overflow-hidden rounded-lg bg-white shadow-lg transition hover:shadow-xl">
                  {story.image && (
                    <div className="h-48 overflow-hidden bg-gray-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={story.image}
                        alt={story.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="mb-2 text-xl font-bold text-md-green">{story.title}</h3>
                    <p className="mb-4 text-gray-600">{story.description}</p>
                    <div className="flex items-center justify-between">
                      {story.impact && (
                        <span className="rounded-full bg-md-green/10 px-3 py-1 text-sm font-semibold text-md-green">
                          {story.impact}
                        </span>
                      )}
                      {story.ward && (
                        <span className="text-sm text-gray-500">{story.ward}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {/* eslint-enable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              No impact stories available yet. Check back soon for updates on our community initiatives!
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-md-green to-md-dark py-16 text-white md:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-6 text-4xl font-bold md:text-5xl">
            Ready to Make a Difference?
          </h2>
          <p className="mb-8 text-xl text-white/90">
            Every vote counts. Uko kadi? Join 10,000+ supporters on our movement list and stay
            updated as we push for third term momentum in Embakasi Central.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/manifesto"
              className="transform rounded-lg bg-md-gold px-8 py-4 text-lg font-bold text-md-dark shadow-xl transition hover:scale-105"
            >
              Read Manifesto
            </Link>
            <Link
              href="/register"
              className="rounded-lg border-2 border-white bg-white/20 px-8 py-4 text-lg font-bold text-white transition hover:bg-white/30"
            >
              Join Supporter List
            </Link>
          </div>
        </div>
      </section>

      {/* Why Vote */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-12 text-center text-4xl font-bold text-md-green md:text-5xl">
            Why Vote for Mejja Donk?
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-2 text-lg font-bold text-md-green">Proven Track Record</h3>
              <p className="text-gray-700">
                Over 500 students sponsored, 8 wards transformed, 50+ security initiatives launched.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-2 text-lg font-bold text-md-green">Results-Driven</h3>
              <p className="text-gray-700">
                Transparent governance with clear deliverables and community accountability.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-2 text-lg font-bold text-md-green">Community-Centered</h3>
              <p className="text-gray-700">
                Listens to your concerns and delivers solutions that matter to you.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-2 text-lg font-bold text-md-green">Future-Focused</h3>
              <p className="text-gray-700">
                Vision for a prosperous Embakasi with modern infrastructure and opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
