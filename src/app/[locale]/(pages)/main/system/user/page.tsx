import PageContainer from "@/components/layout/page-container";
import UserTable from "./_components/user-table";
import { api } from "@/trpc/server";
import { searchParamsCache } from "@/lib/search-params";
import { SearchParams } from "nuqs";

type pageProps = {
  searchParams: SearchParams;
};
const UserList: React.FC = async ({ searchParams }: pageProps) => {
  searchParamsCache.parse(searchParams);
  const page = searchParamsCache.get("page");
  const pageLimit = searchParamsCache.get("limit");
  const userData = await api.user.getUserList.mutate({
    pageNum: page,
    pageSize: pageLimit,
  });

  return (
    <PageContainer scrollable>
      <UserTable list={userData.list ?? []} total={userData.total || 0} />
    </PageContainer>
  );
};

export default UserList;
