import Link from "next/link";

const manifestoPillars = [
  {
    title: "Youth Jobs & Enterprise",
    points: [
      "Ward-level digital jobs and vocational hubs for practical skills.",
      "SME grants and low-interest revolving funds for youth and women groups.",
      "Quarterly market days to connect local businesses with buyers.",
    ],
  },
  {
    title: "Education & Bursaries",
    points: [
      "Transparent bursary tracking from application to disbursement.",
      "Increased support for needy students and school infrastructure.",
      "Mentorship and internship pipelines with private sector partners.",
    ],
  },
  {
    title: "Infrastructure & Service Delivery",
    points: [
      "Road upgrades, drainage fixes, and street lighting in high-risk areas.",
      "Reliable clean water access and better waste management systems.",
      "Public reporting dashboard for all project budgets and progress.",
    ],
  },
  {
    title: "Healthcare & Social Protection",
    points: [
      "Mobile clinics and maternal health outreach in underserved neighborhoods.",
      "Affordable preventive care campaigns and medicine access support.",
      "Special care programs for seniors and persons with disabilities.",
    ],
  },
  {
    title: "Security & Community Safety",
    points: [
      "Community policing forums coordinated with local security teams.",
      "CCTV and lighting in hotspots, schools, and public pathways.",
      "Structured youth sports and arts programs to prevent crime.",
    ],
  },
  {
    title: "Good Governance & Accountability",
    points: [
      "Open constituency budget reviews with citizens every quarter.",
      "Service charter with response timelines for key public issues.",
      "Independent citizen oversight committees per ward.",
    ],
  },
];

export default function ManifestoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-md-green/10 to-white py-12">
      <div className="mx-auto max-w-6xl px-4">
        <section className="mb-10 rounded-2xl bg-white p-6 shadow-lg md:p-10">
          <p className="mb-3 inline-flex rounded-full bg-md-green/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-md-green">
            2026 People-First Agenda
          </p>
          <h1 className="mb-4 text-3xl font-black text-md-dark md:text-5xl">Manifesto</h1>
          <p className="max-w-3xl text-base text-gray-700 md:text-lg">
            This manifesto is a practical contract with Embakasi Central residents. It focuses on measurable results, transparent implementation, and inclusive growth across all wards.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="rounded-lg bg-md-green px-5 py-2.5 text-sm font-bold text-white transition hover:bg-green-700"
            >
              View Delivered Projects
            </Link>
            <Link
              href="/about"
              className="rounded-lg border border-md-green px-5 py-2.5 text-sm font-bold text-md-green transition hover:bg-md-green hover:text-white"
            >
              Meet the Team
            </Link>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          {manifestoPillars.map((pillar) => (
            <article key={pillar.title} className="rounded-2xl bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-bold text-md-green">{pillar.title}</h2>
              <ul className="space-y-3 text-sm text-gray-700 md:text-base">
                {pillar.points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span className="font-bold text-md-green">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
