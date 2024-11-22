"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import i18nConfig from "../../../i18nConfig";
import { Select } from "antd";
import { initReactI18next, useTranslation } from "react-i18next";
import { getLanguageRoute } from "../hooks/useLocation";
import i18next from "i18next";


void i18next.use(initReactI18next).init({
  lng: "cn", // if you're using a language detector, do not define the lng option
  debug: true,
  resources: {
    en: {
      common:import(`@/locales/en/common.json`),
    },
    cn: {
      common:import(`@/locales/cn/common.json`),
    },
  },
  // if you see an error like: "Argument of type 'DefaultTFuncReturn' is not assignable to parameter of type xyz"
  // set returnNull to false (and also in the i18next.d.ts options)
  // returnNull: false,
});

export default function LanguageChanger() {
  const currentLocale = getLanguageRoute() ?? "cn";
  const { t } = useTranslation();
  const router = useRouter();
  const currentPathname = usePathname();

  const handleChange = (locale: string) => {
    const currentLocale = getLanguageRoute() ?? "cn";
    const newLocale = locale || "cn";
    // set cookie for next-i18n-router
    const days = 30;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = date.toUTCString();
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`;

    // redirect to the new locale path
    if (
      currentLocale === i18nConfig.defaultLocale &&
      !i18nConfig.prefixDefault
    ) {
      router.push("/" + newLocale + currentPathname);
    } else {
      router.push(
        currentPathname.replace(`/${currentLocale}`, `/${newLocale}`),
      );
    }

    router.refresh();
  };

  return (
    <div className="mr-4">
      <Select onChange={handleChange} value={currentLocale} className="w-28">
        <Select.Option value="cn">🇨🇳 {t("chinese")}</Select.Option>
        <Select.Option value="en">🇬🇧 {t("english")}</Select.Option>
      </Select>
    </div>
  );
}
