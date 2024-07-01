"use client";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  Button,
  theme,
  message,
  Dropdown,
  MenuProps,
  Space, ConfigProvider
} from "antd";
import { createElement, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageContext } from "@/app/context/pageContext";
import { getSession, signOut } from "next-auth/react";
import { userAtom } from "@/app/store/user";
import { useAtom } from "jotai";
import { api } from "@/trpc/react";
import * as Icon from "@ant-design/icons";
import zhCN from "antd/es/locale/zh_CN";
import LanguageChanger from "@/app/components/LanguageChanger";

const Icons: { [key: string]: any } = Icon;

const setIcon = (menuList: any) => {
  return menuList.map((menu: any) => {
    delete menu.menuType;
    return {
      ...menu,
      icon: menu.icon ? createElement(Icons[menu.icon]) : null,
      children: menu.children ? setIcon(menu.children) : null
    };
  });
};

const { Header, Sider, Content } = Layout;

export default function RootLayout(res: any) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken();
  const router = useRouter();

  const [menuList, setMenuList] = useState([]);
  const [selMenu, setSelMenu] = useState<any>();
  const [messageApi, contextHolder] = message.useMessage();
  const [user, setUser] = useAtom(userAtom);
  const userApi = api.user.findUserById.useMutation({
    onSuccess(user) {
      user && setUser({
        id: user.id,
        image: user.image || "",
        email: user.email || "",
        username: user.username,
        role: user.role
      });
    }
  });

  async function getUser() {
    const session = await getSession();
    const { user } = session || {};
    user && userApi.mutate({ id: user?.id });
  }

  const changeMenu = (res: any) => {
    setSelMenu(res);
    router.push(res.key);
  };

  const menuApi = api.menu.getAllMenu.useMutation({
    onSuccess(data) {
      const menuList = [
        ...data.tree.map((menu) => ({
          ...menu,
          children: menu.children || null
        }))
      ];
      setMenuList(setIcon(menuList));

      let selMenu = { key: "" };

      function getSelMenu(menuInfo: any) {
        menuInfo.children.forEach((menu: any) => {
          if (
            window.location.href.indexOf(menu.key) !== -1 &&
            menu.key.length > selMenu.key.length
          ) {
            selMenu = {
              ...menu,
              parent: menuInfo
            };
          }
          menu.children && getSelMenu(menu);
        });
      }

      getSelMenu({ children: data.tree });
      setSelMenu(selMenu);
    }
  });

  useEffect(() => {
    getUser();
    menuApi.mutate();
  }, []);

  const items: MenuProps["items"] = [
    {
      label: <span onClick={() => signOut()}>退出登录</span>,
      key: "0"
    }
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
            items={menuList}
          />
        )}
      </Sider>
      <Layout>
        <Header
          style={{ background: colorBgContainer, padding: 0 }}
          className="flex items-center justify-between text-white"
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64
            }}
          />
          <div className='flex items-center'>
            <LanguageChanger locale={res.params.locale}/>
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
            borderRadius: borderRadiusLG
          }}
        >
          <ConfigProvider locale={zhCN}>
            <PageContext.Provider value={{ messageApi }}>
              {res?.children}
            </PageContext.Provider>
          </ConfigProvider>
        </Content>
      </Layout>
    </Layout>
  );
}
