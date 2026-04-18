import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "~/app/_components/admin-login-form";
import { auth } from "~/server/auth";

type AdminLoginPageProps = {
  searchParams?: Promise<{
    error?: string | string[];
    code?: string | string[];
  }>;
};

function getFriendlyError(value: string | null, code: string | null) {
  if (!value) return "";
  if (value === "CredentialsSignin" || code === "credentials") {
    return "Invalid username/email or password.";
  }
  if (value === "AccessDenied") {
    return "Access denied for this account.";
  }
  return "Login failed. Please try again.";
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const session = await auth();

  if (session?.user) {
    redirect("/admin");
  }

  const resolvedSearchParams = await searchParams;

  const errorValue = resolvedSearchParams?.error;
  const codeValue = resolvedSearchParams?.code;

  const incomingError = Array.isArray(errorValue) ? errorValue[0] : errorValue;
  const incomingCode = Array.isArray(codeValue) ? codeValue[0] : codeValue;
  const initialError = getFriendlyError(incomingError ?? null, incomingCode ?? null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <h1 className="mb-6 text-center text-3xl font-bold text-md-green">Admin Panel</h1>

        {initialError && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{initialError}</div>
        )}

        <AdminLoginForm />

        <p className="mt-4 text-center text-sm text-gray-600">
          <Link href="/" className="text-md-green hover:underline">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
