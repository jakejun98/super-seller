
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next.js + Supabase Starter",
  description: "Next.js 14 App Router and Supabase Starter Kit",
};

/**
 * 루트 레이아웃 (Root Layout)
 *
 * 이 컴포넌트는 애플리케이션의 모든 페이지에 공통적으로 적용되는 최상위 레이아웃입니다.
 * <html> 및 <body> 태그를 포함하여 기본적인 HTML 문서 구조를 정의합니다.
 * 전역 CSS (globals.css)를 여기서 임포트하여 모든 페이지에 스타일이 적용되도록 합니다.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
