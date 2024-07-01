"use client";
import React, { createElement, useEffect, useRef, useState } from "react";
import { Button, Popconfirm, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import * as Icon from "@ant-design/icons";
import { MENU_TYPE_MAP, STATUS } from "@/app/[locale]/constant";
import MenuModal, {
  MenuModalRefType,
} from "@/app/[locale]/(pages)/main/system/menu/_components/MenuModal";

const Icons: { [key: string]: any } = Icon;

export interface MenuType {
  id: string;
  label: string;
  key: string;
  icon: string;
  parent?: string | null;
  parentMenu?: MenuType | null;
}

const MenuList: React.FC = () => {
  const router = useRouter();
  const menuModalRef = useRef<MenuModalRefType>(null)
  const [menus, setMenus] = useState<any>([]);
  const menuController = api.menu.getMenuTree.useMutation({
    onSuccess(data) {
      setMenus(data);
    },
  });
  useEffect(() => {
    menuController.mutate();
  }, []);

  const menuDeleteApi = api.menu.deleteMenuById.useMutation({
    onSuccess() {
      menuController.mutate();
    }
  });
  const deleteMenu = (key: string) => {
    menuDeleteApi.mutate({ key });
  };

  const columns: ColumnsType<MenuType> = [
    {
      title: "标题",
      dataIndex: "label",
      key: "label",
      width:200
    },
    {
      title: "地址",
      dataIndex: "key",
      key: "key",
      width:300
    },
    {
      title: "类型",
      dataIndex: "menuType",
      key: "menuType",
      render: (menuType) => MENU_TYPE_MAP[menuType]
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status) => STATUS[status]
    },
    {
      title: "排序",
      dataIndex: "order",
      key: "order"
    },
    {
      title: "图标",
      dataIndex: "icon",
      key: "icon",
      render: (icon) => (icon ? createElement(Icons[icon]) : "-")
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="删除用户"
            description={`确认删除菜单${record.label}?`}
            okText="确认"
            cancelText="取消"
            onConfirm={() => deleteMenu(record.key)}
          >
            <Button type="link">删除</Button>
          </Popconfirm>
          <Button
            type="link"
            onClick={() =>
              menuModalRef?.current?.setModal(true, "edit", record.id)
            }
          >
            编辑
          </Button>
        </Space>
      )
    }
  ];

  return (
    <>
      <Space className="mb-4">
        <Button
          type="primary"
          onClick={() => menuModalRef?.current?.setModal(true, "add")}
        >
          新增菜单
        </Button>
      </Space>
      <Table
        loading={menuController.isLoading}
        columns={columns}
        dataSource={menus}
        rowKey="id"
        pagination={false}
      />
      <MenuModal ref={menuModalRef} reloadList={menuController.mutate} />
    </>
  );
};

export default MenuList;
