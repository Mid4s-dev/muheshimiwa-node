import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { sendCampaignEmail } from "~/server/utils/email";
import { env } from "~/env";

type MobitechValidateResponse = {
  status_code?: number;
  status_desc?: string;
  mobile?: string;
  network?: string;
};

type MobitechSendMultipleResponse = {
  status_code?: number;
  status_desc?: string;
  schedule_details?: Array<{
    mobile?: string;
    schedule_status?: string;
    schedule_desc?: string;
  }>;
};

type CampaignRecipient = {
  id?: string;
  name: string;
  email: string | null;
  phoneNumber: string;
};

function normalizeToKenyanMsisdn(raw: string): string {
  const digits = raw.replace(/\s+/g, "").replace(/^\+/, "");

  if (/^254\d{9}$/.test(digits)) {
    return `+${digits}`;
  }

  if (/^0\d{9}$/.test(digits)) {
    return `+254${digits.slice(1)}`;
  }

  if (/^7\d{8}$/.test(digits)) {
    return `+254${digits}`;
  }

  return raw;
}

async function validateMobileNumber(mobile: string): Promise<boolean> {
  if (!env.MOBITECH_API_KEY) {
    return true;
  }

  try {
    const response = await fetch(
      `https://app.mobitechtechnologies.com/sms/mobile?mobile=${encodeURIComponent(mobile)}&return=json`,
      {
        method: "GET",
        headers: {
          h_api_key: env.MOBITECH_API_KEY,
        },
      }
    );

    if (!response.ok) {
      return false;
    }

    const data = (await response.json()) as MobitechValidateResponse;
    return data.status_code === 1000 || !!data.mobile;
  } catch (error) {
    console.error(`Mobitech mobile validation failed for ${mobile}:`, error);
    return false;
  }
}

async function sendBulkSMS(
  phoneNumbers: string[],
  message: string
): Promise<{ success: number; failed: number }> {
  if (!env.MOBITECH_API_KEY) {
    throw new Error("Mobitech API key is missing. Set MOBITECH_API_KEY in your environment.");
  }

  const shortcode = env.MOBITECH_SHORTCODE ?? "MOBI-TECH";
  const serviceId = env.MOBITECH_SERVICE_ID ?? "0";
  const shouldValidate = env.MOBITECH_VALIDATE_NUMBERS === "true";

  const normalized = phoneNumbers.map(normalizeToKenyanMsisdn);

  const validNumbers = shouldValidate
    ? (
        await Promise.all(
          normalized.map(async (mobile) => {
            const ok = await validateMobileNumber(mobile);
            return ok ? mobile : null;
          })
        )
      ).filter((value): value is string => value !== null)
    : normalized;

  if (validNumbers.length === 0) {
    return { success: 0, failed: phoneNumbers.length };
  }

  const payload = {
    serviceId,
    shortcode,
    messages: validNumbers.map((mobile, index) => ({
      mobile,
      message,
      client_ref: `${Date.now()}-${index}`,
    })),
  };

  const response = await fetch("https://app.mobitechtechnologies.com/sms/sendmultiple", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      h_api_key: env.MOBITECH_API_KEY,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Mobitech sendmultiple failed: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as MobitechSendMultipleResponse;
  const scheduleDetails = data.schedule_details ?? [];

  if (data.status_code !== 1000) {
    const statusDesc = data.status_desc ?? "Unknown Mobitech error";
    throw new Error(`Mobitech SMS rejected request: ${statusDesc}`);
  }

  const scheduledSuccess = scheduleDetails.filter((item) => item.schedule_status === "1").length;
  const scheduledFailed = validNumbers.length - scheduledSuccess;
  const invalidCount = phoneNumbers.length - validNumbers.length;

  return {
    success: scheduledSuccess,
    failed: scheduledFailed + invalidCount,
  };
}

async function resolveRecipients(input: {
  selectedContacts?: string[];
  ward?: string;
  singleRecipientEmail?: string;
  singleRecipientPhone?: string;
  singleRecipientName?: string;
}): Promise<CampaignRecipient[]> {
  if (input.singleRecipientEmail || input.singleRecipientPhone) {
    const normalizedName = input.singleRecipientName?.trim();

    return [
      {
        name: normalizedName && normalizedName.length > 0 ? normalizedName : "Supporter",
        email: input.singleRecipientEmail ?? null,
        phoneNumber: input.singleRecipientPhone ?? "",
      },
    ];
  }

  if (input.selectedContacts && input.selectedContacts.length > 0) {
    return db.mailingList.findMany({
      where: { id: { in: input.selectedContacts }, status: "active" },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
      },
    });
  }

  if (input.ward) {
    return db.mailingList.findMany({
      where: {
        ward: input.ward,
        status: "active",
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
      },
    });
  }

  throw new Error("Provide selected contacts, ward, or a single recipient.");
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
        singleRecipientEmail: z.string().email().optional(),
        singleRecipientName: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const contacts = await resolveRecipients({
        selectedContacts: input.selectedContacts,
        ward: input.ward,
        singleRecipientEmail: input.singleRecipientEmail,
        singleRecipientName: input.singleRecipientName,
      });

      let successCount = 0;
      let failedCount = 0;
      let skippedNoEmail = 0;

      for (const contact of contacts) {
        if (!contact.email) {
          skippedNoEmail++;
          continue;
        }

        try {
          const emailHTML = createCampaignEmailHTML(contact.name, input.subject, input.message);
          const sent = await sendCampaignEmail(contact.email, contact.name, input.subject, emailHTML);
          if (sent) {
            successCount++;
          } else {
            failedCount++;
          }
        } catch (error) {
          console.error(`Failed to send email to ${contact.email}:`, error);
          failedCount++;
        }
      }

      return {
        success: true,
        message: `Email sent. Success: ${successCount}, Failed: ${failedCount}, Skipped (no email): ${skippedNoEmail}`,
        stats: {
          successCount,
          failedCount,
          skippedNoEmail,
          totalRecipients: contacts.length,
          totalAttempted: contacts.length - skippedNoEmail,
        },
      };
    }),

  sendMassSMS: protectedProcedure
    .input(
      z.object({
        message: z.string().min(5).max(160),
        selectedContacts: z.array(z.string()).optional(),
        ward: z.string().optional(),
        singleRecipientPhone: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const contacts = await resolveRecipients({
        selectedContacts: input.selectedContacts,
        ward: input.ward,
        singleRecipientPhone: input.singleRecipientPhone,
      });

      const phoneNumbers = contacts.map((c) => c.phoneNumber).filter(Boolean);
      const result = await sendBulkSMS(phoneNumbers, input.message);

      return {
        success: true,
        message: `SMS sent. Success: ${result.success}, Failed: ${result.failed}`,
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
