import React, { Fragment } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
interface Action<T> {
  title: string;
  disabled?: boolean;
  action: (params: T) => void;
}
function TableAction<T>({ row, actions }: { row: T; actions: Action<T>[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions.map((actionConfig, index) => (
          <Fragment key={actionConfig.title}>
            <DropdownMenuItem
              disabled={actionConfig.disabled}
              onClick={() => actionConfig.action(row)}
            >
              {actionConfig.title}
            </DropdownMenuItem>
            {index !== actions.length - 1 && <DropdownMenuSeparator />}
          </Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default TableAction;
