"use client";

import * as React from "react";
import { NavMain } from "@/components/layout/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { type MenuType } from "@/app/types/menu";

export function AppSidebar({
  ...props
}: {
  config?: React.ComponentProps<typeof Sidebar>;
  menuTree: MenuType[];
}) {
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon" {...props.config}>
      {open && (
        <SidebarHeader
          className={`${open ? "" : "h-0 w-0"} text-2xl ease-linear duration-100`}
        >
          {"RAY"}
        </SidebarHeader>
      )}
      <SidebarContent>
        <NavMain items={props.menuTree} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
