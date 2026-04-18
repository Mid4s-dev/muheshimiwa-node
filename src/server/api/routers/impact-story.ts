import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

export const impactStoryRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        status: z.enum(["active", "inactive"]).optional(),
        featured: z.boolean().optional(),
      })
    )
    .query(async ({ input }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
      return db.impactStory.findMany({
        where: {
          ...(input.status && { status: input.status }),
          ...(input.featured !== undefined && { featured: input.featured }),
        },
        orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        image: z.string().optional(),
        impact: z.string().optional(),
        ward: z.string().optional(),
        featured: z.boolean().optional(),
        order: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
      return db.impactStory.create({
        data: input,
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        image: z.string().optional(),
        impact: z.string().optional(),
        ward: z.string().optional(),
        status: z.enum(["active", "inactive"]).optional(),
        featured: z.boolean().optional(),
        order: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
      return db.impactStory.update({
        where: { id },
        data,
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
      return db.impactStory.delete({
        where: { id: input.id },
      });
    }),

  getFeatured: publicProcedure.query(async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    return db.impactStory.findMany({
      where: { status: "active", featured: true },
      orderBy: { order: "asc" },
      take: 6,
    });
  }),
});
