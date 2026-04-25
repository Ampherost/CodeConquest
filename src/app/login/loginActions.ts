"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { handleError } from "@/app/signup/lib/utility";

type ActionState = {
  success: false;
  error: { message: string | string[]; status: number; password?: string | string[]; email?: string | string[] };
} | null;

export async function HandleSignIn(_state: ActionState, formData: FormData): Promise<ActionState> {
  const payload = {
    email: (formData.get("email") as string) || "",
    password: (formData.get("password") as string) || "",
  };

  let redirectTo: string;

  try {
    const client = await createClient();
    const {
      data: { user },
      error: signInError,
    } = await client.auth.signInWithPassword(payload);

    if (signInError) {
      return {
        success: false,
        error: {
          message: signInError.message,
          status: signInError.status || 500,
        },
      };
    }

    if (!user) {
      return {
        success: false,
        error: { message: "User not found after sign in.", status: 401 },
      };
    }

    const { data: userData, error: roleError } = await client
      .from("users")
      .select("role")
      .eq("user_id", user.id)
      .single();

    redirectTo = roleError || !userData?.role ? "/unauthorized" : `/${userData.role}/dashboard`;
  } catch (err) {
    return {
      success: false,
      error: { message: handleError(err), status: 500 },
    };
  }

  redirect(redirectTo);
}
