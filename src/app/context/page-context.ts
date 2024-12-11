"use client";
import { createContext } from "react";
interface PageContextProp {
  reloadMenu: () => void;
}

const PageContext = createContext<PageContextProp>({} as PageContextProp);

export { PageContext };
