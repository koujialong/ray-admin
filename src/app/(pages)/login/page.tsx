"use client";
import { Button, Card, Form, Input, message } from "antd";
import FormItem from "antd/es/form/FormItem";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function Login() {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const login = async (info: { username: string; password: string }) => {
    const auth = await signIn("credentials", {
      ...info,
      redirect: false,
    });
    if (auth?.ok) {
      router.replace("/main");
    } else {
      messageApi.open({
        type: "error",
        content: "用户名或密码错误",
      });
    }
  };

  const register = () => {
    router.push("/register");
  };
  return (
    <div className="h-screen w-screen bg-blue-500">
      {contextHolder}
      <Card
        className="absolute right-32 top-1/3 h-fit w-60"
        style={{ position: "absolute" }}
      >
        <Form onFinish={login} className="w-full">
          <FormItem
            name="name"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input placeholder="用户名/邮箱"></Input>
          </FormItem>
          <FormItem
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input type="password" placeholder="密码"></Input>
          </FormItem>
          <Form.Item
            className="flex w-full justify-between"
            style={{ marginBottom: 0 }}
          >
            <Button
              type="primary"
              htmlType="submit"
              className="mr-7 mt-0 flex w-20"
              style={{ marginTop: 0 }}
            >
              登录
            </Button>
            <Button
              onClick={register}
              className="mt-0 flex w-20"
              style={{ marginTop: 0 }}
            >
              注册
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
