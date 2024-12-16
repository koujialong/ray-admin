"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { type MenuType } from "@/app/types/menu";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { MENU_ICONS } from "@/app/[locale]/constant";
import { ChevronRight } from "lucide-react";

export function NavMain({ items }: { items: MenuType[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const changeMenu = (selMenu: MenuType) => {
    router.replace(selMenu.key);
  };

  const [icons] = useState(() => {
    const icons = {};
    MENU_ICONS.forEach(({ name, icon }) => {
      const MenuIcon = icon;
      icons[name] = <MenuIcon />;
    });
    return icons;
  });
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.label}
            asChild
            defaultOpen={true}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              {item.children ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      size="default"
                      tooltip={item.label}
                      className="cursor-pointer"
                    >
                      {item.icon && icons[item.icon]}
                      <span>{item.label}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.children?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.label}>
                          <SidebarMenuSubButton
                            asChild
                            size="md"
                            isActive={pathname === subItem.key}
                            className="cursor-pointer"
                            onClick={() => changeMenu(subItem)}
                          >
                            <a>
                              {item.icon && icons[subItem.icon]}
                              <span>{subItem.label}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : (
                <>
                  <SidebarMenuButton
                    asChild
                    size="default"
                    isActive={pathname === item.key}
                    onClick={() => changeMenu(item)}
                    className="cursor-pointer"
                  >
                    <a>
                      {item.icon && icons[item.icon]}
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
