import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

export const projectRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z
        .object({
          category: z.string().optional(),
          ward: z.string().optional(),
          status: z.enum(["active", "completed", "planned"]).optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      return db.project.findMany({
        where: {
          ...(input?.category && { category: input.category }),
          ...(input?.ward && { ward: input.ward }),
          ...(input?.status && { status: input.status }),
        },
        orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return db.project.findUnique({
        where: { id: input.id },
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(3),
        description: z.string().min(10),
        category: z.string().min(2),
        image: z.string().optional(),
        status: z.enum(["active", "completed", "planned"]).optional(),
        ward: z.string().optional(),
        impact: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return db.project.create({
        data: {
          ...input,
          image: input.image ?? undefined,
          ward: input.ward ?? undefined,
          impact: input.impact ?? undefined,
          status: input.status ?? "active",
        },
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(3).optional(),
        description: z.string().min(10).optional(),
        category: z.string().min(2).optional(),
        image: z.string().optional(),
        status: z.enum(["active", "completed", "planned"]).optional(),
        ward: z.string().optional(),
        impact: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return db.project.update({
        where: { id },
        data,
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return db.project.delete({
        where: { id: input.id },
      });
    }),
});
