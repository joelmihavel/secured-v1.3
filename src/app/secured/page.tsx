import React from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { VariantProvider } from "@/components/secured/VariantContext";
import { Preloader } from "@/components/secured/Preloader";
import { SmoothScroll } from "@/components/secured/SmoothScroll";
import { StickyQR } from "@/components/secured/StickyQR";
import { PageContent } from "@/components/secured/PageContent";
import { SecuredLandingContent } from "@/components/secured/SecuredLandingContent";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function SecuredPage() {
  return (
    <div className={`secured-page ${plusJakarta.variable}`}>
      <Preloader />
      <SmoothScroll />
      <VariantProvider>
        <StickyQR />
        <PageContent>
          <SecuredLandingContent />
        </PageContent>
      </VariantProvider>
    </div>
  );
}
