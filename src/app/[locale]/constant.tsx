import { Tag } from "antd";
import { type JSX } from "react";

export const MENU_TYPE_MAP: Record<string, JSX.Element> = {
  M: <Tag color="green">菜单</Tag>,
  D: <Tag color="blue">目录</Tag>
};

export const STATUS: Record<string, JSX.Element> = {
  1: <Tag color="red">停用</Tag>,
  0: <Tag color="green">启用</Tag>
};
