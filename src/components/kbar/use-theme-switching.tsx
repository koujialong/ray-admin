import { useRegisterActions } from "kbar";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";

const useThemeSwitching = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const themeAction = [
    {
      id: "toggleTheme",
      name: t("Toggle Theme"),
      section: t("Theme"),
      perform: toggleTheme,
    },
    {
      id: "setLightTheme",
      name: t("Set Light Theme"),
      section: t("Theme"),
      perform: () => setTheme("light"),
    },
    {
      id: "setDarkTheme",
      name: t("Set Dark Theme"),
      section: t("Theme"),
      perform: () => setTheme("dark"),
    },
  ];

  useRegisterActions(themeAction, [theme]);
};

export default useThemeSwitching;
