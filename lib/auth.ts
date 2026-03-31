import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Role } from '@/lib/types';

export const AUTH_COOKIE = 'aqbobek_role';
export const USER_COOKIE = 'aqbobek_user';

export async function getSession() {
  const cookieStore = await cookies();
  return {
    role: cookieStore.get(AUTH_COOKIE)?.value as Role | undefined,
    userId: cookieStore.get(USER_COOKIE)?.value,
  };
}

export async function requireRole(role: Role) {
  const session = await getSession();
  if (session.role !== role) {
    redirect(`/login?role=${role}`);
  }
  return session;
}
