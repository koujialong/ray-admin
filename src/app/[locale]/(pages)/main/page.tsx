'use client'
import { useTranslation } from "react-i18next";
import initTranslations from "../../../i18n";
// @ts-ignore
export default async function DashBoard({ params: { locale } }) {
  const { t } = await initTranslations(locale, ["common"]);
  return <div>{t("ok")}</div>;
}
