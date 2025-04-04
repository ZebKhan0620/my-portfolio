import type { Metadata } from "next";
import { Inter, Noto_Sans_JP, Playfair_Display } from "next/font/google";
import "./globals.css";
import { twMerge } from "tailwind-merge";
import { LanguageProvider } from '@/contexts/LanguageContext';

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const notoSansJP = Noto_Sans_JP({ 
  subsets: ["latin"],
  variable: "--font-jp",
  weight: ["400", "500", "700"]
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "My Portfolio",
  description: "Created with the help of Frontend Tribe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={twMerge(
          inter.className,
          notoSansJP.variable,
          playfair.variable,
          "bg-gray-900 text-white antialiased font-sans"
        )}
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
