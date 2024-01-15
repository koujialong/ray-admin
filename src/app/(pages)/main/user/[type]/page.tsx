"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";
import { useContext, useEffect, useRef, useState } from "react";
import { Button, Form, FormInstance, Input } from "antd";
import FormItem from "antd/es/form/FormItem";
import { PageContext } from "@/app/context/pageContext";
import { User, userAtom } from "@/app/store/user";
import { useAtom } from "jotai";

interface Params {
  type: "edit" | "view" | "add";
}

export default function UserDetail({ params }: { params: Params }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") as string;
  const [user, setUser] = useAtom(userAtom);

  const findUser = api.user.findUserById.useMutation({
    onSuccess(user) {
      form.setFieldsValue(user);
    },
  });

  const form = Form.useForm()[0];
  useEffect(() => {
    if (["view", "edit"].includes(params.type)) {
      findUser.mutate({ id });
    }
  }, []);

  const userUpdateApi = api.user.upDateUserById.useMutation({
    async onSuccess(data) {
      if (data.id) {
        if (data.id === user.id) {
          setUser(data as User);
        }
        await messageApi.open({
          type: "success",
          content: "修改用户成功",
          duration: 0.3,
        });
        router.back();
      }
    },
  });

  const { messageApi } = useContext(PageContext);
  const registerApi = api.user.register.useMutation({
    async onSuccess(data) {
      if (data.id) {
        await messageApi.open({
          type: "success",
          content: "新增用户成功",
          duration: 0.3,
        });
        router.back();
      }
    },
  });

  const submit = (val: any) => {
    if (params.type === "edit") {
      userUpdateApi.mutate({
        ...val,
        id,
      });
      return;
    }
    registerApi.mutate(val);
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
          name="username"
          rules={[{ required: true, message: "请输入用户名" }]}
        >
          <Input placeholder="用户名"></Input>
        </FormItem>
        <FormItem
          name="email"
          rules={[{ required: true, message: "请输入邮箱" }]}
        >
          <Input
            disabled={params.type !== "add"}
            type="email"
            placeholder="邮箱"
          ></Input>
        </FormItem>
        <FormItem
          name="password"
          rules={[{ required: true, message: "请输入密码" }]}
        >
          <Input type="password" placeholder="密码"></Input>
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
