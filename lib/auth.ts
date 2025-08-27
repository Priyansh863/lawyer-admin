import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
    async authorize(credentials) {
      console.log("Admin authorize function called with credentials:", credentials);

      if (!credentials?.email || !credentials?.password) {
        console.log("Missing email or password in credentials.");
        return null;
      }

      try {
        console.log("Sending admin login request to API...");
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        });

        console.log("Received response from API:", response);
        const result = await response.json();
        console.log("Parsed admin data:", result);

        if (response.ok && result.success && result.data) {
          console.log("Admin login successful, returning user.");
          return {
            ...result.data.userData,
            token: result.data.token,
            role: result.data.userData.account_type
          };
        }
        
        // Handle specific error messages from backend
        if (!result.success && result.message) {
          if (result.message === "not_admin_user") {
            throw new Error("Access denied. Only admin users can log in to the admin panel.");
          } else if (result.message === "no_user_found") {
            throw new Error("No user found with this email address.");
          } else if (result.message === "user_not_active") {
            throw new Error("Your account is not active. Please contact support.");
          } else if (result.message === "user_not_verified") {
            throw new Error("Your account is not verified. Please verify your email first.");
          } else if (result.message === "credentials_not_match") {
            throw new Error("Invalid email or password. Please try again.");
          } else {
            throw new Error(result.message);
          }
        }
        
        return null;
      } catch (error) {
        console.error("Error during admin login request:", error);
        return error;
      }
    }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log("Admin JWT callback called with token:", token, "and user:", user);
      if (user) {
        token.id = user.id
        token.email = user.email
        token.role = (user as any).role || (user as any).account_type
      }
      return {...token,...user};
    },
    async session({ session, token }) {
      console.log("Admin Session callback called with session:", session, "and token:", token);
      if (token) {
        session.user = token;
      }
      return session
    },
  }
}
