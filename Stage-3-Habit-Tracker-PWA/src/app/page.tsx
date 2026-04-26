"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "./lib/auth";
import { SPLASH_DURATION_MS } from "./lib/constants";
import { SplashScreen } from "./components/shared/SplashScreen";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const session = getSession();
      router.replace(session ? "/dashboard" : "/login");
    }, SPLASH_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [router]);

  return <SplashScreen />;
}
