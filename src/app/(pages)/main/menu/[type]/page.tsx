"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";
import { useContext, useEffect, useRef, useState } from "react";
import { Button, Form, FormInstance, Input, Select } from "antd";
import FormItem from "antd/es/form/FormItem";
import { PageContext } from "@/app/context/pageContext";
import { User, userAtom } from "@/app/store/user";
import { useAtom } from "jotai";
import { MenuType } from "@/app/(pages)/main/menu/page";
import { Option } from "antd/es/mentions";

interface Params {
  type: "edit" | "view" | "add";
}

export default function UserDetail({ params }: { params: Params }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") as string;
  const [menuOption, setMenuOption] = useState<MenuType[]>([]);
  // const [menu, setMenu] = useAtom(userAtom);

  const findMenu = api.menu.findMenuById.useMutation({
    onSuccess(menu) {
      form.setFieldsValue(menu);
    },
  });

  const allMenuApi = api.menu.getOtherAllMenu.useMutation({
    onSuccess(menus) {
      setMenuOption(menus);
    },
  });

  const form = Form.useForm()[0];
  useEffect(() => {
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
          duration: 0.3,
        });
        router.back();
      }
    },
  });

  const { messageApi } = useContext(PageContext);
  const addMenuApi = api.menu.addMenu.useMutation({
    async onSuccess(data) {
      if (data.id) {
        await messageApi.open({
          type: "success",
          content: "新增菜单成功",
          duration: 0.3,
        });
        router.back();
      }
    },
  });

  const submit = async (val: any) => {
    await form.validateFields();
    if (params.type === "edit") {
      menuUpdateApi.mutate({
        ...val,
        id,
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
        className="w-1/3"
        disabled={params.type === "view"}
      >
        <FormItem
          name="label"
          rules={[{ required: true, message: "请输入标题" }]}
        >
          <Input placeholder="标题"></Input>
        </FormItem>
        <FormItem
          name="key"
          // rules={[{ required: true, message: "请输入地址" }]}
        >
          <Input placeholder="地址"></Input>
        </FormItem>
        <FormItem
          name="icon"
          // rules={[{ required: true, message: "请输入图标" }]}
        >
          <Input placeholder="图标"></Input>
        </FormItem>
        <FormItem name="parent">
          <Select placeholder="请选择父级菜单" allowClear>
            {menuOption.map(({ id, label }) => (
              <Select.Option value={id} key={id}>
                {label}
              </Select.Option>
            ))}
          </Select>
        </FormItem>
        {params.type !== "view" && (
          <Form.Item>
            <Button type="primary" htmlType="submit" className="mt-5 w-full">
              {params.type === "edit" ? "修改" : "添加"}
            </Button>
          </Form.Item>
        )}
      </Form>
    </div>
  );
}
