import ThemeProvider from "@/components/layout/ThemeToggle/theme-provider";
import "@/styles/globals.css";
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`overflow-hidden font-sans`}>
        <ThemeProvider
          attribute="class"
          themes={["light", "dark"]}
          defaultTheme="dark"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
