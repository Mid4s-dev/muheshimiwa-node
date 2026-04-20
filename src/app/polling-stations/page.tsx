"use client";

import { useMemo, useState } from "react";
import { api } from "~/trpc/react";

type PollingStation = {
  id: string;
  name: string;
  code: string;
  ward: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  voters: number;
  status: string;
};

export default function PollingStationsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: stations, isLoading } = api.pollingStation.getAll.useQuery({
    ward: "Embakasi Central",
  });

  const allStations = (stations ?? []) as PollingStation[];

  const filteredStations = useMemo(
    () =>
      allStations.filter((station) => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) {
          return true;
        }

        return [station.name, station.code, station.location, station.ward]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query));
      }),
    [allStations, searchQuery]
  );

  const schoolBasedCount = filteredStations.length;

  const getGoogleMapsLink = (station: PollingStation) => {
    if (station.latitude && station.longitude) {
      return `https://www.google.com/maps/search/?api=1&query=${station.latitude},${station.longitude}`;
    }

    return `https://www.google.com/maps/search/${encodeURIComponent(station.location)}+${encodeURIComponent(station.ward)}`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-md-green/10 via-white to-white py-12">
      <div className="mx-auto max-w-7xl px-4">
        <header className="mb-8 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-md-green">Embakasi Central</p>
          <h1 className="mb-4 text-4xl font-bold text-md-green md:text-5xl">Polling stations</h1>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Find your polling station quickly and open directions in Google Maps.
          </p>
        </header>

        <div className="mb-8 grid gap-4 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-3">
          <label className="md:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-gray-700">Search stations</span>
            <input
              type="text"
              placeholder="Search by school name, code, or location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3 transition focus:border-md-green focus:outline-none"
            />
          </label>

          <div className="rounded-2xl bg-gradient-to-br from-md-green to-green-700 p-4 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">Coverage</p>
            <div className="mt-2 text-3xl font-black">{schoolBasedCount}</div>
            <p className="text-sm text-white/85">Stations listed for Embakasi Central</p>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {isLoading ? (
            <div className="col-span-full rounded-3xl bg-white py-16 text-center shadow-sm">
              <div className="text-gray-600">Loading polling stations...</div>
            </div>
          ) : filteredStations.length === 0 ? (
            <div className="col-span-full rounded-3xl bg-white py-16 text-center shadow-sm">
              <p className="text-lg font-semibold text-gray-900">No polling stations found</p>
              <p className="text-sm text-gray-600">Try a different search term or update the station records in admin.</p>
            </div>
          ) : (
            filteredStations.map((station) => (
              <article key={station.id} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-md-dark">{station.name}</h2>
                    <p className="text-sm font-semibold text-md-green">{station.ward}</p>
                  </div>
                  <span className="rounded-full bg-md-gold/20 px-3 py-1 text-xs font-bold text-md-dark">
                    {station.code}
                  </span>
                </div>

                <p className="mb-4 text-sm leading-6 text-gray-700">{station.location}</p>

                <div className="mb-4 grid gap-2 text-sm text-gray-600">
                  <p>
                    <span className="font-semibold">Registered voters:</span> {station.voters}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span> {station.status}
                  </p>
                  <p>
                    <span className="font-semibold">Coordinates:</span>{" "}
                    {station.latitude && station.longitude
                      ? `${station.latitude.toFixed(6)}, ${station.longitude.toFixed(6)}`
                      : "Not available"}
                  </p>
                </div>

                <a
                  href={getGoogleMapsLink(station)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl bg-md-green px-5 py-3 text-sm font-bold text-white transition hover:bg-green-700"
                >
                  View on Google Maps
                </a>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}