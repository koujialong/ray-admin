import { Button } from "@/components/ui/button";
import { House } from "lucide-react";
import initTranslations from "./i18n";
import { cookies } from "next/headers";

export default async function Index() {
  const locale = (await cookies()).get("NEXT_LOCALE")?.value || "cn";
  const { t } = await initTranslations(locale, ["common"]);
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-full w-full bg-white bg-gradient-to-r text-black dark:bg-black dark:text-white">
        <div className="flex min-h-screen items-center justify-center px-2">
          <div className="text-center">
            <h1 className="text-9xl font-bold">404</h1>
            <p className="mb-8 mt-4 text-2xl font-medium">
              {t("Oops! Page not found")}
            </p>
            <Button>
              <a href="/" className="flex items-center gap-2">
                <House />
                {t("Go Home")}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
