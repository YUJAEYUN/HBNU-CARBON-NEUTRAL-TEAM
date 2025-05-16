import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function signupUser(email: string, password: string, nickname: string, school: string) {
  // 비밀번호 해싱 (보안 강화)
  const hashedPassword = await bcrypt.hash(password, 10);

  // 데이터베이스에 사용자 정보 저장
  const { data, error } = await supabase.from("users").insert([
    {
      email,
      password: hashedPassword, // 해싱된 비밀번호 저장
      nickname,
      school
    }
  ]);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
