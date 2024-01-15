import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.post.create({
        data: {
          name: input.name,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getLatest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });
  }),

  getUser: protectedProcedure
    .input(z.object({ name: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.post.findFirst({
        where: {
          createdBy: { id: ctx.session.user.id },
          name: input.name,
        },
      });
    }),

  getAllUser:protectedProcedure.mutation(({ctx})=>{
    return ctx.db.post.findMany()
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
