import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

/**
 * Next.js 미들웨어 (Middleware)
 *
 * 이 함수는 Next.js 서버로 들어오는 모든 요청(request)을 가로채는 역할을 합니다.
 * 페이지나 API 라우트가 실행되기 전에 먼저 실행됩니다.
 *
 * 여기서는 Supabase 클라이언트를 이용해 모든 요청마다 사용자의 인증 세션을 갱신(refresh)하는
 * 중요한 작업을 수행합니다. 이를 통해 사용자의 로그인 상태가 항상 최신으로 유지됩니다.
 *
 * @param {NextRequest} request - 들어오는 요청 객체
 * @returns {Promise<NextResponse>} 수정된 요청을 포함하는 응답 객체
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // 모든 요청에 대해 사용자 세션 정보를 갱신합니다.
  await supabase.auth.getUser();

  return response;
}

// 미들웨어가 실행될 경로를 지정합니다.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
