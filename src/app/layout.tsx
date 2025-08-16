import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/components/ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Conversor Universal - Converta Documentos Online",
  description: "Converta seus documentos entre PDF, DOCX, TXT, HTML e Markdown de forma rápida, segura e gratuita. Interface moderna e intuitiva.",
  keywords: "conversor, documentos, PDF, DOCX, HTML, Markdown, conversão online",
  authors: [{ name: "Conversor Universal" }],
  robots: "index, follow",
  openGraph: {
    title: "Conversor Universal de Documentos",
    description: "Converta seus documentos entre diferentes formatos de forma rápida e segura",
    type: "website",
    locale: "pt_BR",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
