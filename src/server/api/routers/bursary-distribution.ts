import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

export const bursaryDistributionRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return db.bursaryDistribution.findMany({
      orderBy: { distributionDate: "asc" },
    });
  }),

  getByWard: publicProcedure
    .input(z.object({ ward: z.string() }))
    .query(async ({ input }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      return db.bursaryDistribution.findMany({
        where: { ward: input.ward },
        orderBy: { distributionDate: "asc" },
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        location: z.string().min(1),
        ward: z.string().min(1),
        distributionDate: z.date(),
        deadline: z.date(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      return db.bursaryDistribution.create({
        data: input,
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        location: z.string().optional(),
        ward: z.string().optional(),
        distributionDate: z.date().optional(),
        deadline: z.date().optional(),
        description: z.string().optional(),
        status: z.enum(["pending", "ongoing", "completed"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      return db.bursaryDistribution.update({
        where: { id },
        data,
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      return db.bursaryDistribution.delete({
        where: { id: input.id },
      });
    }),

  getStats: publicProcedure.query(async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const total = await db.bursaryDistribution.count();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const upcoming = await db.bursaryDistribution.count({
      where: { status: "pending" },
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const ongoing = await db.bursaryDistribution.count({
      where: { status: "ongoing" },
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return { total, upcoming, ongoing };
  }),
});
