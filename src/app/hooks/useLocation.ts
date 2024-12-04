import i18nConfig from "i18nConfig";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
// import translation from './en/translation.json';

void i18next.use(initReactI18next).init({
  lng: "en", // if you're using a language detector, do not define the lng option
  debug: true,
  resources: {
    en: {
      common: import(`@/locales/en/common.json`),
    },
    cn: {
      common: import(`@/locales/cn/common.json`),
    },
  },
  // if you see an error like: "Argument of type 'DefaultTFuncReturn' is not assignable to parameter of type xyz"
  // set returnNull to false (and also in the i18next.d.ts options)
  // returnNull: false,
});

function getLanguageRoute(): string | null {
  if (typeof window === "undefined") {
    return null; // 在服务器端返回 null 或其他默认值
  }
  const url = window?.location?.href;
  const urlObj = new URL(url);
  const path = urlObj.pathname;

  // 使用正则表达式匹配两位的字母组合
  const match = path.match(/\/([a-z]{2})\//);

  if (match?.[1] && i18nConfig.locales.includes(match[1])) {
    return match[1];
  }

  return null;
}

export { getLanguageRoute };
