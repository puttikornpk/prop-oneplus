import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import LanguageWrapper from "@/components/layout/LanguageWrapper";
import { AuthProvider } from "@/context/AuthContext";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PropertyOnePlus | เว็บประกาศ ขาย ให้เช่า บ้าน คอนโด ที่ดิน ยอดนิยมและดีที่สุด ลงประกาศได้ฟรี",
  description: "PropertyOnePlus เว็บไซต์ศูนย์รวมประกาศซื้อ-ขาย-เช่า อสังหาริมทรัพย์ บ้าน คอนโด ที่ดิน ทาวน์โฮม อาคารพาณิชย์ ลงประกาศฟรี ครบจบในที่เดียว",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <NextAuthProvider>
            <LanguageWrapper>{children}</LanguageWrapper>
          </NextAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
