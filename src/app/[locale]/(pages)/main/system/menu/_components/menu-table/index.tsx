"use client";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { type Menu } from "@prisma/client";
import { Plus } from "lucide-react";
import React, { useMemo, useRef } from "react";
import { createColumns } from "./columns";
import { api } from "@/trpc/react";
import { reload } from "@/app/actions";
import { usePathname } from "next/navigation";
import MenuDialog, { type MenuDialogRefType } from "../menu-dialog";
interface MenuTableProps {
  list: Menu[];
  total: number;
}
function MenuTable(params: MenuTableProps) {
  const { list, total } = params;
  const pathName = usePathname();
  const menuDialogRef = useRef<MenuDialogRefType>(null);
  const menuDeleteApi = api.menu.deleteMenuById.useMutation({
    onSuccess() {
      reloadList();
    },
  });

  const reloadList = () => {
    reload(pathName);
  };
  const deleteMenu = (key: string) => {
    menuDeleteApi.mutate({ key });
  };
  const columns = useMemo(
    () => createColumns(menuDialogRef, deleteMenu),
    [],
  );
  return (
    <div>
      <div className="flex items-start justify-end">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            menuDialogRef.current?.setModel(true, "add");
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> 新增菜单
        </Button>
      </div>
      <Separator className="mb-4 mt-4" />
      <DataTable columns={columns} data={list} totalItems={total} />
      <MenuDialog ref={menuDialogRef} reloadList={reloadList} />
    </div>
  );
}

export default MenuTable;
