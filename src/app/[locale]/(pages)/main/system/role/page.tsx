import PageContainer from "@/components/layout/page-container";
import RoleTable from "./_components/role-table";
import { searchParamsCache } from "@/lib/search-params";
import { api } from "@/trpc/server";
import { SearchParams } from "nuqs";
type pageProps = {
  searchParams: SearchParams;
};
const RoleList: React.FC = async ({ searchParams }: pageProps) => {
  searchParamsCache.parse(searchParams);
  const page = searchParamsCache.get("page");
  const pageLimit = searchParamsCache.get("limit");

  const roleData = await api.role.getRoleList.mutate({
    pageNum: page,
    pageSize: pageLimit,
  });
  return (
    <PageContainer>
      <RoleTable list={roleData.list ?? []} total={roleData.total || 0} />
    </PageContainer>
  );
};

export default RoleList;
