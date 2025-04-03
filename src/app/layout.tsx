import { Inter } from "next/font/google";
import "./globals.css";
import WebVitalsMonitor from "@/components/WebVitalsMonitor";
import LanguageSelectionPrompt from "@/components/LanguageSelectionPrompt";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
  title: "Portfolio",
  description: "My professional portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <WebVitalsMonitor />
        <LanguageSelectionPrompt />
        {children}
      </body>
    </html>
  );
}
