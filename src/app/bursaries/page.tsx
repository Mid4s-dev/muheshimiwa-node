import { api } from "~/trpc/server";
import { BursaryCountdown } from "./_components/bursary-countdown";

export const revalidate = 0;

export default async function BursariesPage() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const bursaries = await api.bursaryDistribution.getAll();
  const now = new Date();
  const nearestDistribution = bursaries
    .filter((item) => item.status !== "completed" && new Date(item.distributionDate) >= now)
    .sort((left, right) => new Date(left.distributionDate).getTime() - new Date(right.distributionDate).getTime())[0]
    ?? bursaries
      .slice()
      .sort((left, right) => new Date(left.distributionDate).getTime() - new Date(right.distributionDate).getTime())[0];

  return (
    <main className="min-h-screen bg-gradient-to-b from-md-green/10 via-white to-white py-12">
      <div className="mx-auto max-w-6xl px-4">
        <header className="mb-10 grid gap-6 overflow-hidden rounded-[2rem] border border-white/20 bg-gradient-to-br from-md-green via-emerald-600 to-md-dark p-6 text-white shadow-xl md:grid-cols-[1.15fr_0.85fr] md:p-10">
          <div className="space-y-4">
            <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-md-gold">
              Education Support
            </p>
            <div>
              <h1 className="text-4xl font-black md:text-5xl">Bursaries</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/85 md:text-lg">
                Track bursary distributions, upcoming deadlines, and constituency support for learners across Embakasi Central.
              </p>
            </div>

            {nearestDistribution ? (
              <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/65">Nearest venue</p>
                  <p className="mt-1 text-lg font-bold text-white">{nearestDistribution.location}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/65">Ward</p>
                  <p className="mt-1 text-lg font-bold text-white">{nearestDistribution.ward}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/65">Distribution date</p>
                  <p className="mt-1 text-lg font-bold text-white">
                    {new Date(nearestDistribution.distributionDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="self-center">
            {nearestDistribution ? (
              <BursaryCountdown targetDate={nearestDistribution.distributionDate.toISOString()} />
            ) : (
              <div className="rounded-3xl border border-white/15 bg-white/10 p-6 text-center backdrop-blur">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-md-gold">Countdown</p>
                <p className="mt-2 text-xl font-bold text-white">No upcoming bursary date yet</p>
                <p className="mt-2 text-sm text-white/75">
                  Add a pending bursary distribution to show the next countdown here.
                </p>
              </div>
            )}
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          {bursaries.map((item) => (
            <article key={item.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-gray-900">{item.location}</h2>
                <span className="rounded-full bg-md-green/10 px-3 py-1 text-xs font-semibold text-md-green capitalize">
                  {item.status}
                </span>
              </div>
              <p className="mb-2 text-sm font-semibold text-gray-600">Ward: {item.ward}</p>
              <p className="mb-3 text-sm text-gray-700">{item.description ?? "No description available."}</p>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-semibold">Distribution:</span> {new Date(item.distributionDate).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold">Deadline:</span> {new Date(item.deadline).toLocaleDateString()}
                </p>
              </div>
            </article>
          ))}

          {bursaries.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
              No bursary records available yet.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}