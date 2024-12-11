"use client";

import { reload } from "@/app/actions";
import { api } from "@/trpc/react";
import { usePathname } from "next/navigation";
import { useMemo, useRef } from "react";
import { createColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/table/data-table";
import UserDialog, { UserModalRefType } from "../user-dialog";
import { User } from "@prisma/client";

interface UserTableProps {
  list: User[];
  total: number;
}
function UserTable(params: UserTableProps) {
  const { list, total } = params;
  const pathName = usePathname();
  const userModalRef = useRef<UserModalRefType>(null);

  const userDeleteApi = api.user.deleteUserById.useMutation({
    onSuccess() {
      reloadList();
    },
  });
  const deleteUser = (id: string) => {
    userDeleteApi.mutate({ id });
  };

  const reloadList = () => {
    reload(pathName);
  };
  const columns = useMemo(() => createColumns(userModalRef, deleteUser), []);
  return (
    <>
      <div className="flex items-start justify-end">
        <Button
          size="sm"
          variant="outline"
          onClick={() => userModalRef.current?.setModel(true, "add")}
        >
          <Plus className="mr-2 h-4 w-4" /> 新增用户
        </Button>
      </div>
      <Separator className="mb-4 mt-4" />
      <DataTable columns={columns} data={list} totalItems={total} />
      <UserDialog ref={userModalRef} reloadList={reloadList} />
    </>
  );
}

export default UserTable;
