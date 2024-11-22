"use client";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  Button,
  theme,
  message,
  Dropdown,
  type MenuProps,
  Space,
  ConfigProvider,
} from "antd";
import { type MenuType } from "@/app/types/menu";
import { createElement, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageContext } from "@/app/context/page-context";
import { getSession, signOut } from "next-auth/react";
import { userAtom } from "@/app/store/user";
import { useAtom } from "jotai";
import { api } from "@/trpc/react";
import * as Icon from "@ant-design/icons";
import zhCN from "antd/es/locale/zh_CN";
import LanguageChanger from "@/app/components/language-changer";
import { type MenuItemType } from "antd/es/menu/hooks/useItems";
import { useTranslation } from "react-i18next";

const Icons: Record<string, any> = Icon;

const setIcon = (menuList: Array<MenuType>): MenuType[] => {
  return menuList.map((menu: MenuType) => {
    delete menu.menuType;
    return Object.assign(menu, {
      icon: menu.icon ? createElement(Icons[menu.icon as string]) : null,
      children: menu.children ? setIcon(menu.children) : null,
    });
  });
};

const { Header, Sider, Content } = Layout;

export default function RootLayout({ children, params: { locale } }) {
  console.log("RootLayout", locale);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const router = useRouter();

  const [menuList, setMenuList] = useState<MenuType[]>([]);
  const [selMenu, setSelMenu] = useState<MenuType>();
  const [messageApi, contextHolder] = message.useMessage();
  const [user, setUser] = useAtom(userAtom);
  const { t } = useTranslation("menu");

  const userApi = api.user.findUserById.useMutation({
    onSuccess(user) {
      user &&
        setUser({
          id: user.id,
          image: user.image ?? "",
          email: user.email ?? "",
          username: user.username,
          role: user.role,
        });
    },
  });

  async function getUser() {
    const session = await getSession();
    const { user } = session ?? {};
    user && userApi.mutate({ id: user?.id });
  }

  const changeMenu: MenuProps["onClick"] = (res) => {
    let menu: MenuType = { children: menuList };
    const menus: MenuType[] = [];
    res.keyPath.reverse().forEach((key) => {
      menu = menu.children.find((menu) => menu.key === key);
      menus.push(menu);
    });
    router.push(res.key);
    setSelMenu(
      menus.length > 1 ? Object.assign(menu, { parent: menus[0] }) : menu,
    );
  };

  const menuApi = api.menu.getAllMenu.useMutation({
    onSuccess(data) {
      const menuList = [
        ...data.tree.map((menu) => {
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
        }),
      ];
      setMenuList(setIcon(menuList));

      let selMenu: MenuType = { key: "" };

      function getSelMenu(menuInfo: MenuType) {
        menuInfo.children.forEach((menu: MenuType) => {
          if (
            window.location.href.indexOf(menu.key) !== -1 &&
            menu.key.length > selMenu.key.length
          ) {
            selMenu = {
              ...menu,
              parent: menuInfo,
              label: t(menu?.label),
            };
          }
          menu.children && getSelMenu(menu);
        });
      }

      getSelMenu({ children: data.tree });
      setSelMenu(selMenu);
    },
  });

  const reloadMenu = () => {
    menuApi.mutate();
  };

  useEffect(() => {
    getUser()
      .then(() => menuApi.mutate())
      .catch((e) => console.log(e));
  }, []);

  const items: MenuProps["items"] = [
    {
      label: (
        <span onClick={() => signOut({ callbackUrl: "/login" })}>退出登录</span>
      ),
      key: "0",
    },
  ];

  return (
    <Layout className="h-screen w-screen">
      {contextHolder}
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="h-16 w-full text-cyan-50"></div>
        {selMenu && (
          <Menu
            defaultOpenKeys={[selMenu.parent?.key || selMenu.key]}
            onClick={changeMenu}
            theme="dark"
            mode="inline"
            selectedKeys={[selMenu.key]}
            items={menuList as MenuItemType[]}
          />
        )}
      </Sider>
      <Layout>
        <Header
          style={{ background: colorBgContainer, padding: 0 }}
          className="flex items-center justify-between text-white"
        >
          <div className="flex items-center">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <div>
              {selMenu?.parent?.label ? selMenu?.parent?.label + " / " : ""}
              {selMenu?.label}
            </div>
          </div>
          <div className="flex items-center">
            <LanguageChanger />
            <Dropdown menu={{ items }} className="mr-5">
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  {user?.username}
                  <UserOutlined />
                </Space>
              </a>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <ConfigProvider locale={zhCN}>
            <PageContext.Provider value={{ messageApi, reloadMenu }}>
              {children}
            </PageContext.Provider>
          </ConfigProvider>
        </Content>
      </Layout>
    </Layout>
  );
}
