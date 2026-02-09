import { createBrowserClient } from '@supabase/ssr';

/**
 * 클라이언트 컴포넌트용 Supabase 클라이언트 생성 함수
 *
 * 브라우저(클라이언트 사이드) 환경에서 실행되는 컴포넌트(예: 'use client' 지시어가 사용된 파일)에서
 * Supabase와 상호작용이 필요할 때 이 함수를 사용합니다.
 *
 * 이 클라이언트는 NEXT_PUBLIC으로 시작하는 환경 변수를 사용하므로 브라우저에 노출되어도 안전합니다.
 * 주로 사용자의 인터랙션에 따라 데이터를 가져오거나(fetching), 데이터를 수정(mutation)하는 작업에 사용됩니다.
 *
 * @returns {SupabaseClient} 브라우저용 Supabase 클라이언트 인스턴스
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
