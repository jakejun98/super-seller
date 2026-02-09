import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * 서버 컴포넌트/Route Handler/Server Action용 Supabase 클라이언트 생성 함수
 *
 * 서버 사이드 환경(서버 컴포넌트, Route Handler, Server Action)에서 Supabase와 통신할 때 사용합니다.
 * Next.js의 쿠키 저장소를 사용하여 사용자의 인증 세션을 안전하게 관리합니다.
 *
 * 이 함수는 서버 전용이므로 브라우저에 노출되지 않는 민감한 키(예: service_role)도
 * 안전하게 사용할 수 있습니다. (이 예제에서는 anon 키를 사용합니다.)
 *
 * @returns {SupabaseClient} 서버용 Supabase 클라이언트 인스턴스
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  );
}
