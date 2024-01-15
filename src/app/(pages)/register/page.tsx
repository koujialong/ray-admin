"use client";
import { Button, Card, Form, Input } from "antd";
import FormItem from "antd/es/form/FormItem";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

export default function Register() {
  const regist = api.user.register.useMutation({
    onSuccess(e){
      router.replace("/login");
    }
  });
  const router = useRouter();
  const register = async (val: any) => {
    regist.mutate(val);
  };
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-blue-500">
      <Card className="h-fit w-1/4">
        <Form onFinish={register}>
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
            <Input type="email" placeholder="邮箱"></Input>
          </FormItem>
          <FormItem
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input type="password" placeholder="密码"></Input>
          </FormItem>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="mt-5 w-full">
              注册
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
