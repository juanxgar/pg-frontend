import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Authentication } from "@/services";
import { JWT } from "next-auth/jwt";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        const res = await Authentication.signIn({
          email: credentials?.email,
          password: credentials?.password,
        });
        const user = res.data;

        // If no error and we have user data, return it
        if (user) {
          return {
            id: user.id,
            email: credentials?.email,
            role: user.role,
            name: user.name,
            token: user.token,
          };
        }
        // Return null if user data could not be retrieved

        return Promise.reject(new Error(user?.errors));
      },
    }),
  ],
  jwt: {
    maxAge: 3600,
  },
  session: {
    strategy: "jwt",
    maxAge: 3600, // the session will last 7 days
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async jwt({ token, user }: { token: JWT; user?: User }) {
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      session.user = user;
      session.accessToken = token;

      return session;
    },
    async signIn({ user, account, profile, email, credentials }) {
      const isAllowedToSignIn = true;
      if (isAllowedToSignIn) {
        return true;
      } else {
        // Return false to display a default error message
        return false;
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    },
  },
  secret: process.env.JWT_TOKEN,
  pages: {
    signIn: "/",
    error: "/",
  },
});

export { handler as GET, handler as POST };
