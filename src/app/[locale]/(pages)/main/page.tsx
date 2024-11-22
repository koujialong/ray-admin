import initTranslations from "../../../i18n";
import ClientCom from "./components/client";
export default async function DashBoard({ params: { locale } }) {
  const { t } = await initTranslations(locale as string, ["common"]);
  const time = new Date().toDateString();
  const data = {
    name: "kjl",
    age: 12,
    time,
  };
  return (
    <>
      <div>{t("ok")}</div>
      <div>{t("仪表板")}</div>
      <ClientCom data={data}></ClientCom>
    </>
  );
}
