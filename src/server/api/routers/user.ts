import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
        email: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.user.create({
        data: input,
      });
    }),
  login: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.user.findFirst({
        where: input,
      });
    }),
  getUserList: protectedProcedure
    .input(
      z.object({
        pageSize: z.number(),
        pageNum: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const list = await ctx.db.user.findMany({
        skip: input.pageSize * (input.pageNum - 1),
        take: input.pageSize,
      });
      const total = await ctx.db.user.count();
      return {
        list,
        total,
      };
    }),

  deleteUserById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.user.delete({
        where: input,
      });
    }),

  findUserById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.user.findFirst({
        where: input,
      });
    }),

  upDateUserById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        username: z.string(),
        password: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.user.update({
        where: {
          id: input.id,
        },
        data: input,
      });
    }),

  checkUser: publicProcedure
    .input(
      z.object({
        name: z.string(),
        password: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      // await getToken({ req, secret })
      return ctx.db.user.findFirst({
        where: {
          OR: [
            {
              username: input.name,
              password: input.password,
            },
            {
              email: input.name,
              password: input.password,
            },
          ],
        },
      });
    }),
});
