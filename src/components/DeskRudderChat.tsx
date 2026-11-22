"use client";

import Script from "next/script";
import { siteConfig } from "@/lib/site";

export function DeskRudderChat() {
  const src = siteConfig.links.chatSrc;

  if (!src) {
    return null;
  }

  return (
    <Script
      id="deskrudder-chat"
      src={src}
      strategy="afterInteractive"
    />
  );
}
