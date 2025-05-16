import { supabase } from "@/lib/supabase";

export async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw new Error(error.message);
  }
  return data.user;
}
