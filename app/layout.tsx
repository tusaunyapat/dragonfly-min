import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/navbar";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

import { Prompt } from "next/font/google";

const prompt = Prompt({
  subsets: ["latin", "thai"],
  variable: "--font-prompt",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="bumblebee"
      className={prompt.className}
      suppressHydrationWarning
    >
      <body className="bg-white text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="bumblebee"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center gap-4 ">
            <div className="flex-1 w-full flex flex-col items-center">
              <div className="flex-1 flex  justify-start w-full flex-col items-start z-99">
                {/* <HeaderAuth /> */}
                <Navbar />
                <div className="flex-1 w-full flex flex-col items-center">
                  <div className="flex flex-col justify-center gap-20 w-full">
                    {children}
                  </div>
                  {/* <Footer /> */}
                </div>
              </div>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
