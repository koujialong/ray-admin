"use client";
import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  BarChart,
  PolarGrid,
  PolarAngleAxis,
  Legend,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  PieChart,
  Pie,
  RadialBarChart,
  RadialBar,
} from "recharts";
const defaultData = [
  "Page A",
  "Page B",
  "Page C",
  "Page D",
  "Page E",
  "Page F",
  "Page G",
  "Page H",
  "Page I",
  "Page J",
  "Page K",
  "Page L",
];
type ChartDataItem = {
  name: string;
  uv?: number;
  pv?: number;
  amt?: number;
};
type ChartOptions = {
  grid?: false;
  fillColor?: string;
  strokeColor?: string;
  tooltip?: boolean;
  axis?: boolean;
  chartType: ChartType;
};
export type ChartType = "line" | "bar" | "radar" | "pie" | "radarBar";
type ChartComponent = typeof BarChart | typeof AreaChart;
const chartMap: Record<ChartType, ChartComponent> = {
  bar: BarChart,
  line: AreaChart,
  radar: RadarChart,
  pie: PieChart,
  radarBar: RadialBarChart,
};

const style = {
  top: "50%",
  right: 0,
  transform: "translate(0, -50%)",
  lineHeight: "24px",
};

const colors = [
  "#8884d8",
  "#83a6ed",
  "#8dd1e1",
  "#82ca9d",
  "#a4de6c",
  "#d0ed57",
  "#ffc658",
];
const getNumb = () => Math.floor(Math.random() * 100) + 1;
function Chart({ options }: { options: ChartOptions }) {
  const {
    grid,
    fillColor,
    strokeColor,
    tooltip,
    axis,
    chartType = "bar",
  } = options;
  const [data, setData] = useState<ChartDataItem[]>([
    ...defaultData.map((it) => ({ name: it })),
  ]);
  useEffect(() => {
    const defaultData = ["radar", "radarBar"].includes(chartType)
      ? data.slice(0, 6)
      : data;
    setData(
      defaultData.map((it, idx) => ({
        ...it,
        uv: getNumb(),
        pv: getNumb(),
        amt: getNumb(),
        value: getNumb(),
        fill: colors[idx % 6],
      })),
    );
  }, []);
  const ChartComponent = chartMap[chartType];
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ChartComponent
          width={500}
          height={400}
          data={data}
          innerRadius="10%"
          outerRadius="80%"
          barSize={30}
          cx="50%"
          cy="50%"
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 10,
          }}
        >
          {grid && <CartesianGrid strokeDasharray="3 3" />}
          {tooltip && <Tooltip />}
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={fillColor || "#8884d8"}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={fillColor || "#8884d8"}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          {axis && (
            <>
              <XAxis dataKey="name" width={10} fontSize={10} stroke="#d1d5db" />
              <YAxis width={30} fontSize={10} stroke="#d1d5db" />
            </>
          )}

          {chartType === "line" && (
            <Area
              type="monotone"
              dataKey="uv"
              stroke={strokeColor || "#8884d8"}
              fill="url(#colorUv)"
            />
          )}
          {chartType === "bar" && (
            <>
              <Bar dataKey="pv" fill="#8884d8" activeBar={null} />
              <Bar dataKey="uv" fill="#82ca9d" activeBar={null} />
            </>
          )}
          {chartType === "radar" && (
            <>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="uv"
                dataKey="uv"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
              <Radar
                name="pv"
                dataKey="pv"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.6}
              />
            </>
          )}
          {chartType === "pie" && (
            <>
              <Pie
                data={data.slice(0, 4)}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
              />
              <Pie
                data={data.slice(5, 10)}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                fill="#82ca9d"
                label
              />
            </>
          )}
          {chartType === "radarBar" && (
            <>
              <RadialBar
                label={{ position: "insideStart", fill: "#fff" }}
                background
                dataKey="uv"
              />
            </>
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
}

export default Chart;
