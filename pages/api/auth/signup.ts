import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password, nickname, school } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const { data, error } = await supabase.from('users').insert([{ email, password: hashedPassword, nickname, school }]);

  if (error) return res.status(400).json({ error: error.message });

  const token = jwt.sign({ email, nickname }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
  res.status(200).json({ token });
}
