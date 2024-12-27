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
export default async function DashBoard(props) {
  const params = await props.params;

  const {
    locale
  } = params;

  const { t } = await initTranslations(locale as string, ["dashboard"]);
  return (
    <PageContainer scrollable={true}>
      <div className="xs:flex-col flex h-1/5 gap-6 sm:flex-row">
        {cardList.map((card) => (
          <HomeCard key={card.name} info={card} />
        ))}
      </div>
      <div className="xs:flex-col mt-4 flex h-1/3 w-full flex-col gap-4 sm:flex-row">
        <MainChart className="xs:w-full h-full sm:w-2/3" />
        <CardContainer
          className="xs:w-full col-span-3 h-full sm:w-1/3"
          title={t("Recent Sales")}
          description="You made 265 sales this month."
        >
          <RecentSales />
        </CardContainer>
      </div>
      <div className="xs:flex-col my-4 flex h-1/3 w-full gap-4 sm:flex-row">
        <div className="xs:flex-col xs:w-full flex gap-4  sm:w-2/3 sm:flex-row">
          <HomeLine className="xs:w-full flex-1" />
          <HomeRadar className="xs:w-full flex-1" />
        </div>
        <HomeRing className="xs:w-full sm:w-1/3" />
      </div>
    </PageContainer>
  );
}
