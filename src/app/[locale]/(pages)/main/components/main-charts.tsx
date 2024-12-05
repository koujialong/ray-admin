"use client";
import React, { useState } from "react";
import { Card, Segmented } from "antd";
import { AppstoreOutlined, BarsOutlined } from "@ant-design/icons";
import Chart, { type ChartType } from "./chart";

function MainCharts() {
  const [chartType, setType] = useState<ChartType>("bar");
  return (
    <>
      <div className="h-full w-full p-4 shadow-lg">
        <div className="h-full pb-4">
          <Segmented
            value={chartType}
            style={{ marginBottom: 8 }}
            options={[
              { label: "bar", value: "bar", icon: <AppstoreOutlined /> },
              { label: "line", value: "line", icon: <BarsOutlined /> },
            ]}
            onChange={(type) => setType(type as ChartType)}
          />
          <Chart
            options={{
              axis: true,
              chartType,
              tooltip: true,
            }}
          />
        </div>
      </div>
    </>
  );
}

export default MainCharts;
