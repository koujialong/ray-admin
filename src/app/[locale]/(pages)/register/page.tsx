"use client";
import { Button, Card, Form, Input } from "antd";
import FormItem from "antd/es/form/FormItem";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { User } from "@prisma/client";

export default function Register() {
  const { t } = useTranslation();
  const regist = api.user.register.useMutation({
    onSuccess(e) {
      router.replace("/login");
    },
  });
  const router = useRouter();
  const register = async (val) => {
    regist.mutate(val as User);
  };
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-blue-500">
      <Card className="h-fit w-1/4">
        <Form onFinish={register}>
          <FormItem
            name="username"
            rules={[
              {
                required: true,
                message: `${t("please input")} ${t("username")}`,
              },
            ]}
          >
            <Input placeholder={t("username")}></Input>
          </FormItem>
          <FormItem
            name="email"
            rules={[
              { required: true, message: `${t("please input")} ${t("email")}` },
            ]}
          >
            <Input type="email" placeholder={t("email")}></Input>
          </FormItem>
          <FormItem
            name="password"
            rules={[
              {
                required: true,
                message: `${t("please input")} ${t("password")}`,
              },
            ]}
          >
            <Input type="password" placeholder={t("password")}></Input>
          </FormItem>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="mt-5 w-full">
              {t("register")}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
