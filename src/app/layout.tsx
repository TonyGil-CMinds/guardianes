import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const outfit = localFont({
  src: "../../public/font/Outfit-VariableFont_wght.ttf",
  variable: "--font-outfit",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "100 Guardianes de la Naturaleza",
  description: "100 Guardianes de la Naturaleza es un programa impulsado por NaturaTech LAC, liderado por BID Lab y C Minds, que busca visibilizar y reconocer a personas que lideran esfuerzos de conservación y regeneración en América Latina y el Caribe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
