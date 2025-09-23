"use client";
import { useTranslations } from "next-intl";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const OFFER_URL = "https://offer.zller.cn";

export function OfferGuideButton() {
  const t = useTranslations("home");

  return (
    <Button
      variant="outline"
      className="bg-white hover:bg-gray-50 text-gray-900 h-8 text-sm px-4 border border-gray-200"
      asChild
    >
      <a
        href={OFFER_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2"
      >
        🚀 {t("header.offerGuide")}
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </Button>
  );
}
