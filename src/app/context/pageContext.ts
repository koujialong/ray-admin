"use client";
import { createContext } from "react";
import { MessageInstance } from "antd/es/message/interface";
import { I18nextProvider } from 'react-i18next';
import initTranslations from '@/app/i18n';
import { createInstance } from 'i18next';

interface PageContextProp {
  messageApi: MessageInstance;
}

const PageContext = createContext<PageContextProp>({} as PageContextProp);

export { PageContext };
