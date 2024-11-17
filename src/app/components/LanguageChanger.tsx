"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import i18nConfig from "../../../i18nConfig";
import { Select } from "antd";

export default function LanguageChanger() {
  const { i18n } = useTranslation();
  const currentLocale = i18n.language ?? "cn";
  const router = useRouter();
  const currentPathname = usePathname();

  const handleChange = (locale: string) => {
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
      <Select onChange={handleChange} value={currentLocale}>
        <Select.Option value="cn">中文</Select.Option>
        <Select.Option value="en">英文</Select.Option>
      </Select>
    </div>
  );
}
