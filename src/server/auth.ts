import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { db } from "@/server/db";
import { api } from "@/trpc/server";

interface IUser {
  name?: string;
  email?: string | null;
  id?: string;
  image?: string;
  role: string;
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User & DefaultSession["user"];
  }

  interface User extends IUser {
  }
}

declare module "next-auth/jwt" {
  interface JWT extends IUser {
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, token, user }) => {
      if (token){
        session.user.role=token.role
        session.user.id=token.id as string
      }
      return session;
    },
    jwt({ token, user, account, profile, isNewUser }) {
      // if (account) {
      //   token.accessToken = account.access_token;
      // }
      if (user) {
        token.role = user.role;
        token.id=token.sub
      }
      return token;
    }
  },
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  },
  jwt: {
    maxAge: 60 * 60 * 12
  },
  debug: process.env.NODE_ENV === "development",
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "name", type: "text" },
        password: { label: "password", type: "password" }
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
      }
    })
  ]
};

export const getServerAuthSession = () => getServerSession(authOptions);
