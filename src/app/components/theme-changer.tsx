import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";

function ThemeChanger() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <div className="mr-4 flex items-center">
      {theme === "dark" ? (
        <span
          className="iconfont icon-rijianmoshixhdpi cursor-pointer text-xl dark:text-white"
          onClick={() => setTheme("light")}
        />
      ) : (
        <span
          className="iconfont icon-yueduye-yejianmoshi cursor-pointer text-xl dark:text-white"
          onClick={() => setTheme("dark")}
        />
      )}
    </div>
  );
}

export default ThemeChanger;
