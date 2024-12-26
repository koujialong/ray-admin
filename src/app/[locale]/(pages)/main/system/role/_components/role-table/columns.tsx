"use client";

import TableAction from "@/components/table/table-action";
import { Button } from "@/components/ui/button";
import { type Role } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { STATUS } from "@/app/[locale]/constant";
import { type RoleModalRefType } from "../role-dialog";

export const createColumns = (
  ruleModalRef: React.MutableRefObject<RoleModalRefType>,
  deleteRole: (id: string) => void,
): ColumnDef<Role>[] => {
  return [
    {
      accessorKey: "roleName",
      header: "角色名",
      cell: ({ row }) => (
        <Button
          variant="link"
          onClick={() =>
            ruleModalRef.current?.setModel(true, "view", row.original)
          }
        >
          {row.getValue("roleName")}
        </Button>
      ),
    },
    {
      header: "角色Key",
      accessorKey: "roleKey",
    },
    {
      header: "状态",
      accessorKey: "status",
      cell: ({ row }) => STATUS[row.original.status],
    },

    {
      header: "备注",
      accessorKey: "remark",
    },
    {
      header: "排序",
      accessorKey: "order",
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
              disabled: !row.original.editable,
              action: () => deleteRole(row.original.id),
            },
            {
              title: "编辑",
              action: () =>
                ruleModalRef.current?.setModel(true, "edit", row.original),
            },
          ]}
        />
      ),
    },
  ];
};
