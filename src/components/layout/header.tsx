import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { Breadcrumbs } from "./breadcrumb";
import { UserNav } from "../user-nav";
import { type MenuType } from "@/app/types/menu";
import ThemeToggle from "./ThemeToggle/theme-toggle";
import LanguageChanger from "./language-changer";
import SearchInput from "./search-input";

export default function Header({ menuList }: { menuList: MenuType[] }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumbs menuList={menuList} />
      </div>

      <div className="flex items-center gap-2 px-4">
        <div className="hidden md:flex">
          <SearchInput />
        </div>
        <LanguageChanger />
        <ThemeToggle />
        <UserNav />
      </div>
    </header>
  );
}
