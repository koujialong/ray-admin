"use client";
import { createContext } from "react";
import { MessageInstance } from "antd/es/message/interface";
interface PageContextProp {
  messageApi: MessageInstance;
  reloadMenu: () => void;
}

const PageContext = createContext<PageContextProp>({} as PageContextProp);

export { PageContext };
