"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        // No authenticated user → send them to /login
        router.replace("/login");
      } else {
        // User is valid → allow rendering of child pages
        setChecking(false);
      }
    });
  }, [router]);

  // While verifying session, render nothing (or a spinner if desired)
  if (checking) return null;

  return <>{children}</>;
}
