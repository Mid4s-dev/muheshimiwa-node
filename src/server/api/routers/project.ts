import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

const optionalString = z.string().optional();

function normalizeOptionalString(value?: string | null) {
  const normalized = value?.trim();
  return normalized;
}

function normalizeGalleryImages(images?: Array<string | null | undefined>) {
  return (images ?? [])
    .map((image) => image?.trim())
    .filter((image): image is string => !!image);
}

function isMissingMediaRelationError(error: unknown) {
  if (!(error instanceof Error)) return false;

  return (
    error.message.includes("Unknown field `media`") ||
    error.message.includes("Unknown argument `media`")
  );
}

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
      const where = {
        ...(input?.category && { category: input.category }),
        ...(input?.ward && { ward: input.ward }),
        ...(input?.status && { status: input.status }),
      };

      try {
        return await db.project.findMany({
          where,
          include: {
            media: {
              orderBy: { sortOrder: "asc" },
            },
          },
          orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
        });
      } catch (error) {
        if (!isMissingMediaRelationError(error)) {
          throw error;
        }

        const projects = await db.project.findMany({
          where,
          orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
        });

        return projects.map((project) => ({ ...project, media: [] }));
      }
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        return await db.project.findUnique({
          where: { id: input.id },
          include: {
            media: {
              orderBy: { sortOrder: "asc" },
            },
          },
        });
      } catch (error) {
        if (!isMissingMediaRelationError(error)) {
          throw error;
        }

        const project = await db.project.findUnique({
          where: { id: input.id },
        });

        if (!project) return null;
        return { ...project, media: [] };
      }
    }),

  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(3),
        description: z.string().min(10),
        category: z.string().min(2),
        image: optionalString,
        galleryImages: z.array(z.string().trim().min(1)).optional(),
        status: z.enum(["active", "completed", "planned"]).optional(),
        ward: optionalString,
        location: optionalString,
        impact: optionalString,
      })
    )
    .mutation(async ({ input }) => {
      const galleryImages = normalizeGalleryImages(input.galleryImages);
      const data = {
        title: input.title,
        description: input.description,
        category: input.category,
        image: normalizeOptionalString(input.image),
        ward: normalizeOptionalString(input.ward),
        location: normalizeOptionalString(input.location),
        impact: normalizeOptionalString(input.impact),
        status: input.status ?? "active",
        media: galleryImages.length
          ? {
              create: galleryImages.map((url, index) => ({
                url,
                sortOrder: index,
              })),
            }
          : undefined,
      };

      try {
        return await db.project.create({
          data,
          include: {
            media: {
              orderBy: { sortOrder: "asc" },
            },
          },
        });
      } catch (error) {
        if (!isMissingMediaRelationError(error)) {
          throw error;
        }

        const project = await db.project.create({
          data: {
            ...data,
            media: undefined,
          },
        });

        return { ...project, media: [] };
      }
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(3).optional(),
        description: z.string().min(10).optional(),
        category: z.string().min(2).optional(),
        image: optionalString,
        galleryImages: z.array(z.string().trim().min(1)).optional(),
        status: z.enum(["active", "completed", "planned"]).optional(),
        ward: optionalString,
        location: optionalString,
        impact: optionalString,
      })
    )
    .mutation(async ({ input }) => {
      const { id, galleryImages, ...data } = input;
      const normalizedData = {
        ...data,
        image: normalizeOptionalString(data.image),
        ward: normalizeOptionalString(data.ward),
        location: normalizeOptionalString(data.location),
        impact: normalizeOptionalString(data.impact),
      };

      const updateData = {
        ...normalizedData,
        ...(galleryImages !== undefined
          ? {
              media: {
                deleteMany: {},
                create: normalizeGalleryImages(galleryImages).map((url, index) => ({
                  url,
                  sortOrder: index,
                })),
              },
            }
          : {}),
      };

      try {
        return await db.project.update({
          where: { id },
          data: updateData,
          include: {
            media: {
              orderBy: { sortOrder: "asc" },
            },
          },
        });
      } catch (error) {
        if (!isMissingMediaRelationError(error)) {
          throw error;
        }

        const project = await db.project.update({
          where: { id },
          data: {
            ...normalizedData,
          },
        });

        return { ...project, media: [] };
      }
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return db.project.delete({
        where: { id: input.id },
      });
    }),
});
