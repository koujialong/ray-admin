"use client";

import * as Icons from "lucide-react";

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

export function NavMain({ items }: { items: MenuType[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const changeMenu = (selMenu: MenuType) => {
    router.replace(selMenu.key)
  };

  const MenuIcon = ({ menu }: { menu: MenuType }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const IconComponent = Icons[menu.icon];
    if (!IconComponent) {
      console.warn(`Icon for ${menu.icon} not found`);
      return null;
    }
    return <IconComponent />;
  };
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
                      {item.icon && <MenuIcon menu={item} />}
                      <span>{item.label}</span>
                      <Icons.ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
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
                              {item.icon && <MenuIcon menu={subItem} />}
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
                      {item.icon && <MenuIcon menu={item} />}
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
