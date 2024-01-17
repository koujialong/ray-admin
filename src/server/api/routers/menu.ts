import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure
} from "@/server/api/trpc";

export const menuRouter = createTRPCRouter({
  addMenu: protectedProcedure
    .input(
      z.object({
        label: z.string(),
        key: z.string(),
        icon: z.string(),
        order: z.number(),
        parent: z.string().optional().nullable(),
        menuType: z.string(),
        status: z.string()
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.menu.create({
        data: input
      });
    }),
  getMenuList: protectedProcedure
    .input(
      z.object({
        pageSize: z.number(),
        pageNum: z.number()
      })
    )
    .mutation(async ({ ctx, input }) => {
      let list: any[] = await ctx.db.menu.findMany({
        skip: input.pageSize * (input.pageNum - 1),
        take: input.pageSize
      });
      let allList = await ctx.db.menu.findMany();
      const total = await ctx.db.user.count();
      for (const menu of list) {
        if (menu.parent) {
          menu.parentMenu = allList.find((it) => it.id === menu.parent);
        }
      }
      return {
        list,
        total
      };
    }),

  getAllMenu: protectedProcedure.mutation(async ({ ctx, input }) => {
    const list = await ctx.db.menu.findMany({
      where: {
        status: "0"
      },
      orderBy: {
        order: "asc"
      }
    });
    let map: { [key: string]: any } = {};
    list.forEach((row) => {
      map[row.id] = row;
    });
    list.forEach((row) => {
      if (row.parent) {
        const parent = map[row.parent];
        map[row.parent] = {
          ...parent,
          children: parent.children ? [...parent.children, row] : [row]
        };
      }
    });
    const resLis: any[] = [];
    Object.keys(map).forEach((key) => {
      if (!map[key].parent) {
        resLis.push(map[key]);
      }
    });
    return resLis;
  }),

  getOtherAllMenu: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return ctx.db.menu.findMany({
        where: {
          NOT: {
            id: input
          },
          parent: null
        }
      });
    }),

  deleteMenuById: protectedProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.menu.delete({
        where: input
      });
    }),

  findMenuById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.menu.findFirst({
        where: input
      });
    }),

  upDateMenuById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        label: z.string(),
        key: z.string(),
        icon: z.string(),
        order: z.number(),
        parent: z.string().optional().nullable(),
        menuType: z.string(),
        status: z.string()
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.menu.update({
        where: {
          key: input.key
        },
        data: input
      });
    })
});
