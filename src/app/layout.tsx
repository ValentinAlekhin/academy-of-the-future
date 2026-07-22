import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { getSiteBaseUrl, OG_IMAGE_SIZE, SITE_METADATA_COPY } from "@/constants/metadata";
import "./globals.css";

const metadataBase = getSiteBaseUrl();
const socialImageUrl = new URL(SITE_METADATA_COPY.ogImagePath, metadataBase).toString();

export const metadata: Metadata = {
  metadataBase,
  title: SITE_METADATA_COPY.title,
  description: SITE_METADATA_COPY.description,
  icons: { icon: socialImageUrl },
  openGraph: {
    type: "website",
    locale: SITE_METADATA_COPY.locale,
    siteName: SITE_METADATA_COPY.siteName,
    title: SITE_METADATA_COPY.title,
    description: SITE_METADATA_COPY.description,
    images: [
      {
        url: socialImageUrl,
        width: OG_IMAGE_SIZE.width,
        height: OG_IMAGE_SIZE.height,
        alt: SITE_METADATA_COPY.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_METADATA_COPY.title,
    description: SITE_METADATA_COPY.description,
    images: [socialImageUrl],
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
