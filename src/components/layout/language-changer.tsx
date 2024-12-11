"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import i18nConfig from "../../../i18nConfig";
import { initReactI18next, useTranslation } from "react-i18next";
import { getLanguageRoute } from "../../app/hooks/useLocation";
import i18next from "i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { LanguagesIcon } from "lucide-react";

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

  const handleChange = (locale: string) => {
    const currentLocale = getLanguageRoute() ?? "cn";
    const newLocale = locale || "cn";
    const days = 30;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = date.toUTCString();
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`;

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
    <div className="flex items-center dark:text-white">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <LanguagesIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleChange("cn")}>
            {t("chinese")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleChange("en")}>
            {t("english")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
