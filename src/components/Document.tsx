import { Inter } from "next/font/google";
import { ReactNode } from "react";

const inter = Inter({
  subsets: ["latin"],
});

type Props = {
  children: ReactNode;
  locale: string;
  bodyClassName?: string;
};

export default function Document({ children, locale, bodyClassName }: Props) {
  return (
    <html className={inter.className} lang={locale} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico?v=2" />
        <script defer src="https://umami.zller.cc/script.js" data-website-id="3a5a4017-dfbd-497b-9565-d459e9d4a27f" data-domains="resume.zller.cn"></script>
      </head>
      <body className={bodyClassName}>{children}</body>
    </html>
  );
}
