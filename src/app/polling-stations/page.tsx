"use client";

import { useState } from "react";
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
  const [selectedWard, setSelectedWard] = useState<string | null>(null);

  const { data: stations, isLoading } = api.pollingStation.getAll.useQuery({
    ward: selectedWard ?? undefined,
  });

  const kenyanWards = [
    "Embakasi Central",
    "Embakasi East",
    "Embakasi North",
    "Embakasi South",
    "Embakasi West",
  ];

  const filteredStations = (stations ?? []).filter((station) =>
    searchQuery === ""
      ? true
      : station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          station.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getGoogleMapsLink = (station: PollingStation) => {
    if (station.latitude && station.longitude) {
      return `https://www.google.com/maps/search/?api=1&query=${station.latitude},${station.longitude}`;
    }
    return `https://www.google.com/maps/search/${encodeURIComponent(station.location)}+${encodeURIComponent(station.ward)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-md-green">Find Your Polling Station</h1>
          <p className="text-lg text-gray-600">
            Locate your nearest polling station to cast your vote on election day
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 grid gap-4 md:grid-cols-2">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-lg border-2 border-gray-300 px-4 py-3 transition focus:border-md-green focus:outline-none"
          />

          {/* Ward Filter */}
          <select
            value={selectedWard ?? ""}
            onChange={(e) => setSelectedWard(e.target.value || null)}
            className="rounded-lg border-2 border-gray-300 px-4 py-3 transition focus:border-md-green focus:outline-none"
          >
            <option value="">All Wards</option>
            {kenyanWards.map((ward) => (
              <option key={ward} value={ward}>
                {ward}
              </option>
            ))}
          </select>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center rounded-lg bg-white py-12">
              <div className="text-gray-600">Loading polling stations...</div>
            </div>
          ) : filteredStations.length === 0 ? (
            <div className="flex items-center justify-center rounded-lg bg-white py-12">
              <div className="text-center text-gray-600">
                <p className="text-lg font-semibold">No polling stations found</p>
                <p className="text-sm">Try adjusting your search or filter</p>
              </div>
            </div>
          ) : (
            filteredStations.map((station) => (
              <div key={station.id} className="rounded-lg bg-white p-6 shadow-md hover:shadow-lg transition">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Station Info */}
                  <div>
                    <h3 className="mb-2 text-xl font-bold text-md-green">{station.name}</h3>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>
                        <span className="font-semibold">Code:</span> {" "}
                        <span className="inline-block rounded-full bg-md-gold/20 px-3 py-1 text-sm font-semibold text-md-dark">
                          {station.code}
                        </span>
                      </p>
                      <p>
                        <span className="font-semibold">Ward:</span> {station.ward}
                      </p>
                      <p>
                        <span className="font-semibold">Location:</span> {station.location}
                      </p>
                      <p>
                        <span className="font-semibold">Registered Voters:</span> {" "}
                        <span className="font-bold text-md-green">{station.voters}</span>
                      </p>
                      <p>
                        <span className="font-semibold">Status:</span> {" "}
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          station.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {station.status}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Map Button */}
                  <div className="flex flex-col justify-center gap-3">
                    <a
                      href={getGoogleMapsLink(station)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-lg bg-md-green px-6 py-3 font-medium text-white hover:bg-opacity-90 transition"
                    >
                      📍 View on Google Maps
                    </a>
                    {station.latitude && station.longitude && (
                      <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
                        <p>📧 Coordinates: {station.latitude.toFixed(6)}, {station.longitude.toFixed(6)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 rounded-lg border-l-4 border-md-gold bg-yellow-50 p-6">
          <h3 className="mb-2 font-bold text-md-dark">Voting Tips</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Bring your national ID or passport on election day</li>
            <li>• Visit your assigned polling station early to avoid queues</li>
            <li>• Use Google Maps to get directions to your polling station</li>
            <li>• Voting hours are typically 6 AM to 5 PM (check your station details)</li>
            <li>• Ask poll staff if you have any questions about the voting process</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
