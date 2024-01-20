import { postRouter } from "@/server/api/routers/post";
import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "@/server/api/routers/user";
import { menuRouter } from "@/server/api/routers/menu";
import { roleRouter } from "@/server/api/routers/role";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  user: userRouter,
  menu: menuRouter,
  role: roleRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
