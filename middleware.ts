import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const { pathname } = request.nextUrl;

    // Protect authenticated routes
    if (
        pathname.startsWith('/user') ||
        pathname.startsWith('/chat') ||
        pathname.startsWith('/feed') ||
        pathname.startsWith('/search') ||
        pathname.startsWith('/settings') ||
        pathname.startsWith('/social')
    ) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/user/:path*', '/chat/:path*', '/feed/:path*', '/search/:path*', '/settings/:path*', '/social/:path*'],
};
