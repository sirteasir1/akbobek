import { NextResponse } from 'next/server';
import { z } from 'zod';
import { AUTH_COOKIE, USER_COOKIE } from '@/lib/auth';
import { roleRoutes } from '@/lib/data';

const schema = z.object({
  role: z.enum(['student', 'teacher', 'parent', 'admin']),
  userId: z.string().min(1),
});

export async function POST(request: Request) {
  const payload = schema.parse(await request.json());
  const response = NextResponse.json({ ok: true, redirectTo: roleRoutes[payload.role] });
  response.cookies.set(AUTH_COOKIE, payload.role, { httpOnly: false, sameSite: 'lax', path: '/' });
  response.cookies.set(USER_COOKIE, payload.userId, { httpOnly: false, sameSite: 'lax', path: '/' });
  return response;
}
