import { ChartType } from "./components/chart";

export type Card = {
  name: string;
  desc: string;
  numb: number;
  unit?: string;
  fillColor: string;
};
export const cardList: Card[] = [
  {
    name: "用户量",
    desc: "用户总量",
    numb: 5000,
    fillColor: "#d0ed57",
  },
  {
    name: "访问量",
    desc: "访问总量",
    numb: 40000,
    fillColor: "#ffc658",
  },
  {
    name: "留存率",
    desc: "用户留存率",
    numb: 99,
    unit: "%",
    fillColor: "#a4de6c",
  },
  {
    name: "使用量",
    desc: "使用总量",
    numb: 5000,
    fillColor: "#82ca9d",
  },
];

export const chartList: ChartType[] = ["radar", "pie", "radarBar"];
