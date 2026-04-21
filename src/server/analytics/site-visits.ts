type VisitSnapshot = {
  totalHits: number;
  uniqueVisitors: number;
  topPaths: Array<{ path: string; hits: number }>;
};

type VisitStore = {
  totalHits: number;
  visitors: Set<string>;
  pathHits: Map<string, number>;
};

declare global {
  // eslint-disable-next-line no-var
  var __mhVisitStore: VisitStore | undefined;
}

function getStore(): VisitStore {
  globalThis.__mhVisitStore ??= {
    totalHits: 0,
    visitors: new Set<string>(),
    pathHits: new Map<string, number>(),
  };

  return globalThis.__mhVisitStore;
}

export function recordVisit(path: string, visitorId: string) {
  const store = getStore();
  store.totalHits += 1;
  store.visitors.add(visitorId);

  const currentPathHits = store.pathHits.get(path) ?? 0;
  store.pathHits.set(path, currentPathHits + 1);
}

export function getVisitSnapshot(limit = 8): VisitSnapshot {
  const store = getStore();

  const topPaths = [...store.pathHits.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([path, hits]) => ({ path, hits }));

  return {
    totalHits: store.totalHits,
    uniqueVisitors: store.visitors.size,
    topPaths,
  };
}
