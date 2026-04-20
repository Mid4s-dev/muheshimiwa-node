import { postRouter } from "~/server/api/routers/post";
import { mailingListRouter } from "~/server/api/routers/mailing-list";
import { pollingStationRouter } from "~/server/api/routers/polling-station";
import { bursaryDistributionRouter } from "~/server/api/routers/bursary-distribution";
import { impactStoryRouter } from "~/server/api/routers/impact-story";
import { projectRouter } from "~/server/api/routers/project";
import { adminRouter } from "~/server/api/routers/admin";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  mailingList: mailingListRouter,
  pollingStation: pollingStationRouter,
  bursaryDistribution: bursaryDistributionRouter,
  impactStory: impactStoryRouter,
  project: projectRouter,
  admin: adminRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
