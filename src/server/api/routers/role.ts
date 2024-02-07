import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure
} from "@/server/api/trpc";

export const roleRouter = createTRPCRouter({
  addRole: protectedProcedure
    .input(
      z.object({
        roleName: z.string(),
        roleKey: z.string(),
        order: z.number(),
        remark: z.string().optional().nullable(),
        status: z.string()
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.role.create({
        data: input
      });
    }),
  getAllRole: protectedProcedure
    .mutation(({ ctx, input }) => {
      return ctx.db.role.findMany();
    }),
  getRoleList: protectedProcedure
    .input(
      z.object({
        pageSize: z.number(),
        pageNum: z.number()
      })
    )
    .mutation(async ({ ctx, input }) => {
      let list: any[] = await ctx.db.role.findMany({
        skip: input.pageSize * (input.pageNum - 1),
        take: input.pageSize
      });
      const total = await ctx.db.role.count();
      return {
        list,
        total
      };
    }),


  deleteRoleById: protectedProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.role.delete({
        where: input
      });
    }),

  findRoleById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.role.findFirst({
        where: input
      });
    }),

  upDateRoleById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        roleName: z.string(),
        roleKey: z.string(),
        order: z.number(),
        remark: z.string().optional().nullable(),
        status: z.string()
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.role.update({
        where: {
          id: input.id
        },
        data: input
      });
    }),

  addRuleMenu: protectedProcedure
    .input(
      z.object({
        roleId: z.string(),
        menuIds: z.string().array()
      })
    ).mutation(async ({ ctx, input: { roleId, menuIds } }) => {
      await ctx.db.roleMenu.deleteMany({
        where: {
          roleId
        }
      });
      return await Promise.all(
        menuIds.map(async (menuId) => {
          return await ctx.db.roleMenu.create({
            data: {
              roleId,
              menuId
            }
          });
        })
      );
    }),
  getRuleMenu: protectedProcedure
    .input(
      z.object({
        roleId: z.string(),
      })
    ).mutation(async ({ ctx, input }) => {
      return await ctx.db.roleMenu.findMany({
        where: input,
        select: {
          menuId: true
        }
      });
    })
});