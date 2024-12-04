"use client";
import ConfigProvider from "antd/es/config-provider";
import React, { useEffect, useState } from "react";
import themeMap from "../theme/themeConfig";
import { useTheme } from "next-themes";
import Loading from "../[locale]/loading";

function AntdProvider({ children }) {
  const { theme: currentTheme } = useTheme();
  const theme = themeMap[currentTheme];
  console.log("currentTheme", theme, currentTheme);
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return <Loading/>;
  }
  return <ConfigProvider theme={theme}>{children}</ConfigProvider>;
}
export default AntdProvider;
