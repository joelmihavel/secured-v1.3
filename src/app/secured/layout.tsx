import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flent Secured: Make your rent work for you.",
  description: "Earn 1% back on every timely rent payment. Secured by Flent - making rent rewarding for tenants and protecting rental income for landlords.",
  openGraph: {
    title: "Flent Secured: Make your rent work for you.",
    description: "Earn 1% back on every timely rent payment. Secured by Flent - making rent rewarding for tenants and protecting rental income for landlords.",
    images: [
      {
        url: "/images/og-secured.jpg",
        width: 1200,
        height: 630,
        alt: "Flent Secured - Earn rewards on rent",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Flent Secured: Make your rent work for you.",
    description: "Earn 1% back on every timely rent payment. Secured by Flent - making rent rewarding for tenants and protecting rental income for landlords.",
    images: ["/images/og-secured.jpg"],
  },
};

export default function SecuredLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

