const teamMembers = [
  {
    name: "Campaign Director",
    role: "Strategy & Operations",
    bio: "Leads campaign execution, planning, and inter-ward coordination to ensure promises are delivered.",
    image: "/team/campaign-director.svg",
  },
  {
    name: "Head of Policy",
    role: "Manifesto Implementation",
    bio: "Designs evidence-based programs and tracks delivery milestones for education, jobs, health, and safety.",
    image: "/team/head-of-policy.svg",
  },
  {
    name: "Community Mobilization Lead",
    role: "Ward Engagement",
    bio: "Works with local leaders, youth, and women groups to collect feedback and drive participatory governance.",
    image: "/team/community-mobilization.svg",
  },
  {
    name: "Communications Manager",
    role: "Media & Public Information",
    bio: "Manages updates, project communication, and transparent public reporting across campaign channels.",
    image: "/team/communications-manager.svg",
  },
  {
    name: "Programs Coordinator",
    role: "Bursary & Social Support",
    bio: "Coordinates bursary processes and social protection initiatives to make support fair and accessible.",
    image: "/team/programs-coordinator.svg",
  },
  {
    name: "Digital & Data Lead",
    role: "Technology & Accountability",
    bio: "Builds systems for project tracking, analytics, and citizen feedback to improve service delivery.",
    image: "/team/digital-data-lead.svg",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-6xl px-4">
        <header className="mb-10 rounded-2xl bg-white p-6 shadow md:p-10">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-md-green">Who We Are</p>
          <h1 className="mb-4 text-3xl font-black text-md-dark md:text-5xl">About The Team</h1>
          <p className="max-w-3xl text-base text-gray-700 md:text-lg">
            Behind the candidate is a committed, multidisciplinary team focused on one goal: delivering practical change for Embakasi Central through transparent, measurable action.
          </p>
        </header>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <article key={member.name} className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-xl">
              <div className="h-52 bg-gray-100">
                <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
              </div>
              <div className="p-5">
                <h2 className="text-lg font-bold text-md-dark">{member.name}</h2>
                <p className="mb-3 text-sm font-semibold text-md-green">{member.role}</p>
                <p className="text-sm text-gray-700">{member.bio}</p>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
