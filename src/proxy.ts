import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'murahomes_dev_secret_change_in_production');
const COOKIE_NAME = 'auth_token';

const PUBLIC_PATHS = [
  '/',
  '/about',
  '/products',
  '/brands',

  '/showroom',
  '/sign-in',
  '/sign-up',
  '/api/auth/signin',
  '/api/auth/signup',
];

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some(p =>
    pathname === p ||
    pathname.startsWith(p + '/') ||
    pathname.startsWith('/api/auth/signin') ||
    pathname.startsWith('/api/auth/signup') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/logo')
  );
}

async function getSession(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  // Admin routes — require ADMIN role
  if (pathname.startsWith('/admin')) {
    const session = await getSession(request);
    if (!session) return Response.redirect(new URL('/sign-in', request.url));
    if (session.role !== 'ADMIN') return Response.redirect(new URL('/', request.url));
    console.log(`[Proxy] Admin: ${session.email}, Role: ${session.role}`);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Account routes — require any authenticated user
  if (pathname.startsWith('/account')) {
    const session = await getSession(request);
    if (!session) return Response.redirect(new URL('/sign-in', request.url));
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Protected API routes
  if (pathname.startsWith('/api/') && !isPublic(pathname)) {
    // API routes handle their own auth via getSession()
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export default proxy;

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
