'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-10">
      <div className="max-w-5xl w-full text-center">
        <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Super Seller
        </h1>
        <p className="text-gray-400 mb-12 text-lg">
          AI 기반 쇼핑몰 통합 관리 솔루션
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 1. 쇼핑몰 (손님용) */}
          <Link href="/shop" className="group">
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-green-500 transition-all hover:shadow-lg hover:shadow-green-500/20 cursor-pointer h-full text-left">
              <div className="text-4xl mb-4">🛍️</div>
              <h2 className="text-2xl font-bold mb-2 group-hover:text-green-400 transition-colors">
                쇼핑몰 (Store)
              </h2>
              <p className="text-gray-400 text-sm">
                고객이 상품을 보고<br/>주문하는 페이지입니다.
              </p>
            </div>
          </Link>

          {/* 2. 매출 현황 (관리자용) */}
          <Link href="/sales-dashboard" className="group">
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer h-full text-left">
              <div className="text-4xl mb-4">📈</div>
              <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                매출 현황 (Sales)
              </h2>
              <p className="text-gray-400 text-sm">
                실시간 매출 집계 및<br/>채널별 주문 분석.
              </p>
            </div>
          </Link>

          {/* 3. AI CS 센터 (관리자용) */}
          <Link href="/cs-dashboard" className="group">
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-purple-500 transition-all hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer h-full text-left">
              <div className="text-4xl mb-4">🤖</div>
              <h2 className="text-2xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
                AI CS 센터 (Agent)
              </h2>
              <p className="text-gray-400 text-sm">
                AI가 문의를 분류하고<br/>답변을 작성합니다.
              </p>
            </div>
          </Link>

        </div>

        <div className="mt-12 text-gray-500 text-sm">
          Powered by Next.js, Supabase, and Google Gemini
        </div>
      </div>
    </div>
  );
}