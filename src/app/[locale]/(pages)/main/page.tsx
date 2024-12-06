import initTranslations from "../../../i18n";
import HomeCard from "./components/home-card";
import MainCharts from "./components/main-charts";
import { cardList, chartList } from "./conts";
import Chart from "./components/chart";
import MessageCard from "./components/messge-card";
export default async function DashBoard({ params: { locale } }) {
  const { t } = await initTranslations(locale as string, ["common"]);
  return (
    <div className="flex h-full flex-col overscroll-y-auto">
      <div className="flex h-1/5 gap-6">
        {cardList.map((card) => (
          <HomeCard key={card.name} info={card} />
        ))}
      </div>
      <div className="mt-4 flex h-2/5 w-full gap-2">
        <div className="h-full w-2/3 rounded-md dark:border dark:border-gray-700">
          <MainCharts />
        </div>
        <div className="h-full w-1/3 rounded-md shadow-lg dark:border dark:border-gray-700">
          <MessageCard />
        </div>
      </div>
      <div className="mt-4 flex h-2/5 w-full gap-2">
        {chartList.map((chartType) => (
          <div
            className="h-full flex-1 rounded-md p-4 shadow-lg dark:border dark:border-gray-700"
            key={chartType}
          >
            <Chart
              options={{
                chartType,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
