import nodemailer from "nodemailer";
import { env } from "~/env";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;

  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASSWORD) {
    console.warn("SMTP credentials not configured. Email sending disabled.");
    return null;
  }

  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: parseInt(env.SMTP_PORT ?? "587"),
    secure: env.SMTP_PORT === "465",
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD,
    },
  });

  return transporter;
}

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    const transport = getTransporter();
    if (!transport) {
      console.warn(`Email not sent to ${email} - SMTP not configured`);
      return false;
    }

    const mailOptions = {
      from: env.SMTP_FROM ?? "noreply@muheshimiwa.com",
      to: email,
      subject: "Welcome to Muheshimiwa Campaign!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(to right, #10b981, #059669); padding: 20px; color: white; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Karibu! Welcome</h1>
          </div>
          <div style="padding: 30px; background-color: #f9fafb; border-radius: 0 0 8px 8px;">
            <p style="font-size: 16px; color: #333; margin: 0 0 20px 0;">
              Habari ${name}!
            </p>
            <p style="font-size: 14px; color: #666; line-height: 1.6; margin: 0 0 20px 0;">
              Thank you for registering with the Muheshimiwa Campaign! We&apos;re excited to have you as part of our community working to build a better Embakasi Central.
            </p>
            <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="font-size: 14px; color: #059669; margin: 0;">
                <strong>📱 Next Steps:</strong><br/>
                You&apos;ll receive important updates about our initiatives via SMS. Make sure to keep your phone number active to stay informed!
              </p>
            </div>
            <p style="font-size: 13px; color: #999; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
              Best regards,<br/>
              The Muheshimiwa Team<br/>
              <em>Building a better future for Embakasi Central</em>
            </p>
          </div>
        </div>
      `,
    };

    await transport.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

export async function sendRegistrationConfirmation(
  email: string,
  name: string,
  phone: string,
  ward: string
) {
  try {
    const transport = getTransporter();
    if (!transport) {
      console.warn(`Email not sent to ${email} - SMTP not configured`);
      return false;
    }

    const mailOptions = {
      from: env.SMTP_FROM ?? "noreply@muheshimiwa.com",
      to: email,
      subject: "Registration Confirmation - Muheshimiwa Campaign",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(to right, #10b981, #059669); padding: 20px; color: white; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">✓ Registration Confirmed</h1>
          </div>
          <div style="padding: 30px; background-color: #f9fafb; border-radius: 0 0 8px 8px;">
            <p style="font-size: 16px; color: #333; margin: 0 0 20px 0;">
              Thank you for registering, ${name}!
            </p>
            <div style="background: white; padding: 20px; border: 1px solid #e5e7eb; border-radius: 6px; margin: 20px 0;">
              <p style="font-size: 13px; color: #666; margin: 0 0 10px 0;"><strong>Your Registration Details:</strong></p>
              <table style="width: 100%; font-size: 14px; color: #333;">
                <tr>
                  <td style="padding: 8px 0; width: 30%;"><strong>Name:</strong></td>
                  <td style="padding: 8px 0;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>Phone:</strong></td>
                  <td style="padding: 8px 0;">${phone}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>Ward:</strong></td>
                  <td style="padding: 8px 0;">${ward}</td>
                </tr>
              </table>
            </div>
            <p style="font-size: 14px; color: #666; line-height: 1.6;">
              You&apos;re now part of our community! Watch your SMS for updates about our initiatives and how you can get involved in building a better future for Embakasi Central.
            </p>
          </div>
        </div>
      `,
    };

    await transport.sendMail(mailOptions);
    console.log(`Registration confirmation sent to ${email}`);
    return true;
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    return false;
  }
}

export async function sendCampaignEmail(
  email: string,
  name: string,
  subject: string,
  htmlContent: string
) {
  try {
    const transport = getTransporter();
    if (!transport) {
      console.warn(`Campaign email not sent to ${email} - SMTP not configured`);
      return false;
    }

    const mailOptions = {
      from: env.SMTP_FROM ?? "noreply@muheshimiwa.com",
      to: email,
      subject,
      html: htmlContent,
    };

    await transport.sendMail(mailOptions);
    console.log(`Campaign email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("Error sending campaign email:", error);
    return false;
  }
}
