"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import i18nConfig from "../../../i18nConfig";
import { Dropdown, MenuProps, Select } from "antd";
import { initReactI18next, useTranslation } from "react-i18next";
import { getLanguageRoute } from "../hooks/useLocation";
import i18next from "i18next";

void i18next.use(initReactI18next).init({
  lng: "cn", // if you're using a language detector, do not define the lng option
  debug: true,
  resources: {
    en: {
      common: import(`@/locales/en/common.json`),
    },
    cn: {
      common: import(`@/locales/cn/common.json`),
    },
  },
});
export default function LanguageChanger() {
  const currentLocale = getLanguageRoute() ?? "cn";
  const { t } = useTranslation();
  const router = useRouter();
  const currentPathname = usePathname();

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <a
          rel="noopener noreferrer"
          onClick={() => handleChange("cn")}
          className={currentLocale === "cn" ? "text-blue-500" : "text-gray-400"}
        >
          🇨🇳 {t("chinese")}
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a
          rel="noopener noreferrer"
          onClick={() => handleChange("en")}
          className={currentLocale === "en" ? "text-blue-500" : "text-gray-400"}
        >
          🇬🇧 {t("english")}
        </a>
      ),
    },
  ];
  console.log("items", items);

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
    <div className="mr-4 flex items-center dark:text-white">
      <Dropdown menu={{ items }}>
        <span className="iconfont icon-zhongwenxianshi cursor-pointer text-xl dark:text-white"></span>
      </Dropdown>
    </div>
  );
}
