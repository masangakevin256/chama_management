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
  const { error: profileError } = await supabase.from("profiles").insert({
    id: data.user.id,
    full_name,
    email,
    phone,
    role
  });

  if (profileError) throw profileError;

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
