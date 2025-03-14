// 4️⃣ /pages/api/auth/logout.ts (로그아웃 API)
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // JWT 토큰은 클라이언트에서 삭제되므로, 서버에서는 단순히 성공 응답만 보냅니다
  res.status(200).json({ message: 'Logged out successfully' });
}