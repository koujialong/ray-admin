"use client";
import React, { useEffect, useRef, useState } from "react";
import { type Card } from "../conts";
import { type CountUp } from "countup.js";
import {
  Card as CardContainer,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";

function HomeCard({ info }: { info: Card }) {
  const { t } = useTranslation("dashboard");
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
    <CardContainer className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{t(info.name)}</CardTitle>
        {info.icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          +<span ref={countupRef}>0</span>
        </div>
        <p className="text-xs text-muted-foreground">
          {info.desc} {t("from last month")}
        </p>
      </CardContent>
    </CardContainer>
  );
}

export default HomeCard;
