"use client";
// import { navItems } from "@/constants/data";
import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarSearch,
} from "kbar";
import { useRouter } from "next/navigation";
import { useMemo, useTransition } from "react";
import RenderResults from "./render-result";
import useThemeSwitching from "./use-theme-switching";
import { MenuType } from "@/app/types/menu";
import { useTranslation } from "react-i18next";
export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  // icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
}

export default function KBar({
  children,
  navItems,
}: {
  children: React.ReactNode;
  navItems: MenuType[];
}) {
  const { t } = useTranslation("menu");
  const router = useRouter();

  const navigateTo = (url: string) => {
    router.push(url);
  };

  // These action are for the navigation
  const actions = useMemo(
    () =>
      navItems
        .filter((menu) => menu.menuType !== "D")
        .map((navItem) => {
          const baseAction =
            navItem.key !== "#"
              ? {
                  id: `${navItem.label.toLowerCase()}Action`,
                  name: t(navItem.label),
                  // shortcut: navItem.shortcut,
                  keywords: navItem.label.toLowerCase(),
                  section: "Navigation",
                  subtitle: `Go to ${t(navItem.label)}`,
                  perform: () => navigateTo(navItem.key),
                }
              : null;
          return baseAction;
        }),
    [],
  );

  return (
    <KBarProvider actions={actions}>
      <KBarComponent>{children}</KBarComponent>
    </KBarProvider>
  );
}
const KBarComponent = ({ children }: { children: React.ReactNode }) => {
  useThemeSwitching();

  return (
    <>
      <KBarPortal>
        <KBarPositioner className="scrollbar-hide fixed inset-0 z-[99999] bg-black/80  !p-0 backdrop-blur-sm">
          <KBarAnimator className="relative !mt-64 w-full max-w-[600px] !-translate-y-12 overflow-hidden rounded-lg border bg-background text-foreground shadow-lg">
            <div className="bg-background">
              <div className="border-x-0 border-b-2">
                <KBarSearch className="w-full border-none bg-background px-6 py-4 text-lg outline-none focus:outline-none focus:ring-0 focus:ring-offset-0" />
              </div>
              <RenderResults />
            </div>
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </>
  );
};
