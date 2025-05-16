import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function loginUser(email: string, password: string) {
  // 이메일로 사용자 찾기
  const { data, error } = await supabase.from("users").select("id, password").eq("email", email).single();

  if (error || !data) {
    throw new Error("이메일 또는 비밀번호가 잘못되었습니다.");
  }

  // 비밀번호 비교
  const isValidPassword = await bcrypt.compare(password, data.password);
  if (!isValidPassword) {
    throw new Error("이메일 또는 비밀번호가 잘못되었습니다.");
  }

  return data; // ✅ 로그인 성공 시 사용자 정보 반환
}
