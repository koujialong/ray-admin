"use client";
import React from "react";
import { Tabs } from "antd";
import HTMLEdit from "@/app/[locale]/(pages)/main/com/editor/components/HTMLEdit";
import SQLEdit from "@/app/[locale]/(pages)/main/com/editor/components/SQLEdit";
import RechTextEdit from "@/app/[locale]/(pages)/main/com/editor/components/RechTextEdit";

function Edit() {
  return <div className="w-full h-full">
    <Tabs defaultActiveKey="1"
          type="card"
          items={[
            {
              label: `SQL`,
              key: "1",
              children: <SQLEdit />
            },
            {
              label: `HTML`,
              key: "2",
              children: <HTMLEdit />
            },
            {
              label: `富文本`,
              key: "3",
              children: <RechTextEdit />
            }
          ]}
    >
    </Tabs>
  </div>;

}

export default Edit;
