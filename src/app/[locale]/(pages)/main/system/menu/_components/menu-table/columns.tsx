"use client";

import { MENU_ICONS, MENU_TYPE_MAP, STATUS } from "@/app/[locale]/constant";
import TableAction from "@/components/table/table-action";
import { Menu } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { MenuDialogRefType } from "../menu-dialog";
export const createColumns = (
  menuDialogRef: React.MutableRefObject<MenuDialogRefType>,
  deleteMenu: (id: string) => void,
): ColumnDef<Menu & { parentMenu?: Menu }>[] => {
  return [
    {
      header: "标题",
      accessorKey: "label",
    },
    {
      header: "地址",
      accessorKey: "key",
    },
    {
      header: "父级菜单",
      accessorKey: "parent",
      cell: ({ row }) => <div>{row.original.parentMenu?.label ?? "-"}</div>,
    },
    {
      header: "类型",
      accessorKey: "menuType",
      cell: ({ row }) => MENU_TYPE_MAP[row.original.menuType],
    },
    {
      header: "状态",
      accessorKey: "status",
      cell: ({ row }) => STATUS[row.original.status],
    },
    {
      header: "排序",
      accessorKey: "order",
    },
    {
      header: "图标",
      accessorKey: "icon",
      cell: ({ row }) => {
        const Icon = MENU_ICONS.find((icon) => icon.name === row.original.icon)
          ?.icon;
        return Icon ? <Icon size={16} /> : "-";
      },
    },
    {
      header: "操作",
      accessorKey: "action",
      cell: ({ row }) => (
        <TableAction
          row={row}
          actions={[
            {
              title: "删除",
              action: () => {
                deleteMenu(row.original.key);
              },
            },
            {
              title: "编辑",
              action: () =>
                menuDialogRef?.current.setModel(true, "edit", row.original),
            },
          ]}
        />
      ),
    },
  ];
};
