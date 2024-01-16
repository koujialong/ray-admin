import { DashboardOutlined, MenuFoldOutlined, UserOutlined } from "@ant-design/icons";

export const baseMenu = [
  {
    key: "/main",
    icon: <DashboardOutlined />,
    label: "仪表板",
  },
  {
    key: "/main/user",
    icon: <UserOutlined />,
    label: "用户列表",
  },
  {
    key: "/main/menu",
    icon: <MenuFoldOutlined />,
    label: "菜单管理",
  }
];
