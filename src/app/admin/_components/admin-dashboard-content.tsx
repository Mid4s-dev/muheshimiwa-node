"use client";

import { useMemo, useState } from "react";
import { api } from "~/trpc/react";
import { MassMessagingTab } from "./mass-messaging-tab";

type AdminSection =
  | "overview"
  | "projects"
  | "polling"
  | "impact"
  | "supporters"
  | "campaigns"
  | "security";

const sections: Array<{ id: AdminSection; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "projects", label: "Projects" },
  { id: "polling", label: "Polling Stations" },
  { id: "impact", label: "Impact Stories" },
  { id: "supporters", label: "Supporters" },
  { id: "campaigns", label: "Mass Messaging" },
  { id: "security", label: "Password" },
];

function normalizeGalleryInput(value: string) {
  return value
    .split(/\n|,/)
    .map((image) => image.trim())
    .filter(Boolean);
}

function joinGalleryInput(images: string[]) {
  return images.join("\n");
}

export function AdminDashboardContent() {
  const utils = api.useUtils();
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingPollingId, setEditingPollingId] = useState<string | null>(null);

  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    category: "Infrastructure",
    image: "",
    location: "",
    ward: "",
    impact: "",
    status: "active" as "active" | "completed" | "planned",
  });

  const [projectGalleryInput, setProjectGalleryInput] = useState("");
  const [projectFeaturedUploading, setProjectFeaturedUploading] = useState(false);
  const [projectGalleryUploading, setProjectGalleryUploading] = useState(false);

  const [impactForm, setImpactForm] = useState({
    title: "",
    description: "",
    image: "",
    ward: "",
    impact: "",
    featured: true,
  });

  const [impactImageUploading, setImpactImageUploading] = useState(false);

  const [pollingForm, setPollingForm] = useState({
    name: "",
    code: "",
    ward: "Embakasi Central",
    location: "",
    latitude: "",
    longitude: "",
    voters: "0",
    status: "active" as "active" | "inactive",
  });

  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [searchTerm, setSearchTerm] = useState("");

  const { data: adminStats } = api.admin.stats.useQuery();
  const { data: projects = [] } = api.project.getAll.useQuery();
  const { data: pollingStations = [] } = api.pollingStation.getAll.useQuery({});
  const { data: impactStories = [] } = api.impactStory.getAll.useQuery({});
  const { data: supporters = [] } = api.mailingList.getAll.useQuery({ status: "active" });
  const projectGalleryImages = useMemo(
    () => normalizeGalleryInput(projectGalleryInput),
    [projectGalleryInput]
  );

  const uploadImageFile = async (file: File, folder: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await fetch("/api/media/upload", {
      method: "POST",
      body: formData,
    });

    const payload = (await response.json()) as { success: boolean; url?: string; error?: string };

    if (!response.ok || !payload.success || !payload.url) {
      throw new Error(payload.error ?? "Image upload failed");
    }

    return payload.url;
  };

  const resetProjectEditor = () => {
    setEditingProjectId(null);
    setProjectForm({
      title: "",
      description: "",
      category: "Infrastructure",
      image: "",
      location: "",
      ward: "",
      impact: "",
      status: "active",
    });
    setProjectGalleryInput("");
  };

  const createProjectMutation = api.project.create.useMutation({
    onSuccess: async () => {
      resetProjectEditor();
      await utils.project.getAll.invalidate();
      await utils.admin.stats.invalidate();
    },
  });

  const updateProjectMutation = api.project.update.useMutation({
    onSuccess: async () => {
      resetProjectEditor();
      await utils.project.getAll.invalidate();
      await utils.admin.stats.invalidate();
    },
  });

  const deleteProjectMutation = api.project.delete.useMutation({
    onSuccess: async () => {
      await utils.project.getAll.invalidate();
      await utils.admin.stats.invalidate();
    },
  });

  const resetPollingEditor = () => {
    setEditingPollingId(null);
    setPollingForm({
      name: "",
      code: "",
      ward: "Embakasi Central",
      location: "",
      latitude: "",
      longitude: "",
      voters: "0",
      status: "active",
    });
  };

  const createPollingMutation = api.pollingStation.create.useMutation({
    onSuccess: async () => {
      resetPollingEditor();
      await utils.pollingStation.getAll.invalidate();
    },
  });

  const updatePollingMutation = api.pollingStation.update.useMutation({
    onSuccess: async () => {
      resetPollingEditor();
      await utils.pollingStation.getAll.invalidate();
    },
  });

  const deletePollingMutation = api.pollingStation.delete.useMutation({
    onSuccess: async () => {
      await utils.pollingStation.getAll.invalidate();
    },
  });

  const createImpactMutation = api.impactStory.create.useMutation({
    onSuccess: async () => {
      setImpactForm({
        title: "",
        description: "",
        image: "",
        ward: "",
        impact: "",
        featured: true,
      });
      await utils.impactStory.getAll.invalidate();
      await utils.admin.stats.invalidate();
    },
  });

  const deleteImpactMutation = api.impactStory.delete.useMutation({
    onSuccess: async () => {
      await utils.impactStory.getAll.invalidate();
      await utils.admin.stats.invalidate();
    },
  });

  const passwordMutation = api.admin.changePassword.useMutation({
    onSuccess: () => {
      setSecurityForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      alert("Password updated successfully.");
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const filteredSupporters = useMemo(() => {
    if (!searchTerm.trim()) return supporters;
    const term = searchTerm.toLowerCase();

    return supporters.filter((supporter) => {
      return (
        supporter.name.toLowerCase().includes(term) ||
        supporter.phoneNumber.toLowerCase().includes(term) ||
        (supporter.email ?? "").toLowerCase().includes(term) ||
        (supporter.ward ?? "").toLowerCase().includes(term)
      );
    });
  }, [supporters, searchTerm]);

  const handleProjectSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload = {
      ...projectForm,
      galleryImages: projectGalleryImages,
    };

    if (editingProjectId) {
      await updateProjectMutation.mutateAsync({
        id: editingProjectId,
        ...payload,
      });
      return;
    }

    await createProjectMutation.mutateAsync(payload);
  };

  const handleEditProject = (project: (typeof projects)[number]) => {
    setEditingProjectId(project.id);
    setProjectForm({
      title: project.title,
      description: project.description,
      category: project.category,
      image: project.image ?? "",
      location: project.location ?? "",
      ward: project.ward ?? "",
      impact: project.impact ?? "",
      status: project.status as "active" | "completed" | "planned",
    });
    setProjectGalleryInput(joinGalleryInput(project.media?.map((item) => item.url) ?? []));
    setActiveSection("projects");
  };

  const updateGalleryImages = (nextImages: string[]) => {
    setProjectGalleryInput(joinGalleryInput(nextImages));
  };

  const moveGalleryImage = (index: number, direction: -1 | 1) => {
    const nextImages = [...projectGalleryImages];
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= nextImages.length) return;

    const currentImage = nextImages[index];
    const targetImage = nextImages[targetIndex];

    if (!currentImage || !targetImage) return;

    nextImages[index] = targetImage;
    nextImages[targetIndex] = currentImage;
    updateGalleryImages(nextImages);
  };

  const removeGalleryImage = (index: number) => {
    updateGalleryImages(projectGalleryImages.filter((_, currentIndex) => currentIndex !== index));
  };

  const handleImpactSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await createImpactMutation.mutateAsync(impactForm);
  };

  const handleEditPollingStation = (station: (typeof pollingStations)[number]) => {
    setEditingPollingId(station.id);
    setPollingForm({
      name: station.name,
      code: station.code,
      ward: station.ward,
      location: station.location,
      latitude: station.latitude?.toString() ?? "",
      longitude: station.longitude?.toString() ?? "",
      voters: station.voters.toString(),
      status: station.status === "inactive" ? "inactive" : "active",
    });
    setActiveSection("polling");
  };

  const handlePollingSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const latitude = pollingForm.latitude.trim() ? Number(pollingForm.latitude) : undefined;
    const longitude = pollingForm.longitude.trim() ? Number(pollingForm.longitude) : undefined;
    const voters = Number(pollingForm.voters);

    if (!Number.isFinite(voters) || voters < 0) {
      alert("Voters must be a valid non-negative number.");
      return;
    }

    if (pollingForm.latitude.trim() && !Number.isFinite(latitude)) {
      alert("Latitude must be a valid number.");
      return;
    }

    if (pollingForm.longitude.trim() && !Number.isFinite(longitude)) {
      alert("Longitude must be a valid number.");
      return;
    }

    const basePayload = {
      name: pollingForm.name.trim(),
      code: pollingForm.code.trim().toUpperCase(),
      ward: pollingForm.ward.trim(),
      location: pollingForm.location.trim(),
      latitude,
      longitude,
    };

    if (editingPollingId) {
      await updatePollingMutation.mutateAsync({
        id: editingPollingId,
        ...basePayload,
        voters,
        status: pollingForm.status,
      });
      return;
    }

    await createPollingMutation.mutateAsync(basePayload);
  };

  const handlePasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (securityForm.newPassword !== securityForm.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    await passwordMutation.mutateAsync({
      currentPassword: securityForm.currentPassword,
      newPassword: securityForm.newPassword,
    });
  };

  const handleProjectFeaturedUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setProjectFeaturedUploading(true);
      const url = await uploadImageFile(file, "projects/featured");
      setProjectForm((prev) => ({ ...prev, image: url }));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Featured image upload failed");
    } finally {
      setProjectFeaturedUploading(false);
      event.target.value = "";
    }
  };

  const handleProjectGalleryUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    try {
      setProjectGalleryUploading(true);
      const uploadedUrls = await Promise.all(
        files.map((file) => uploadImageFile(file, "projects/gallery"))
      );
      updateGalleryImages([...projectGalleryImages, ...uploadedUrls]);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gallery image upload failed");
    } finally {
      setProjectGalleryUploading(false);
      event.target.value = "";
    }
  };

  const handleImpactImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setImpactImageUploading(true);
      const url = await uploadImageFile(file, "impact-stories");
      setImpactForm((prev) => ({ ...prev, image: url }));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Impact image upload failed");
    } finally {
      setImpactImageUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        <aside className="hidden w-64 shrink-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:block">
          <h2 className="mb-4 text-lg font-bold text-gray-900">Admin Console</h2>
          <nav className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                  activeSection === section.id
                    ? "bg-md-green text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 space-y-6">
          <header className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-bold text-md-green">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage campaign content, supporters, communications, and security from one place.
            </p>
          </header>

          <div className="grid grid-cols-2 gap-3 md:hidden">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                  activeSection === section.id
                    ? "bg-md-green text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>

          {activeSection === "overview" && (
            <section className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <MetricCard label="Projects" value={adminStats?.projects ?? 0} tone="green" />
                <MetricCard label="Impact Stories" value={adminStats?.impactStories ?? 0} tone="blue" />
                <MetricCard label="Active Supporters" value={adminStats?.supporters ?? 0} tone="gold" />
                <MetricCard label="Total Site Hits" value={adminStats?.visits.totalHits ?? 0} tone="purple" />
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">Site Visit Tracking</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Tracking starts when server starts. Unique visitors are counted by persistent visitor cookie.
                </p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-xs uppercase text-gray-500">Unique Visitors</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {adminStats?.visits.uniqueVisitors ?? 0}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-xs uppercase text-gray-500">Top Pages</p>
                    <ul className="mt-2 space-y-1 text-sm text-gray-700">
                      {(adminStats?.visits.topPaths ?? []).map((item) => (
                        <li key={item.path} className="flex items-center justify-between">
                          <span>{item.path}</span>
                          <span className="font-semibold">{item.hits}</span>
                        </li>
                      ))}
                      {(!adminStats?.visits.topPaths || adminStats.visits.topPaths.length === 0) && (
                        <li>No page visits recorded yet.</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeSection === "projects" && (
            <section className="space-y-6">
              <form
                onSubmit={handleProjectSubmit}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {editingProjectId ? "Edit Project" : "Add Project"}
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                      {editingProjectId
                        ? "Update the project details, reorder gallery images, or remove images before saving."
                        : "Create a new project and optionally add a featured image and gallery."}
                    </p>
                  </div>
                  {editingProjectId && (
                    <button
                      type="button"
                      onClick={resetProjectEditor}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      Cancel edit
                    </button>
                  )}
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <input
                    required
                    value={projectForm.title}
                    onChange={(e) => setProjectForm((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Project title"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                  />
                  <input
                    value={projectForm.ward}
                    onChange={(e) => setProjectForm((prev) => ({ ...prev, ward: e.target.value }))}
                    placeholder="Ward (optional)"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                  />
                  <input
                    value={projectForm.location}
                    onChange={(e) => setProjectForm((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="Location (optional)"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                  />
                  <input
                    value={projectForm.category}
                    onChange={(e) => setProjectForm((prev) => ({ ...prev, category: e.target.value }))}
                    placeholder="Category"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                  />
                  <input
                    value={projectForm.impact}
                    onChange={(e) => setProjectForm((prev) => ({ ...prev, impact: e.target.value }))}
                    placeholder="Impact summary"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                  />
                  <select
                    value={projectForm.status}
                    onChange={(e) =>
                      setProjectForm((prev) => ({
                        ...prev,
                        status: e.target.value as "active" | "completed" | "planned",
                      }))
                    }
                    className="rounded-lg border border-gray-300 px-3 py-2"
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="planned">Planned</option>
                  </select>
                </div>
                <div className="mt-4 space-y-4 rounded-xl border border-dashed border-gray-300 p-4">
                  <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Featured Image URL
                      </label>
                      <input
                        value={projectForm.image}
                        onChange={(e) => setProjectForm((prev) => ({ ...prev, image: e.target.value }))}
                        placeholder="https://... or /uploads/..."
                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                      />
                    </div>
                    <label className="inline-flex cursor-pointer items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                      {projectFeaturedUploading ? "Uploading..." : "Upload featured image"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProjectFeaturedUpload}
                        className="hidden"
                        disabled={projectFeaturedUploading}
                      />
                    </label>
                  </div>

                  <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Gallery Images
                      </label>
                      <textarea
                        value={projectGalleryInput}
                        onChange={(e) => setProjectGalleryInput(e.target.value)}
                        placeholder="One URL per line or comma-separated. Uploaded files will be added here automatically."
                        rows={4}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        {projectGalleryImages.length
                          ? `${projectGalleryImages.length} gallery image(s)`
                          : "No gallery images yet"}
                      </p>
                    </div>
                    <label className="inline-flex cursor-pointer items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                      {projectGalleryUploading ? "Uploading..." : "Upload gallery images"}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleProjectGalleryUpload}
                        className="hidden"
                        disabled={projectGalleryUploading}
                      />
                    </label>
                  </div>

                  {projectGalleryImages.length > 0 && (
                    <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-sm font-semibold text-gray-800">Current gallery order</h3>
                        <button
                          type="button"
                          onClick={() => updateGalleryImages([])}
                          className="text-sm font-medium text-red-600"
                        >
                          Clear gallery
                        </button>
                      </div>
                      <div className="space-y-3">
                        {projectGalleryImages.map((image, index) => (
                          <div
                            key={`${image}-${index}`}
                            className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-3 md:flex-row md:items-center"
                          >
                            <div className="h-20 w-28 shrink-0 overflow-hidden rounded-md bg-gray-100">
                              <img
                                src={image}
                                alt={`Gallery image ${index + 1}`}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="break-all text-sm text-gray-700">{image}</p>
                              <div className="mt-2 flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() => moveGalleryImage(index, -1)}
                                  disabled={index === 0}
                                  className="rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  Move up
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveGalleryImage(index, 1)}
                                  disabled={index === projectGalleryImages.length - 1}
                                  className="rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  Move down
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeGalleryImage(index)}
                                  className="rounded-md border border-red-300 px-2 py-1 text-xs font-medium text-red-600"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <textarea
                  required
                  value={projectForm.description}
                  onChange={(e) => setProjectForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Project description"
                  rows={4}
                  className="mt-4 w-full rounded-lg border border-gray-300 px-3 py-2"
                />
                <button
                  type="submit"
                  disabled={createProjectMutation.isPending || updateProjectMutation.isPending}
                  className="mt-4 rounded-lg bg-md-green px-4 py-2 text-sm font-semibold text-white"
                >
                  {editingProjectId
                    ? updateProjectMutation.isPending
                      ? "Updating..."
                      : "Update Project"
                    : createProjectMutation.isPending
                      ? "Saving..."
                      : "Add Project"}
                </button>
              </form>

              <DataList
                title="Existing Projects"
                rows={projects.map((project) => ({
                  id: project.id,
                  title: project.title,
                  meta: `${project.category} • ${project.status}${project.ward ? ` • ${project.ward}` : ""}${project.location ? ` • ${project.location}` : ""}${project.media?.length ? ` • ${project.media.length} photo(s)` : ""}`,
                  description: project.description,
                }))}
                onEdit={(id) => {
                  const project = projects.find((item) => item.id === id);
                  if (project) {
                    handleEditProject(project);
                  }
                }}
                onDelete={(id) => deleteProjectMutation.mutate({ id })}
              />
            </section>
          )}

          {activeSection === "polling" && (
            <section className="space-y-6">
              <form
                onSubmit={handlePollingSubmit}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {editingPollingId ? "Edit Polling Station" : "Add Polling Station"}
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                      Add and maintain polling stations. In Kenya these are usually public schools, so keep school names and coordinates updated.
                    </p>
                  </div>
                  {editingPollingId && (
                    <button
                      type="button"
                      onClick={resetPollingEditor}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      Cancel edit
                    </button>
                  )}
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <input
                    required
                    value={pollingForm.name}
                    onChange={(e) => setPollingForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Station name (e.g. Kayole 1 Primary School)"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                  />
                  <input
                    required
                    value={pollingForm.code}
                    onChange={(e) => setPollingForm((prev) => ({ ...prev, code: e.target.value }))}
                    placeholder="Station code (e.g. ECS-007)"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                  />
                  <input
                    required
                    value={pollingForm.ward}
                    onChange={(e) => setPollingForm((prev) => ({ ...prev, ward: e.target.value }))}
                    placeholder="Ward"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                  />
                  <input
                    required
                    value={pollingForm.location}
                    onChange={(e) => setPollingForm((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="Location description"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                  />
                  <input
                    value={pollingForm.latitude}
                    onChange={(e) => setPollingForm((prev) => ({ ...prev, latitude: e.target.value }))}
                    placeholder="Latitude (optional)"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                  />
                  <input
                    value={pollingForm.longitude}
                    onChange={(e) => setPollingForm((prev) => ({ ...prev, longitude: e.target.value }))}
                    placeholder="Longitude (optional)"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                  />
                  <input
                    type="number"
                    min={0}
                    value={pollingForm.voters}
                    onChange={(e) => setPollingForm((prev) => ({ ...prev, voters: e.target.value }))}
                    placeholder="Registered voters"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                  />
                  <select
                    value={pollingForm.status}
                    onChange={(e) =>
                      setPollingForm((prev) => ({
                        ...prev,
                        status: e.target.value as "active" | "inactive",
                      }))
                    }
                    className="rounded-lg border border-gray-300 px-3 py-2"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={createPollingMutation.isPending || updatePollingMutation.isPending}
                  className="mt-4 rounded-lg bg-md-green px-4 py-2 text-sm font-semibold text-white"
                >
                  {editingPollingId
                    ? updatePollingMutation.isPending
                      ? "Updating..."
                      : "Update Polling Station"
                    : createPollingMutation.isPending
                      ? "Saving..."
                      : "Add Polling Station"}
                </button>
              </form>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">Existing Polling Stations</h2>
                <div className="mt-4 space-y-3">
                  {pollingStations.map((station) => (
                    <div key={station.id} className="rounded-lg border border-gray-200 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{station.name}</h3>
                          <p className="mt-1 text-xs text-gray-500">
                            {station.code} • {station.ward} • {station.location}
                          </p>
                          <p className="mt-2 text-sm text-gray-700">
                            {station.voters} voters
                            {typeof station.latitude === "number" && typeof station.longitude === "number"
                              ? ` • ${station.latitude.toFixed(5)}, ${station.longitude.toFixed(5)}`
                              : " • no coordinates"}
                            {` • ${station.status}`}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditPollingStation(station)}
                            className="rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deletePollingMutation.mutate({ id: station.id })}
                            className="rounded-md border border-red-300 px-2 py-1 text-xs font-medium text-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {pollingStations.length === 0 && (
                    <p className="text-sm text-gray-500">No polling stations yet.</p>
                  )}
                </div>
              </div>
            </section>
          )}

          {activeSection === "impact" && (
            <section className="space-y-6">
              <form
                onSubmit={handleImpactSubmit}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <h2 className="text-lg font-semibold text-gray-900">Add Impact Story</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <input
                    required
                    value={impactForm.title}
                    onChange={(e) => setImpactForm((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Story title"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                  />
                  <input
                    value={impactForm.ward}
                    onChange={(e) => setImpactForm((prev) => ({ ...prev, ward: e.target.value }))}
                    placeholder="Ward (optional)"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                  />
                  <input
                    value={impactForm.impact}
                    onChange={(e) => setImpactForm((prev) => ({ ...prev, impact: e.target.value }))}
                    placeholder="Impact metric"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                  />
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={impactForm.featured}
                      onChange={(e) => setImpactForm((prev) => ({ ...prev, featured: e.target.checked }))}
                    />
                    Featured story
                  </label>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Story Image URL</label>
                    <input
                      value={impactForm.image}
                      onChange={(e) => setImpactForm((prev) => ({ ...prev, image: e.target.value }))}
                      placeholder="https://... or /uploads/..."
                      className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <label className="inline-flex cursor-pointer items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                    {impactImageUploading ? "Uploading..." : "Upload story image"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImpactImageUpload}
                      className="hidden"
                      disabled={impactImageUploading}
                    />
                  </label>
                </div>
                <textarea
                  required
                  value={impactForm.description}
                  onChange={(e) => setImpactForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Story description"
                  rows={4}
                  className="mt-4 w-full rounded-lg border border-gray-300 px-3 py-2"
                />
                <button
                  type="submit"
                  disabled={createImpactMutation.isPending}
                  className="mt-4 rounded-lg bg-md-green px-4 py-2 text-sm font-semibold text-white"
                >
                  {createImpactMutation.isPending ? "Saving..." : "Add Impact Story"}
                </button>
              </form>

              <DataList
                title="Impact Stories"
                rows={impactStories.map((story) => ({
                  id: story.id,
                  title: story.title,
                  meta: `${story.status}${story.ward ? ` • ${story.ward}` : ""}${story.image ? " • has image" : ""}`,
                  description: story.description,
                }))}
                onDelete={(id) => deleteImpactMutation.mutate({ id })}
              />
            </section>
          )}

          {activeSection === "supporters" && (
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Registered Supporters</h2>
              <p className="mt-1 text-sm text-gray-600">
                Search and review supporters collected through registration forms.
              </p>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, phone, email, or ward"
                className="mt-4 w-full rounded-lg border border-gray-300 px-3 py-2"
              />
              <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left">Name</th>
                      <th className="px-3 py-2 text-left">Phone</th>
                      <th className="px-3 py-2 text-left">Email</th>
                      <th className="px-3 py-2 text-left">Ward</th>
                      <th className="px-3 py-2 text-left">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSupporters.map((supporter) => (
                      <tr key={supporter.id} className="border-t border-gray-200">
                        <td className="px-3 py-2">{supporter.name}</td>
                        <td className="px-3 py-2">{supporter.phoneNumber}</td>
                        <td className="px-3 py-2">{supporter.email ?? "-"}</td>
                        <td className="px-3 py-2">{supporter.ward ?? "-"}</td>
                        <td className="px-3 py-2">
                          {new Date(supporter.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                    {filteredSupporters.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-3 py-6 text-center text-gray-500">
                          No supporters match your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeSection === "campaigns" && (
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Mass Email and SMS</h2>
              <MassMessagingTab />
            </section>
          )}

          {activeSection === "security" && (
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
              <p className="mt-1 text-sm text-gray-600">Update your admin password securely.</p>
              <form onSubmit={handlePasswordSubmit} className="mt-4 max-w-lg space-y-3">
                <input
                  type="password"
                  required
                  value={securityForm.currentPassword}
                  onChange={(e) =>
                    setSecurityForm((prev) => ({ ...prev, currentPassword: e.target.value }))
                  }
                  placeholder="Current password"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={securityForm.newPassword}
                  onChange={(e) =>
                    setSecurityForm((prev) => ({ ...prev, newPassword: e.target.value }))
                  }
                  placeholder="New password"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={securityForm.confirmPassword}
                  onChange={(e) =>
                    setSecurityForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                  }
                  placeholder="Confirm new password"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
                <button
                  type="submit"
                  disabled={passwordMutation.isPending}
                  className="rounded-lg bg-md-green px-4 py-2 text-sm font-semibold text-white"
                >
                  {passwordMutation.isPending ? "Updating..." : "Change Password"}
                </button>
              </form>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "green" | "blue" | "gold" | "purple";
}) {
  const toneClass = {
    green: "text-green-700 bg-green-50",
    blue: "text-blue-700 bg-blue-50",
    gold: "text-yellow-700 bg-yellow-50",
    purple: "text-purple-700 bg-purple-50",
  }[tone];

  return (
    <div className={`rounded-xl border border-gray-200 p-4 ${toneClass}`}>
      <p className="text-xs uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

function DataList({
  title,
  rows,
  onEdit,
  onDelete,
}: {
  title: string;
  rows: Array<{ id: string; title: string; meta: string; description: string }>;
  onEdit?: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <div className="mt-4 space-y-3">
        {rows.map((row) => (
          <div key={row.id} className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-gray-900">{row.title}</h3>
                <p className="mt-1 text-xs text-gray-500">{row.meta}</p>
                <p className="mt-2 text-sm text-gray-700">{row.description}</p>
              </div>
              <button
                onClick={() => onDelete(row.id)}
                className="rounded-md border border-red-300 px-2 py-1 text-xs font-medium text-red-600"
              >
                Delete
              </button>
              {onEdit && (
                <button
                  onClick={() => onEdit(row.id)}
                  className="rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-gray-500">No records yet.</p>}
      </div>
    </div>
  );
}
