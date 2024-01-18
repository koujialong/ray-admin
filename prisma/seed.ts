import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users: Prisma.UserCreateInput[] = [
    {
      email: "admin@123.com",
      username: "admin",
      image: null,
      password: "admin"
    }
  ];
  await Promise.all(
    users.map(async (user) => {
      await prisma.user.create({
        data: user
      });
    })
  );

  const menus: Prisma.MenuCreateInput[] = [
    {
      id: "clrhh5o0o00031675y9aktyvw",
      label: "404",
      key: "/404",
      icon: "AlertOutlined",
      parent: null,
      order: 11,
      menuType: "M",
      status: "0",
    },
    {
      id: "clrhklkpb0003orke22p701sk",
      label: "仪表板",
      key: "/main",
      icon: "DashboardOutlined",
      parent: null,
      order: 1,
      menuType: "M",
      status: "0",
    },
    {
      id: "clrg0w3pq0003nw8qujdz6ybe",
      label: "组件",
      key: "/main/com",
      icon: "AppstoreOutlined",
      parent: null,
      order: 3,
      menuType: "D",
      status: "0",
    },
    {
      id: "clrg1c4rb00001675pxkkkko7",
      label: "编辑器",
      key: "/main/com/editor",
      icon: "CreditCardOutlined",
      parent: "clrg0w3pq0003nw8qujdz6ybe",
      order: 4,
      menuType: "M",
      status: "0",
    },
    {
      id: "clrg0xzvj0004nw8qarow3brk",
      label: "表格",
      key: "/main/com/table",
      icon: "TableOutlined",
      parent: "clrg0w3pq0003nw8qujdz6ybe",
      order: 5,
      menuType: "M",
      status: "0",
    },
    {
      id: "clrhkj1nk0001orkekm8vurm2",
      label: "菜单管理",
      key: "/main/system/menu",
      icon: "MenuOutlined",
      parent: "clrhkhx7z0000orkeqpuq6txt",
      order: 1,
      menuType: "M",
      status: "0",
    },
    {
      id: "clrhkjv2p0002orkenu6kmc81",
      label: "用户管理",
      key: "/main/system/user",
      icon: "UserOutlined",
      parent: "clrhkhx7z0000orkeqpuq6txt",
      order: 2,
      menuType: "M",
      status: "0",
    },
    {
      id: "clrhkhx7z0000orkeqpuq6txt",
      label: "系统管理",
      key: "/system",
      icon: "SettingFilled",
      parent: null,
      order: 10,
      menuType: "D",
      status: "0",
    },
  ];
  await Promise.all(
    menus.map(async (menu) => {
      await prisma.menu.create({
        data: menu
      });
    })
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
