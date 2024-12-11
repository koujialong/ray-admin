import PageContainer from "@/components/layout/page-container";
import MenuTable from "./_components/menu-table";
import { api } from "@/trpc/server";
import { SearchParams } from "nuqs";
import { searchParamsCache } from "@/lib/search-params";

type pageProps = {
  searchParams: SearchParams;
};
const MenuList: React.FC = async ({ searchParams }: pageProps) => {
  searchParamsCache.parse(searchParams);
  const page = searchParamsCache.get("page");
  const pageLimit = searchParamsCache.get("limit");
  const menuData = await api.menu.getMenuList.mutate({
    pageNum: page,
    pageSize: pageLimit,
  });
  return (
    <PageContainer>
      <MenuTable list={menuData.list ?? []} total={menuData.total ?? 0} />
    </PageContainer>
  );
};

export default MenuList;
