const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);

function normalizeBasePath(value?: string) {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return "";
  return `/${trimmed.replace(/^\/+|\/+$/g, "")}`;
}

export function getBasePath() {
  return basePath;
}

export function withBasePath(path: string) {
  if (!basePath) return path;
  if (path === "/") return basePath;
  if (!path.startsWith("/")) return path;
  if (path.startsWith(basePath)) return path;
  return `${basePath}${path}`;
}

export function withAssetPath(path: string | null | undefined) {
  if (!path) return "";
  if (/^(https?:|data:|blob:)/.test(path)) return path;
  return withBasePath(path);
}