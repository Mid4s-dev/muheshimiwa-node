import { api } from "~/trpc/server";

export const revalidate = 0;

export default async function BursariesPage() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const bursaries = await api.bursaryDistribution.getAll();

  return (
    <main className="min-h-screen bg-gradient-to-b from-md-green/10 via-white to-white py-12">
      <div className="mx-auto max-w-6xl px-4">
        <header className="mb-10 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-md-green">Education Support</p>
          <h1 className="mb-4 text-4xl font-bold text-md-green md:text-5xl">Bursaries</h1>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Track bursary distributions, upcoming deadlines, and constituency support for learners across Embakasi Central.
          </p>
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