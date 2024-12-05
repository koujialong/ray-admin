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
    <div
      className="flex h-screen w-screen items-center justify-center bg-cover"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80)",
      }}
    >
      <div className="w-[1000px] py-16">
        <div className="mx-auto flex max-w-sm overflow-hidden rounded-lg bg-white bg-opacity-10 shadow-md backdrop-blur-lg backdrop-filter">
          <div className="w-full p-8 dark:bg-opacity-30">
            <h2 className="mb-4 text-center text-2xl font-semibold text-white">
              {t("register")}
            </h2>
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
                <Input placeholder={t("username")} />
              </FormItem>
              <FormItem
                name="email"
                rules={[
                  {
                    required: true,
                    message: `${t("please input")} ${t("email")}`,
                  },
                ]}
              >
                <Input type="email" placeholder={t("email")} />
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
                <Input type="password" placeholder={t("password")} />
              </FormItem>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="w-full">
                  {t("register")}
                </Button>
              </Form.Item>
            </Form>
            <div className="mt-4 flex items-center justify-between">
              <span className="w-1/5 border-b md:w-1/4"></span>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/login");
                }}
                className="text-xs uppercase text-white"
              >
                {t("sign in")}
              </a>
              <span className="w-1/5 border-b md:w-1/4"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
