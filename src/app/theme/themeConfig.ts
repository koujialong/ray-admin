// theme/themeConfig.ts
import { theme, type ThemeConfig } from "antd";
type ThemeConfigMap = Record<string, ThemeConfig>;
const themeMap: ThemeConfigMap = {
  light: {
    token: {
      fontSize: 16,
      colorPrimary: "#4290f7",
      colorBgContainer: "#fff",
    },
  },
  dark: {
    token: {
      fontSize: 16,
    },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    algorithm: theme?.darkAlgorithm,
  },
};

export default themeMap;
