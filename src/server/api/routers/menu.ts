import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { getServerAuthSession } from "@/server/auth";
import { type MenuType } from "@/app/types/menu";
import { type Menu, type Prisma } from "@prisma/client";

interface MenuItem extends Menu {
  parentMenu?: Menu; // 新增的 parentMenu 字段
}

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
        data: input as Prisma.MenuCreateInput,
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
      const list: MenuItem[] = await ctx.db.menu.findMany({
        skip: input.pageSize * (input.pageNum - 1),
        take: input.pageSize,
      });
      const allList = await ctx.db.menu.findMany();
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
      const map: Record<string, any> = {};
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
        const transMenu: Partial<Menu> = {
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
          const parent = map[row.parent] as Partial<Menu> & {
            children: Partial<Menu>[];
          };
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
      const tree: MenuType[] = [];
      Object.keys(map).forEach((key) => {
        if (!map[key].parent) {
          tree.push(map[key] as MenuType);
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
    const tree: MenuType[] = [];
    const map: Record<string, any> = {};
    list.forEach((row) => {
      const transMenu: Partial<Menu> = {
        ...row,
      };
      map[row.id] = transMenu;
    });
    list.forEach((row) => {
      if (row.parent && map[row.parent]) {
        const parent = map[row.parent] as MenuType;
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
        tree.push(map[key] as MenuType);
      }
    });
    return tree;
  }),

  getOtherAllMenu: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return ctx.db.menu.findMany({
        where: {
          NOT: [{ menuType: "M" }],
          OR: [
            {
              parent: null,
            },
            {
              parent: "",
            },
          ],
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
        where: input as Prisma.MenuWhereUniqueInput,
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
