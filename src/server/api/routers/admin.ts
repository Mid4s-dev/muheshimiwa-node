import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getVisitSnapshot } from "~/server/analytics/site-visits";
import { hashAdminPassword, verifyAdminPassword } from "~/server/utils/admin-auth";
import {
  getSmtpSettingsSnapshot,
  sendSmtpTestEmail,
  updateRuntimeSmtpSettings,
} from "~/server/utils/email";

export const adminRouter = createTRPCRouter({
  stats: protectedProcedure.query(async ({ ctx }) => {
    const [projects, impactStories, supporters] = await Promise.all([
      ctx.db.project.count(),
      ctx.db.impactStory.count(),
      ctx.db.mailingList.count({ where: { status: "active" } }),
    ]);

    return {
      projects,
      impactStories,
      supporters,
      visits: getVisitSnapshot(),
    };
  }),

  changePassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string().min(1),
        newPassword: z.string().min(8),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const user = await ctx.db.user.findUnique({ where: { id: userId } });

      if (user?.role !== "admin") {
        throw new Error("Admin account not found");
      }

      if (!user.passwordHash || !verifyAdminPassword(input.currentPassword, user.passwordHash)) {
        throw new Error("Current password is incorrect");
      }

      await ctx.db.user.update({
        where: { id: user.id },
        data: { passwordHash: hashAdminPassword(input.newPassword) },
      });

      return { success: true };
    }),

  getSmtpSettings: protectedProcedure.query(() => {
    return getSmtpSettingsSnapshot();
  }),

  updateSmtpSettings: protectedProcedure
    .input(
      z.object({
        host: z.string().min(1),
        port: z.number().int().min(1).max(65535),
        secure: z.boolean(),
        user: z.string().min(1),
        password: z.string().optional(),
        from: z.string().email(),
      })
    )
    .mutation(({ input }) => {
      updateRuntimeSmtpSettings(input);
      return {
        success: true,
        message: "SMTP settings updated for current runtime.",
        settings: getSmtpSettingsSnapshot(),
      };
    }),

  sendSmtpTest: protectedProcedure
    .input(
      z.object({
        to: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await sendSmtpTestEmail(input.to);
      if (!result.success) {
        throw new Error(result.error ?? "SMTP test failed");
      }

      return {
        success: true,
        message: `SMTP test email sent to ${input.to}`,
      };
    }),
});
