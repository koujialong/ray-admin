import initTranslations from "../../../i18n";
import HomeCard from "./components/home-card";
import { MainChart } from "./components/home-charts";
import { cardList } from "./conts";
import PageContainer from "@/components/layout/page-container";
import { CardContainer } from "@/components/card-container";
import { RecentSales } from "./components/recent-sales";
import { HomeRadar } from "./components/home-radar";
import { HomeRing } from "./components/home-ring";
import { HomeLine } from "./components/home-line";
export default async function DashBoard({ params: { locale } }) {
  const { t } = await initTranslations(locale as string, ["dashboard"]);
  return (
    <PageContainer scrollable={true}>
      <div className="flex h-1/5 gap-6">
        {cardList.map((card) => (
          <HomeCard key={card.name} info={card} />
        ))}
      </div>
      <div className="mt-4 flex h-1/3 w-full gap-4">
        <MainChart className="h-full w-2/3" />
        <CardContainer
          className="col-span-3 h-full w-1/3"
          title={t("Recent Sales")}
          description="You made 265 sales this month."
        >
          <RecentSales />
        </CardContainer>
      </div>
      <div className="my-4 flex h-1/3 w-full gap-4">
        <div className="flex w-2/3 gap-4">
          <HomeLine className="flex-1" />
          <HomeRadar className="flex-1" />
        </div>
        <HomeRing className="w-1/3" />
      </div>
    </PageContainer>
  );
}
