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
} from "@/components/ui/sidebar";
import { type MenuType } from "@/app/types/menu";

export function AppSidebar({
  ...props
}: {
  config?: React.ComponentProps<typeof Sidebar>;
  menuTree: MenuType[];
}) {
  return (
    <Sidebar collapsible="icon" {...props.config}>
      <SidebarHeader>{'NEXT'}</SidebarHeader>
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
