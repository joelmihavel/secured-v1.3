import type { Metadata } from "next";
import localFont from "next/font/local";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";


const zin = localFont({
  src: "../../font/ZinDisplayCondensed.otf",
  variable: "--font-zin",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const title = "Flent | India's New Standard of Renting";
const description =
  "Unlock India's top 1% rental homes with Flent. Fully furnished, designer homes with no broker hassles and minimal security deposit. Just bring your clothes, and you're home.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    images: "/images/og-image.jpg",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: "/images/og-image.jpg",
  },
};

import { BreadcrumbProvider } from "@/context/BreadcrumbContext";

// ... existing imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${zin.variable} ${plusJakartaSans.variable} antialiased font-body bg-bg-white overscroll-none`}
      >
        {/* HubSpot Tracking Code */}
        <Script
          type="text/javascript"
          id="hs-script-loader"
          src="//js-na2.hs-scripts.com/45469632.js"
          strategy="afterInteractive"
        />
        
        <BreadcrumbProvider>
          <Navbar />
          {children}
          <Footer />
        </BreadcrumbProvider>
      </body>
    </html>
  );
}
