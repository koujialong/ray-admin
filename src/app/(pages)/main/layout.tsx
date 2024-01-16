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
  MenuProps,
  Space,
} from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageContext } from "@/app/context/pageContext";
import { getSession, signOut } from "next-auth/react";
import { userAtom } from "@/app/store/user";
import { useAtom } from "jotai";
import { baseMenu } from "@/app/constant";
import { api } from "@/trpc/react";

const { Header, Sider, Content } = Layout;

export default function RootLayout(res: any) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const router = useRouter();

  const [menuList, setMenuList] = useState(baseMenu);
  const [selMenu, setSelMenu] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [user, setUser] = useAtom(userAtom);

  async function getUser() {
    const session = await getSession();
    const { user } = session || {};

    user &&
      setUser({
        id: user.id,
        image: user.image as string,
        email: user.email as string,
        username: user.name as string,
      });
  }

  const changeMenu = (res: any) => {
    setSelMenu(res.key);
    router.push(res.key);
  };

  const menuApi = api.menu.getAllMenu.useMutation({
    onSuccess(menus) {
      console.log("菜单", [
        ...baseMenu,
        ...menus.map((menu) => ({
          ...menu,
          icon: <UserOutlined />,
          children: menu.child || null,
        })),
      ]);
      setMenuList([
        ...baseMenu,
        ...menus.map((menu) => ({
          ...menu,
          icon: <UserOutlined />,
          children: menu.child || null,
        })),
      ]);
    },
  });

  useEffect(() => {
    getUser();
    menuApi.mutate();
    const matchMenus = menuList.filter(
      (menu) => window.location.href.indexOf(menu.key) !== -1,
    );
    setSelMenu(matchMenus[matchMenus.length - 1]?.key || "");
  }, []);

  const items: MenuProps["items"] = [
    {
      label: <span onClick={() => signOut()}>退出登录</span>,
      key: "0",
    },
  ];

  return (
    <Layout className="h-screen w-screen">
      {contextHolder}
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="h-16 w-full text-cyan-50"></div>
        <Menu
          onClick={changeMenu}
          theme="dark"
          mode="inline"
          selectedKeys={[selMenu]}
          items={menuList}
        />
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
              height: 64,
            }}
          />
          <Dropdown menu={{ items }} className="mr-5">
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                {user?.username}
                <UserOutlined />
              </Space>
            </a>
          </Dropdown>
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
          <PageContext.Provider value={{ messageApi }}>
            {res?.children}
          </PageContext.Provider>
        </Content>
      </Layout>
    </Layout>
  );
}
