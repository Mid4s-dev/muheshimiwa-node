"use server";

export async function adminSignIn(identifier: string, password: string) {
  void identifier;
  void password;

  return {
    error: "Use client-side sign in from next-auth/react for NextAuth v4.",
    code: "unsupported_server_signin",
  };
}
