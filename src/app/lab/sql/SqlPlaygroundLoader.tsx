"use client";

import dynamic from "next/dynamic";

const SqlPlayground = dynamic(() => import("./SqlPlayground"), { ssr: false });

export default function SqlPlaygroundLoader() {
  return <SqlPlayground />;
}