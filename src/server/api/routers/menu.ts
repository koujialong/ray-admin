import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { getSession } from "next-auth/react";
import { getServerAuthSession } from "@/server/auth";

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
        status: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.menu.create({
        data: input,
      });
    }),
  getMenuList: protectedProcedure
    .input(
      z.object({
        pageSize: z.number(),
        pageNum: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let list: any[] = await ctx.db.menu.findMany({
        skip: input.pageSize * (input.pageNum - 1),
        take: input.pageSize,
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
        total,
      };
    }),

  getAllMenu: protectedProcedure
    .input(
      z
        .object({
          isSetting: z.boolean().optional(),
        })
        .default({
          isSetting: false,
        }),
    )
    .mutation(async ({ ctx, input }) => {
      const list = await ctx.db.menu.findMany({
        select: {
          id: true,
          parent: true,
          icon: !input.isSetting,
          label: true,
          key: true,
          menuType: true,
        },
        where: {
          status: "0",
        },
        orderBy: {
          order: "asc",
        },
      });
      const session = await getServerAuthSession();
      const { user } = session || {};
      let map: { [key: string]: any } = {};
      const menus = await ctx.db.roleMenu.findMany({
        where: {
          roleId: user?.role,
        },
        select: {
          menuId: true,
        },
      });
      const menuKeys = menus.map((menu) => menu.menuId);
      list.forEach((row) => {
        const transMenu: any = {
          ...row,
        };
        if (input.isSetting) {
          // transMenu.isLeaf = true;
          if (menuKeys.includes(row.key)) {
            map[row.id] = transMenu;
          }
        } else {
          map[row.id] = transMenu;
        }
      });
      list.forEach((row) => {
        if (row.parent && map[row.parent]) {
          const parent = map[row.parent];
          // parent.isLeaf = false;
          const transRow: any = {
            ...row,
          };
          if (input.isSetting) {
            // transRow.isLeaf = true;
          }
          map[row.parent] = {
            ...parent,
            children: parent.children
              ? [...parent.children, transRow]
              : [transRow],
          };
        }
      });
      const tree: any[] = [];
      Object.keys(map).forEach((key) => {
        if (!map[key].parent) {
          tree.push(map[key]);
        }
      });
      return {
        list,
        tree,
      };
    }),

  getMenuTree: protectedProcedure.mutation(async ({ ctx, input }) => {
    const list = await ctx.db.menu.findMany({
      orderBy: {
        order: "asc",
      },
    });
    const tree: any[] = [];
    let map: { [key: string]: any } = {};
    list.forEach((row) => {
      const transMenu: any = {
        ...row,
      };
      map[row.id] = transMenu;
    });
    list.forEach((row) => {
      if (row.parent && map[row.parent]) {
        const parent = map[row.parent];
        // parent.isLeaf = false;
        const transRow: any = {
          ...row,
        };
        map[row.parent] = {
          ...parent,
          children: parent.children
            ? [...parent.children, transRow]
            : [transRow],
        };
      }
    });
    Object.keys(map).forEach((key) => {
      if (!map[key].parent) {
        tree.push(map[key]);
      }
    });
    console.log("res=====>", tree, list);
    return tree;
  }),

  getOtherAllMenu: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return ctx.db.menu.findMany({
        where: {
          NOT: {
            id: input,
          },
          parent: null,
        },
      });
    }),

  deleteMenuById: protectedProcedure
    .input(
      z.object({
        key: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.menu.delete({
        where: input,
      });
    }),

  findMenuById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.menu.findFirst({
        where: input,
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
        status: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.menu.update({
        where: {
          key: input.key,
        },
        data: input,
      });
    }),
});
