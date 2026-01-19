import { ReactNode } from "react";
import { Metadata } from "next";
import "./globals.css";
import "./font.css";
import OCModalClient from "@/components/home/OCModalClient";

type Props = {
  children: ReactNode;
};

export const metadata: Metadata = {
  metadataBase: new URL("https://resume.rayinlab.cn"),
  verification: {
    other: {
      'msvalidate.01': 'AB4F1F58A847C9FF9643B1114135D0BF'
    }
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

export default function RootLayout({ children }: Props) {
  return (
    <>
      {children}
      <OCModalClient />
    </>
  );
}
