import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";

import { env } from "@/env";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { inferRouterContext, ProcedureType, TRPCError } from "@trpc/server";
import { router } from "next/client";
import { redirect } from "next/navigation";
/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a HTTP request (e.g. when you make requests from Client Components).
 */
const createContext = async (req: NextRequest) => {
  return createTRPCContext({
    headers: req.headers,
  });
};

const onError = ({
  error,
  path,
  req,
}: {
  error: TRPCError;
  type: ProcedureType | "unknown";
  path: string | undefined;
  req: any;
  input: unknown;
  // ctx: inferRouterContext<any> | undefined;
}) => {
  if (env.NODE_ENV === "development") {
    console.error(`❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`);
  }

  redirect('/login')

  if (error.code === "UNAUTHORIZED") {
    if (path && window) {
      // req.location = "/login";
      // router.replace("/login");
      // message.open({
      //   type:'error',
      //   content:'没权限'
      // })
      // redirect('/login')
      // alert('没权限')
    }
    // window !== 'undefined'
  }
};

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError,
  });

export { handler as GET, handler as POST };
