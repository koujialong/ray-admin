import Main from "./components/main";
import { api } from "@/trpc/server";
import KBar from "@/components/kbar";
import { ReactNode } from "react";

export default async function RootLayout(props: { children: ReactNode }) {
  const { children } = props;
  const menuData = await api.menu.getAllMenu.mutate();
  return <Main params={{ menuData }}>{children}</Main>;
}
