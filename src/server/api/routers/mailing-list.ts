import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { sendCampaignEmail } from "~/server/utils/email";

// MoveSMS API function for mass SMS
async function sendBulkSMS(phoneNumbers: string[], message: string): Promise<{ success: number; failed: number }> {
  let successCount = 0;
  let failedCount = 0;

  for (const phone of phoneNumbers) {
    try {
      const response = await fetch("https://api.movesms.io/sms/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.MOVESMS_API_KEY}`,
        },
        body: JSON.stringify({
          phone,
          message,
        }),
      });

      if (response.ok) {
        successCount++;
      } else {
        console.error(`Failed to send SMS to ${phone}:`, await response.text());
        failedCount++;
      }
    } catch (error) {
      console.error(`Error sending SMS to ${phone}:`, error);
      failedCount++;
    }
  }

  return { success: successCount, failed: failedCount };
}

function createCampaignEmailHTML(name: string, subject: string, message: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, &apos;Segoe UI&apos;, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .message { background: white; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #6b7280; }
        a { color: #10b981; text-decoration: none; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Muheshimiwa Campaign</h1>
        </div>
        <div class="content">
          <p>Habari ${name}!</p>
          <div class="message">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <p>Asante kwa kuwa sehemu ya harakati yetu ya kubuild Embakasi Central pamoja!</p>
          <p>Kwa maswali zaidi, wasiliana nasi.</p>
        </div>
        <div class="footer">
          <p>&copy; 2026 Muheshimiwa Campaign. Haki zote zimehifadhiwa.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export const mailingListRouter = createTRPCRouter({
  add: publicProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        phoneNumber: z.string().regex(/^254\d{9}$|^\+?254\d{9}$/),
        email: z.string().email().optional(),
        ward: z.string().optional(),
        ipAddress: z.string().optional(),
        deviceInfo: z.string().optional(),
        userAgent: z.string().optional(),
        source: z.string().optional(),
        metadata: z.record(z.any()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      let phoneNumber = input.phoneNumber;
      if (!phoneNumber.startsWith("254")) {
        phoneNumber = phoneNumber.replace(/^\+/, "");
      }
      if (phoneNumber.startsWith("0")) {
        phoneNumber = "254" + phoneNumber.slice(1);
      }

      const existing = await db.mailingList.findFirst({
        where: {
          OR: [
            { phoneNumber },
            ...(input.email ? [{ email: input.email }] : []),
          ],
        },
      });

      if (existing) {
        throw new Error("This contact already exists on mailing list");
      }

      const entry = await db.mailingList.create({
        data: {
          name: input.name,
          phoneNumber,
          email: input.email,
          ward: input.ward,
          ipAddress: input.ipAddress,
          deviceInfo: input.deviceInfo,
          userAgent: input.userAgent,
          source: input.source ?? "web",
          metadata: input.metadata,
          status: "active",
        },
      });

      return entry;
    }),

  getAll: protectedProcedure
    .input(
      z.object({
        status: z.enum(["active", "unsubscribed", "blocked"]).optional(),
        ward: z.string().optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      return db.mailingList.findMany({
        where: {
          ...(input.status && { status: input.status }),
          ...(input.ward && { ward: input.ward }),
          ...(input.search && {
            OR: [
              { name: { contains: input.search } },
              { phoneNumber: { contains: input.search } },
              { email: { contains: input.search } },
            ],
          }),
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  getByWard: protectedProcedure
    .input(z.object({ ward: z.string() }))
    .query(async ({ input }) => {
      return db.mailingList.findMany({
        where: {
          ward: input.ward,
          status: "active",
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  getAllWards: protectedProcedure.query(async () => {
    const wards = await db.mailingList.findMany({
      where: { status: "active" },
      select: { ward: true },
      distinct: ["ward"],
    });

    return wards.filter((w) => w.ward).map((w) => w.ward!);
  }),

  sendMassEmail: protectedProcedure
    .input(
      z.object({
        subject: z.string().min(5).max(200),
        message: z.string().min(10).max(5000),
        selectedContacts: z.array(z.string()).optional(),
        ward: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      let contacts;

      if (input.selectedContacts && input.selectedContacts.length > 0) {
        contacts = await db.mailingList.findMany({
          where: {
            id: { in: input.selectedContacts },
            email: { not: null },
          },
        });
      } else if (input.ward) {
        contacts = await db.mailingList.findMany({
          where: {
            ward: input.ward,
            status: "active",
            email: { not: null },
          },
        });
      } else {
        throw new Error("Must provide either selectedContacts or ward");
      }

      let successCount = 0;
      let failedCount = 0;

      for (const contact of contacts) {
        if (!contact.email) continue;

        try {
          const emailHTML = createCampaignEmailHTML(contact.name, input.subject, input.message);
          await sendCampaignEmail(contact.email, contact.name, input.subject, emailHTML);
          successCount++;
        } catch (error) {
          console.error(`Failed to send email to ${contact.email}:`, error);
          failedCount++;
        }
      }

      return {
        success: true,
        message: `Email campaign sent! Success: ${successCount}, Failed: ${failedCount}`,
        stats: { successCount, failedCount, totalAttempted: contacts.length },
      };
    }),

  sendMassSMS: protectedProcedure
    .input(
      z.object({
        message: z.string().min(5).max(160),
        selectedContacts: z.array(z.string()).optional(),
        ward: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      let contacts;

      if (input.selectedContacts && input.selectedContacts.length > 0) {
        contacts = await db.mailingList.findMany({
          where: {
            id: { in: input.selectedContacts },
          },
        });
      } else if (input.ward) {
        contacts = await db.mailingList.findMany({
          where: {
            ward: input.ward,
            status: "active",
          },
        });
      } else {
        throw new Error("Must provide either selectedContacts or ward");
      }

      const phoneNumbers = contacts.map((c) => c.phoneNumber);
      const result = await sendBulkSMS(phoneNumbers, input.message);

      return {
        success: true,
        message: `SMS campaign sent! Success: ${result.success}, Failed: ${result.failed}`,
        stats: result,
      };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return db.mailingList.delete({
        where: { id: input.id },
      });
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["active", "unsubscribed", "blocked"]),
      })
    )
    .mutation(async ({ input }) => {
      return db.mailingList.update({
        where: { id: input.id },
        data: { status: input.status },
      });
    }),

  getStats: protectedProcedure.query(async () => {
    const total = await db.mailingList.count();
    const active = await db.mailingList.count({
      where: { status: "active" },
    });
    const unsubscribed = await db.mailingList.count({
      where: { status: "unsubscribed" },
    });
    const blocked = await db.mailingList.count({
      where: { status: "blocked" },
    });
    const withEmail = await db.mailingList.count({
      where: { email: { not: null } },
    });

    const bySource = await db.mailingList.groupBy({
      by: ["source"],
      _count: true,
    });

    return {
      total,
      active,
      unsubscribed,
      blocked,
      withEmail,
      bySource: bySource.map((s) => ({
        source: s.source,
        count: s._count,
      })),
    };
  }),

  export: protectedProcedure
    .input(z.object({ status: z.enum(["active", "unsubscribed", "blocked"]).optional() }))
    .query(async ({ input }) => {
      const data = await db.mailingList.findMany({
        where: input.status ? { status: input.status } : undefined,
        select: {
          id: true,
          name: true,
          phoneNumber: true,
          email: true,
          ward: true,
          status: true,
          createdAt: true,
        },
      });

      return data;
    }),
});
