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
        <script defer src="https://umami.zller.cc/script.js" data-website-id="8f8ae41c-68a0-498a-879b-5a68c94781e1" data-domains="resume.rayinlab.cn"></script>
      </head>
      <body className={bodyClassName}>{children}</body>
    </html>
  );
}
