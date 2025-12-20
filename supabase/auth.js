import supabase from "./supabase.js";

// REGISTER USER
export async function registerUser(formData) {
  const { email, password, full_name, phone, role } = formData;

  // 1. Create auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) throw error;

  // 2. Create profile
  // Try inserting a profile. Some Supabase setups create a profile automatically
  // (e.g. via an auth.signup trigger) which would cause a unique constraint
  // violation on `email`. In that case, try to detect the duplicate and proceed
  // without throwing so registration doesn't fail unexpectedly.
  const { error: profileError } = await supabase.from("profiles").insert({
    id: data.user.id,
    full_name,
    email,
    phone,
    role
  });

  if (profileError) {
    const msg = String(profileError.message || profileError);
    // If profile already exists (unique constraint on email), try to read it.
    if (msg.includes("profiles_email_key") || msg.toLowerCase().includes("unique")) {
      const { data: existingProfile, error: fetchErr } = await supabase
        .from("profiles")
        .select("id, email")
        .eq("email", email)
        .maybeSingle();

      if (fetchErr) throw fetchErr;

      // If an existing profile was found, assume the profile was created
      // automatically (by a DB trigger) and continue without throwing.
      if (existingProfile) {
        console.warn("Profile already exists for email; skipping insert.", email);
      } else {
        // If we didn't find an existing profile, rethrow the original error.
        throw profileError;
      }
    } else {
      throw profileError;
    }
  }

  // 3. If member, create member record
  if (role === "member") {
    await supabase.from("members").insert({
      id: data.user.id
    });
  }

  return data;
}

// LOGIN USER
export async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;

  return data;
}
