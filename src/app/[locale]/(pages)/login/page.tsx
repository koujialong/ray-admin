"use client";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function Login() {
  const { t } = useTranslation();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    if (!username || !password) {
      alert(t("fields_required"));
      return;
    }

    const auth = await signIn("credentials", {
      name: username,
      password,
      redirect: false,
    });

    if (auth?.ok) {
      location.href='/main'
    } else {
      alert(`${t("username")}/${t("password")} ${t("error")}`);
    }
  };

  const register = () => {
    router.push("/register");
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center dark:bg-gray-900">
      <div className="w-[1000px] py-16">
        <div className="mx-auto flex max-w-sm overflow-hidden rounded-lg bg-white shadow-lg lg:max-w-4xl">
          <div
            className="hidden bg-cover lg:block lg:w-1/2"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1546514714-df0ccc50d7bf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80')",
            }}
          ></div>
          <div className="w-full p-8 lg:w-1/2">
            <h2 className="text-center text-2xl font-semibold text-gray-700">
              NEXT
            </h2>
            <p className="text-center text-xl text-gray-600">Welcome back!</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="w-1/5 border-b lg:w-1/4"></span>
              <a
                href="#"
                className="text-center text-xs uppercase text-gray-500"
              >
                login with username
              </a>
              <span className="w-1/5 border-b lg:w-1/4"></span>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                login();
              }}
            >
              <div className="mt-4">
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  {t("username")}
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full appearance-none rounded border border-gray-300 bg-gray-200 px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mt-4">
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  {t("password")}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full appearance-none rounded border border-gray-300 bg-gray-200 px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mt-8">
                <button
                  type="submit"
                  className="w-full rounded bg-gray-700 px-4 py-2 font-bold text-white hover:bg-gray-600"
                >
                  {t("sign in")}
                </button>
              </div>
            </form>
            <div className="mt-4 flex items-center justify-between">
              <span className="w-1/5 border-b md:w-1/4"></span>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  register();
                }}
                className="text-xs uppercase text-gray-500"
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
