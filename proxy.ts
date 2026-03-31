import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes: Record<string, string> = {
  '/student': 'student',
  '/teacher': 'teacher',
  '/parent': 'parent',
  '/admin': 'admin',
};

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const requiredRole = Object.entries(protectedRoutes).find(([route]) => pathname.startsWith(route))?.[1];

  if (!requiredRole) return NextResponse.next();

  const role = request.cookies.get('aqbobek_role')?.value;
  if (role !== requiredRole) {
    const url = new URL('/login', request.url);
    url.searchParams.set('role', requiredRole);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/student/:path*', '/teacher/:path*', '/parent/:path*', '/admin/:path*'],
};
