"use client";
import React from "react";
import HTMLEdit from "@/app/[locale]/(pages)/main/com/editor/components/html-edit";
import SQLEdit from "@/app/[locale]/(pages)/main/com/editor/components/sql-edit";
import RechTextEdit from "@/app/[locale]/(pages)/main/com/editor/components/rechtext-edit";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageContainer from "@/components/layout/page-container";

function Edit() {
  return (
    <PageContainer>
      <Tabs defaultValue="1" className="w-full">
        <TabsList className="grid w-[600px] grid-cols-3">
          <TabsTrigger value="1">SQL</TabsTrigger>
          <TabsTrigger value="2">HTML</TabsTrigger>
          <TabsTrigger value="3">富文本</TabsTrigger>
        </TabsList>
        <TabsContent value="1">
          <SQLEdit />
        </TabsContent>
        <TabsContent value="2">
          <HTMLEdit />
        </TabsContent>
        <TabsContent value="3">
          <RechTextEdit />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}

export default Edit;
