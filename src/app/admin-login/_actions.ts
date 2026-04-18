"use server";

import { redirect } from "next/navigation";
import { signIn as nextAuthSignIn } from "~/server/auth";
import { auth } from "~/server/auth";

export async function adminSignIn(identifier: string, password: string) {
  try {
    // Try to sign in with credentials - this is the server-side handler
    const result = await nextAuthSignIn("credentials", {
      identifier: identifier.trim(),
      password,
      redirect: false,
    });

    // If sign in failed, return error
    if (!result || result.error) {
      return {
        error: result?.error || "Sign in failed",
        code: result?.code || null,
      };
    }

    // Wait a bit for session to be established
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check that session is actually created
    const session = await auth();
    if (!session?.user) {
      return {
        error: "Session not created",
        code: "session_error",
      };
    }

    // Redirect to admin dashboard
    redirect("/admin");
  } catch (error) {
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error; // Re-throw Next.js redirects
    }
    return {
      error: "An error occurred during sign in",
      code: "unknown_error",
    };
  }
}
