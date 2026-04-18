"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    ward: "",
    email: "",
  });
  const [submittedName, setSubmittedName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerMutation = api.mailingList.add.useMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim() || formData.name.length < 2) {
      setError("Please enter a valid name (at least 2 characters)");
      return;
    }

    if (!formData.phone.startsWith("254") || formData.phone.length !== 12) {
      setError("Please enter a valid Kenyan phone number (e.g., 254712345678)");
      return;
    }

    if (!formData.ward.trim()) {
      setError("Please select your ward");
      return;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      await registerMutation.mutateAsync({
        name: formData.name,
        phoneNumber: formData.phone,
        ward: formData.ward,
        email: formData.email || undefined,
        source: "register-page",
      });

      setSubmittedName(formData.name);
      setSubmitted(true);
      setFormData({ name: "", phone: "", ward: "", email: "" });

      // Auto-redirect after 3 seconds
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Signup failed. Please try again.";
      setError(errorMessage);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-md-green/10 to-white px-4">
        <div className="rounded-lg bg-white p-8 text-center shadow-lg">
          <h1 className="mb-4 text-3xl font-bold text-md-green">
            Uko ndani. Welcome to the movement.
          </h1>
          <p className="mb-6 text-gray-700">
            Asante {submittedName || "champ"}. You are now on the Muheshimiwa supporter list for
            Embakasi Central updates.
          </p>
          <p className="text-sm text-gray-600">
            Uko kadi? Keep your phone on. We will send campaign updates by SMS{formData.email && " and email"}.
          </p>
          <p className="mt-4 text-xs text-gray-500">
            Redirecting you to home in a few seconds...
          </p>
        </div>
      </div>
    );
  }

  const kenyanWards = [
    "Embakasi Central",
    "Embakasi East",
    "Embakasi North",
    "Embakasi South",
    "Embakasi West",
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-md-green/10 to-white px-4 py-12">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-md-green">Join The Supporter List</h1>
          <p className="text-gray-600">Third term movement updates for Embakasi Central</p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border-l-4 border-red-500 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-semibold text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 transition focus:border-md-green focus:outline-none"
              required
            />
          </div>

          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-gray-700">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center rounded-lg border-2 border-gray-300 transition focus-within:border-md-green">
              <span className="px-4 py-3 text-gray-600 font-medium">+</span>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="254712345678"
                className="w-full border-0 py-3 pr-4 focus:outline-none"
                required
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Format: 254712345678 (with country code)</p>
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-700">
              Email Address <span className="text-gray-400">(optional)</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 transition focus:border-md-green focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">Optional. Used for campaign briefings and event reminders.</p>
          </div>

          {/* Ward Field */}
          <div>
            <label htmlFor="ward" className="mb-2 block text-sm font-semibold text-gray-700">
              Your Ward <span className="text-red-500">*</span>
            </label>
            <select
              id="ward"
              name="ward"
              value={formData.ward}
              onChange={handleChange}
              className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 transition focus:border-md-green focus:outline-none"
              required
            >
              <option value="">Select your ward...</option>
              {kenyanWards.map((ward) => (
                <option key={ward} value={ward}>
                  {ward}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full rounded-lg bg-md-green px-6 py-3 font-bold text-white transition hover:bg-green-700 disabled:bg-gray-400"
          >
            {registerMutation.isPending ? "Joining..." : "Join Supporter List"}
          </button>

          {/* Terms */}
          <p className="text-center text-xs text-gray-500">
            By joining, you agree to receive campaign updates via SMS and email from the Muheshimiwa campaign.
          </p>
        </form>
      </div>
    </div>
  );
}
