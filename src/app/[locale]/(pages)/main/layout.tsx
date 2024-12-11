import Main from "./components/main";
import { api } from "@/trpc/server";
import KBar from "@/components/kbar";

export default async function RootLayout(props) {
  const { children, params } = props;
  const menuData = await api.menu.getAllMenu.mutate();
  return <Main params={{ locale: params.locale, menuData }}>{children}</Main>;
}
