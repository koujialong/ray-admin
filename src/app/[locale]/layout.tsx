import "@/styles/globals.css";

import { cookies } from "next/headers";

import { TRPCReactProvider } from "@/trpc/react";
import TranslationsProvider from "../providers/translations-provider";
import initTranslations from "../i18n";
import { Suspense } from "react";
import Loading from "./loading";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
const i18nNamespaces = ["common", "menu", "dashboard"];

export const metadata = {
  title: "Ray Admin",
  description: "Welcome Ray Admin",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({ children, params }) {
  const { resources } = await initTranslations(
    params.locale as string,
    i18nNamespaces,
  );
  return (
    <html lang="en">
      <body className={`overflow-hidden font-sans`}>
        <TRPCReactProvider cookies={cookies().toString()}>
          <ThemeProvider
            attribute="class"
            themes={["light", "dark"]}
            defaultTheme="dark"
          >
            <TranslationsProvider
              namespaces={i18nNamespaces}
              locale={params.locale as string}
              resources={resources}
            >
              <Toaster />
              <Suspense fallback={<Loading />}>{children}</Suspense>
            </TranslationsProvider>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
