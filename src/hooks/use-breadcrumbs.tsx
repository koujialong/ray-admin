"use client";

import { MenuType } from "@/app/types/menu";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

type BreadcrumbItem = {
  title: string;
  link: string;
};

const routeMapping: Record<string, BreadcrumbItem[]> = {};

export function useBreadcrumbs(menuList: MenuType[]) {
  const pathname = usePathname();
  const getMenuOrigin = (segment: string, index) => {
    return menuList.find(
      (menu) =>
        menu.key.endsWith(segment) && index === menu.key.split("/").length - 2,
    );
  };
  const breadcrumbs = useMemo(() => {
    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }

    const segments = pathname.split("/").filter(Boolean);
    return segments
      .map((segment, index) => {
        const menu = getMenuOrigin(segment, index);
        console.log(
          "segment",
          segment,
          menuList,
          !menu,
          menu?.menuType === "D",
        );
        if (!menu) {
          return null;
        }
        if (menu.menuType === "D") {
          return {
            title: menu.label,
          };
        }
        const path = `/${segments.slice(0, index + 1).join("/")}`;
        return {
          title: menu.label,
          link: path,
        };
      })
      .filter((menu) => menu);
  }, [pathname, menuList]);

  return breadcrumbs;
}
