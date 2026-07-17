import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#070b10",
  colorScheme: "dark",
};

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const baseUrl = `${protocol}://${host}`;

  return {
    title: "PaceGuard AI — Adaptive Athlete Intelligence",
    description: "An explainable AI coaching command center for safer, human-approved training decisions.",
    applicationName: "PaceGuard AI",
    openGraph: {
      type: "website",
      url: baseUrl,
      title: "PaceGuard AI",
      description: "Protect the race window with explainable athlete intelligence.",
      images: [{ url: `${baseUrl}/og.png`, width: 1733, height: 908, alt: "PaceGuard AI — Protect the race window" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "PaceGuard AI",
      description: "Protect the race window with explainable athlete intelligence.",
      images: [`${baseUrl}/og.png`],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
