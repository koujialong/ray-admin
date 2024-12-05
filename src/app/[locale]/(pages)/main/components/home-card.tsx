"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { type Card } from "../conts";
import { type CountUp } from "countup.js";
import Chart from "./chart";
import Loading from "@/app/[locale]/loading";
import { resolve } from "path";

function HomeCard({ info }: { info: Card }) {
  const countupRef = useRef<HTMLHeadingElement>(null);
  let countUpAnim: CountUp;
  useEffect(() => {
    initCountUp();
  }, []);

  async function initCountUp() {
    const countUpModule = await import("countup.js");
    countUpAnim = new countUpModule.CountUp(countupRef.current, info.numb);
    if (!countUpAnim.error) {
      countUpAnim.start();
    } else {
      console.error(countUpAnim.error);
    }
  }
  return (
    <div className="flex h-full w-1/4 rounded-md bg-blue-50 p-4 text-slate-600 shadow-lg dark:bg-transparent dark:text-white dark:border dark:border-gray-700">
      <div className="w-28">
        <div className="text-xl ">{info.name}</div>
        <div className="text-bas mt-2">{info.desc}</div>
        <div className="mt-2 flex text-3xl text-blue-500 dark:text-white">
          <div ref={countupRef}>0</div>
          {info.unit && <span>{info.unit}</span>}
        </div>
      </div>
      <div className="flex-1">
        <Chart
          options={{
            grid: false,
            chartType: "line",
          }}
        />
      </div>
    </div>
  );
}

export default HomeCard;
