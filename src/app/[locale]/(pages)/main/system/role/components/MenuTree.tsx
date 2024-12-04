import React, { useEffect, useState } from "react";
import { Card, Tree } from "antd";
import type { TreeProps, TreeDataNode } from "antd";
import { api } from "@/trpc/react";
import { type MenuType } from "@/app/types/menu";

const { DirectoryTree } = Tree;

export interface MenuTreeType {
  selMenus: string[];
  setSelMenus: (selMenus: string[]) => void;
}

export default function Index({ selMenus, setSelMenus }: MenuTreeType) {
  const [treeData, setTreeData] = useState<MenuType[]>([]);
  const [list, setList] = useState<MenuType[]>([]);
  const menuApi = api.menu.getAllMenu.useMutation({
    onSuccess(data) {
      setTreeData(data.tree);
      setList(data.list);
    },
  });

  useEffect(() => {
    menuApi.mutate({ isSetting: true });
  }, []);

  const menuCheck: TreeProps["onCheck"] = (keys: any, info) => {
    setSelMenus([...(keys as string[]), ...(info.halfCheckedKeys as string[])]);
  };

  return (
    <Card>
      <DirectoryTree
        multiple
        checkable
        selectable={false}
        fieldNames={{
          title: "label",
        }}
        checkedKeys={selMenus.filter((menuId) => {
          return list.find(
            (it: any) => it.key === menuId && it.menuType === "M",
          );
        })}
        onCheck={menuCheck}
        treeData={treeData as TreeDataNode[]}
      />
    </Card>
  );
}
