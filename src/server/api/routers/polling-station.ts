import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

export const pollingStationRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ ward: z.string().optional() }))
    .query(async ({ input }) => {
      return db.pollingStation.findMany({
        where: input.ward ? { ward: input.ward } : undefined,
        orderBy: { name: "asc" },
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        code: z.string().min(1),
        ward: z.string().min(1),
        location: z.string().min(1),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return db.pollingStation.create({
        data: input,
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        code: z.string().optional(),
        ward: z.string().optional(),
        location: z.string().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        status: z.string().optional(),
        voters: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return db.pollingStation.update({
        where: { id },
        data,
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return db.pollingStation.delete({
        where: { id: input.id },
      });
    }),
});
