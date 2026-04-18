import Link from "next/link";

export function AdminDashboardContent() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12">
          <h1 className="mb-2 text-4xl font-bold text-md-green">Admin Dashboard</h1>
          <p className="text-gray-600">Campaign analytics and content management</p>
        </div>

        <div className="mb-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-sm text-gray-600">Content</p>
            <p className="mt-2 text-2xl font-bold text-md-green">Projects & updates</p>
            <p className="mt-2 text-xs text-gray-500">Manage the public campaign pages</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-sm text-gray-600">Community</p>
            <p className="mt-2 text-2xl font-bold text-md-gold">Mailing list</p>
            <p className="mt-2 text-xs text-gray-500">Supporter registrations remain active</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-sm text-gray-600">Operations</p>
            <p className="mt-2 text-2xl font-bold text-green-600">Polling stations</p>
            <p className="mt-2 text-xs text-gray-500">Use station data for outreach</p>
          </div>
        </div>

        <div className="mb-12 rounded-lg bg-white shadow">
          <div className="border-b p-6">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
          </div>
          <div className="grid gap-6 p-6 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900">Public pages</h3>
              <p className="mt-2 text-sm text-gray-600">
                Update projects, impact stories, and polling station data from the connected routers.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/projects" className="rounded-md bg-md-green px-4 py-2 text-sm font-semibold text-white">
                  Open Projects
                </Link>
                <Link href="/polling-stations" className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700">
                  Open Stations
                </Link>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900">Retired modules</h3>
              <p className="mt-2 text-sm text-gray-600">
                Voter registration analytics and bursary application tracking have been removed from the application.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-lg bg-white shadow">
          <div className="border-b p-6">
            <h2 className="text-2xl font-bold text-gray-900">Admin Notes</h2>
          </div>
          <div className="p-6 text-sm text-gray-600">
            The dashboard now focuses on campaign content, projects, and outreach tools only.
          </div>
        </div>
      </div>
    </div>
  );
}