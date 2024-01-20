"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";
import { createElement, useContext, useEffect, useRef, useState } from "react";
import { Button, Form, FormInstance, Input, InputNumber, Radio, Select } from "antd";
import FormItem from "antd/es/form/FormItem";
import { PageContext } from "@/app/context/pageContext";
import { MenuType } from "@/app/(pages)/main/system/menu/page";
import * as Icon from "@ant-design/icons";
import { MENU_TYPE_MAP, STATUS } from "@/app/constant";

const Icons: { [key: string]: any } = Icon;

interface Params {
  type: "edit" | "view" | "add";
}

export default function UserDetail({ params }: { params: Params }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") as string;
  const [menuOption, setMenuOption] = useState<MenuType[]>([]);
  const [icons, setIcons] = useState(
    Object.keys(Icon).map((value) => ({
      value,
      label: createElement(Icons[value])
    }))
  );

  const findMenu = api.menu.findMenuById.useMutation({
    onSuccess(menu) {
      form.setFieldsValue(menu);
    }
  });

  const allMenuApi = api.menu.getOtherAllMenu.useMutation({
    onSuccess(menus) {
      setMenuOption(menus);
    }
  });

  const form = Form.useForm()[0];
  useEffect(() => {
    form.setFieldsValue({
      menuType: "D",
      status: "0"
    });
    if (["view", "edit"].includes(params.type)) {
      findMenu.mutate({ id });
    }
    allMenuApi.mutate(id || "");
  }, []);

  const menuUpdateApi = api.menu.upDateMenuById.useMutation({
    async onSuccess(data) {
      if (data.id) {
        await messageApi.open({
          type: "success",
          content: "修改菜单成功",
          duration: 0.3
        });
        router.back();
      }
    }
  });

  const { messageApi } = useContext(PageContext);
  const addMenuApi = api.menu.addMenu.useMutation({
    async onSuccess(data) {
      if (data.id) {
        await messageApi.open({
          type: "success",
          content: "新增菜单成功",
          duration: 0.3
        });
        router.back();
      }
    }
  });

  const submit = async (val: any) => {
    if (params.type === "edit") {
      menuUpdateApi.mutate({
        ...val,
        id
      });
      return;
    }
    addMenuApi.mutate(val);
  };
  return (
    <div className="flex flex-col items-center">
      <Form
        onFinish={submit}
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        className="w-1/3"
        disabled={params.type === "view"}
      >
        <FormItem
          name="label"
          label="标题"
          rules={[{ required: true, message: "请输入标题" }]}
        >
          <Input placeholder="标题"></Input>
        </FormItem>
        <FormItem name="menuType"
                  label="类型"
                  rules={[{ required: true }]}>
          <Radio.Group>
            {Object.keys(MENU_TYPE_MAP).map(key =>
              <Radio value={key} key={key}>{MENU_TYPE_MAP[key]}</Radio>)}
          </Radio.Group>
        </FormItem>
        <FormItem name="key"
                  label="地址"
                  rules={[{ required: true, message: "请输入地址" }]}>
          <Input placeholder="地址" disabled={params.type === "edit" || params.type === "view"}></Input>
        </FormItem>
        <FormItem name="parent" label="父级菜单">
          <Select placeholder="请选择父级菜单">
            {menuOption.map(({ id, label }) => (
              <Select.Option value={id} key={id}>
                {label}
              </Select.Option>
            ))}
          </Select>
        </FormItem>
        <FormItem name="status"
                  label="状态"
                  rules={[{ required: true }]}>
          <Radio.Group>
            {Object.keys(STATUS).map(key =>
              <Radio value={key} key={key}>{STATUS[key]}</Radio>)}
          </Radio.Group>
        </FormItem>
        <FormItem name="icon" label="图标">
          <Select placeholder="请选择图标" showSearch>
            {icons.map(({ value, label }) => (
              <Select.Option value={value} key={value}>
                {label}
                <span className="ml-2">{value}</span>
              </Select.Option>
            ))}
          </Select>
        </FormItem>
        <FormItem
          name="order"
          label="排序"
          rules={[{ required: true, message: "请输入排序" }]}
        >
          <InputNumber min="0" placeholder="排序"></InputNumber>
        </FormItem>
        {params.type !== "view" && (
          <Form.Item
            wrapperCol={{ span: 24 }}
            className="w-full justify-center flex"
          >
            <Button type="primary" htmlType="submit" className="mt-5 w-60">
              {params.type === "edit" ? "修改" : "添加"}
            </Button>
          </Form.Item>
        )}
      </Form>
    </div>
  );
}
