import type { Metadata } from "next";
import "./offers.css";

export const metadata: Metadata = {
  title: "Flent | Your Property Offer",
  description:
    "Partner with Flent for professional property management and consistent rental income.",
};

export default function OffersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="offers-root">{children}</div>;
}
