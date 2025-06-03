"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import DashboardCurrent from "./DashboardCurrent";
import { useState, useEffect } from "react";

const Page = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const supabase =  createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/login");
      } else {
        setUser(data.user);
      }
    });
  }, [router]);

  if (!user) return null;

  const email = user.email ?? null;
  return <DashboardCurrent userEmail={email} />;
};

export default Page;
