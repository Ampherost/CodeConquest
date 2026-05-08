"use server";
import { businessSchema, candidateSchema } from "@/app/signup/lib/schemas";
import { createClient } from "@/utils/supabase/server";
import { handleError } from "@/app/signup/lib/utility";
import { UserType } from "@/app/signup/lib/userType";
import { createUser } from "@/lib/db/users";
import { createBusinessProfile } from "@/lib/db/businesses";
import { createCandidateProfile } from "@/lib/db/candidates";

export async function handleSubmit(state, formData, userType) {
  // Set payload based on user type (Business or Candidate)
  const payload =
    userType === UserType.BUSINESS
      ? {
          business_name: formData.get("business_name") || "",
          business_email: formData.get("business_email") || "",
          password: formData.get("password") || "",
          confirm_password: formData.get("confirm_password") || "",
          role: UserType.BUSINESS,
        }
      : {
          first_name: formData.get("first_name") || "",
          last_name: formData.get("last_name") || "",
          email: formData.get("email") || "",
          password: formData.get("password") || "",
          confirm_password: formData.get("confirm_password") || "",
          role: UserType.CANDIDATE,
        };

  console.log("Payload being sent:", payload);

  // Validate input based on user type
  const schema =
    userType === UserType.BUSINESS ? businessSchema : candidateSchema;
  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    const validationErrors = parsed.error.flatten().fieldErrors;
    console.log("Validation errors:", validationErrors);
    return {
      success: false,
      message: "Invalid data, please check your input.",
      errors: validationErrors,
      default_values: payload,
    };
  }

  try {
    const client = await createClient();
    const { auth } = client;

    // Sign up the user (create in users table first)
    const email =
      userType === UserType.BUSINESS ? payload.business_email : payload.email;
    const { data, error } = await auth.signUp({
      email,
      password: payload.password,
    });

    if (error || !data?.user?.id) {
      console.error("OAuth signup error:", error);
      return {
        success: false,
        message: "Error signing up, please try again.",
      };
    }

    const userId = data.user.id;

    // Insert the user into the 'users' table
    const createResult = await createUser(client, { user_id: userId, email, role: payload.role });
    if (!createResult.ok) {
      console.error("Error inserting user into users table:", createResult.error);
      return {
        success: false,
        message: "Error saving user to main database.",
      };
    }

    // Build user profile and insert into respective table
    const profileResult =
      userType === UserType.BUSINESS
        ? await createBusinessProfile(client, {
            user_id: userId,
            business_name: payload.business_name,
            business_email: payload.business_email,
          })
        : await createCandidateProfile(client, {
            user_id: userId,
            first_name: payload.first_name,
            last_name: payload.last_name,
          });

    if (!profileResult.ok) {
      console.error("Error inserting user profile:", profileResult.error);
      return {
        success: false,
        message: "Error saving user profile to the database.",
      };
    }

    // Successful signup
    return {
      success: true,
      message: "Signup successful!",
    };
  } 
  catch (error) {
    console.error("Error during signup:", error);
    return {
      success: false,
      message: handleError(error),
    };
  }
}
