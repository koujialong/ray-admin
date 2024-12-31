import ThemeProvider from "@/components/layout/ThemeToggle/theme-provider";
import "@/styles/globals.css";
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
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
