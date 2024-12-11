"use client";
import { ConfigForm } from "@/components/form/config-form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
interface LoginFormValues {
  username: string;
  password: string;
}
export default function Login() {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const login = async (values: LoginFormValues) => {
    const { username, password } = values;
    setLoading(true);
    const auth = await signIn("credentials", {
      name: username,
      password,
      redirect: false,
    });
    setLoading(false);
    if (auth?.ok) {
      location.href = "/main";
    } else {
      toast({
        variant: "destructive",
        description: `${t("username")}/${t("password")} ${t("error")}`,
      });
    }
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
        <div className="mx-auto flex max-w-sm overflow-hidden rounded-lg bg-white bg-opacity-10 shadow-lg backdrop-blur-lg backdrop-filter">
          <div className="w-full p-8 dark:bg-opacity-30">
            <h2 className="mb-4 text-center text-2xl font-semibold text-white">
              NEXT
            </h2>
            <ConfigForm
              className="w-full"
              formItems={[
                {
                  key: "username",
                  type: "Input",
                  placeholder: `${t("please input")} ${t("username")}`,
                  rule: z
                    .string()
                    .min(1, `${t("please input")} ${t("username")}`),
                },
                {
                  key: "password",
                  type: "Input",
                  inputType: "password",
                  placeholder: `${t("please input")} ${t("password")}`,
                  rule: z
                    .string()
                    .min(1, `${t("please input")} ${t("password")}`),
                },
              ]}
              onSubmit={login}
              footer={
                <Button type="submit" className="w-full">
                  {t("sign in")}
                </Button>
              }
            />
            <div className="mt-4 flex items-center justify-between">
              <span className="w-1/5 border-b md:w-1/4"></span>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/register");
                }}
                className="text-xs uppercase text-white"
              >
                {t("register")}
              </a>
              <span className="w-1/5 border-b md:w-1/4"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
