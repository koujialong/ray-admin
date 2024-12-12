import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { type Prisma, type Role } from "@prisma/client";

export const roleRouter = createTRPCRouter({
  addRole: protectedProcedure
    .input(
      z.object({
        roleName: z.string(),
        roleKey: z.string(),
        order: z.number(),
        remark: z.string().optional().nullable(),
        status: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.role.create({
        data: input as Prisma.RoleCreateInput,
      });
    }),
  getAllRole: protectedProcedure.mutation(({ ctx, input }) => {
    return ctx.db.role.findMany();
  }),
  getRoleList: protectedProcedure
    .input(
      z.object({
        pageSize: z.number(),
        pageNum: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const list: Role[] = await ctx.db.role.findMany({
        skip: input.pageSize * (input.pageNum - 1),
        take: input.pageSize,
      });
      const total = await ctx.db.role.count();
      return {
        list,
        total,
      };
    }),

  deleteRoleById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.role.delete({
        where: input as Prisma.RoleWhereUniqueInput,
      });
    }),

  findRoleById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.db.role.findFirst({
        where: input,
      });
      return res;
    }),

  upDateRoleById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        roleName: z.string(),
        roleKey: z.string(),
        order: z.number(),
        remark: z.string().optional().nullable(),
        status: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.role.update({
        where: {
          id: input.id,
        },
        data: input,
      });
    }),

  addRoleMenu: protectedProcedure
    .input(
      z.object({
        roleId: z.string(),
        menuIds: z.string().array(),
      }),
    )
    .mutation(async ({ ctx, input: { roleId, menuIds } }) => {
      await ctx.db.roleMenu.deleteMany({
        where: {
          roleId,
        },
      });
      return await Promise.all(
        menuIds.map(async (menuId) => {
          return ctx.db.roleMenu.create({
            data: {
              roleId,
              menuId,
            },
          });
        }),
      );
    }),
  getRoleMenu: protectedProcedure
    .input(
      z.object({
        roleId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.roleMenu.findMany({
        where: input,
        select: {
          menuId: true,
        },
      });
    }),
});
