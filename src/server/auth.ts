import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { db } from "@/server/db";
import { api } from "@/trpc/server";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  interface User {
    name?: string;
    email?: string | null;
    id?: string;
    image?: string;
  }

  interface JWT {
    /** OpenID ID Token */
    name?: string;
    email?: string | null;
    id?: string;
    image?: string;
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, token, user }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
        },
      };
    },
    jwt({ token, user, account, profile, isNewUser }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return {
        ...token,
        id: token.sub,
      };
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  jwt: {
    maxAge: 60 * 60 * 12,
  },
  debug: process.env.NODE_ENV === "development",
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "name", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials, req): Promise<any> {
        if (typeof credentials !== "undefined") {
          const res = await api.user.checkUser.query(credentials);

          if (res?.id) {
            return { ...res, name: res.username };
          } else {
            return null;
          }
        } else {
          return null;
        }
      },
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
