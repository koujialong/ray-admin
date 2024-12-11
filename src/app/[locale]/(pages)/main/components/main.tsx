"use client";
import { useEffect, useMemo } from "react";
import { PageContext } from "@/app/context/page-context";
import { getSession } from "next-auth/react";
import { userAtom } from "@/app/store/user";
import { useAtom } from "jotai";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import Header from "@/components/layout/header";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import React from "react";
import { reload } from "@/app/actions";
import KBar from "@/components/kbar";

export default function Main({ children, params: { locale, menuData } }) {
  const [_, setUser] = useAtom(userAtom);
  const { t } = useTranslation("menu");
  const { theme: currentTheme, setTheme } = useTheme();

  async function getUser() {
    const session = await getSession();
    const { user } = session ?? {};
    setUser({
      ...user,
      image: user.image ?? "",
      email: user.email ?? "",
      username: user.name,
    });
  }
  useEffect(() => {
    getUser();
    setTheme(currentTheme);
  }, []);

  const menuTree = useMemo(() => {
    return menuData.tree.map((menu) => {
      const children = menu.children
        ? menu.children.map((menu) => ({
            ...menu,
            label: t(menu?.label),
          }))
        : null;
      return {
        ...menu,
        children,
        label: t(menu?.label),
      };
    });
  }, [menuData]);

  const reloadMenu = () => {
    reload("/main");
  };
  return (
    <KBar navItems={menuData.list}>
      <SidebarProvider>
        <AppSidebar menuTree={menuTree} />
        <SidebarInset>
          <Header menuList={menuData.list} />
          <div className="flex h-[calc(100%-4rem)] flex-col gap-4 pt-0">
            <PageContext.Provider value={{ reloadMenu }}>
              <NuqsAdapter>{children}</NuqsAdapter>
            </PageContext.Provider>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  );
}
