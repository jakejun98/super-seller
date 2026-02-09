'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 생성
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SalesDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 통계 상태 변수들
  const [todaySales, setTodaySales] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // 데이터 가져오는 함수
  const fetchOrders = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("데이터 가져오기 실패:", error);
    } else {
      const allOrders = data || [];
      setOrders(allOrders);
      calculateStats(allOrders); // 통계 계산 실행
    }
    setLoading(false);
  };

  // 매출 계산 함수
  const calculateStats = (data: any[]) => {
    const today = new Date().toISOString().split('T')[0]; // 오늘 날짜 (YYYY-MM-DD)
    
    let todaySum = 0;
    let totalSum = 0;

    data.forEach((order) => {
      totalSum += order.amount;
      
      const orderDate = new Date(order.created_at).toISOString().split('T')[0];
      if (orderDate === today) {
        todaySum += order.amount;
      }
    });

    setTodaySales(todaySum);
    setTotalSales(totalSum);
    setTotalCount(data.length);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            📈 통합 판매 대시보드
          </h1>
          <button onClick={fetchOrders} className="bg-white border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 text-sm">
            데이터 새로고침 🔄
          </button>
        </div>

        {/* 상단 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
            <h3 className="text-gray-500 font-medium mb-2">오늘 매출 (Today)</h3>
            <p className="text-4xl font-bold text-blue-600">
              ₩ {todaySales.toLocaleString()}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 font-medium mb-2">누적 매출 (Total)</h3>
            <p className="text-3xl font-bold text-gray-800">
              ₩ {totalSales.toLocaleString()}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 font-medium mb-2">총 주문 건수</h3>
            <p className="text-3xl font-bold text-gray-800">
              {totalCount} <span className="text-lg text-gray-400 font-normal">건</span>
            </p>
          </div>
        </div>

        {/* 하단 리스트 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">최근 거래 내역 (실시간 연동)</h2>
          </div>

          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm">
              <tr>
                <th className="p-4 font-medium">주문 시간</th>
                <th className="p-4 font-medium">상품명 (판매처)</th>
                <th className="p-4 font-medium">수량</th>
                <th className="p-4 font-medium text-right">결제 금액</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center">로딩 중...</td></tr>
              ) : orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-500 text-sm">
                    {new Date(order.created_at).toLocaleString()}
                  </td>
                  
                  {/* ★ 여기가 수정된 부분 (뱃지 추가) */}
                  <td className="p-4 font-medium text-gray-800">
                    <span className={`text-xs font-bold px-2 py-1 rounded mr-2 align-middle
                      ${order.source === '쿠팡' ? 'bg-red-100 text-red-600' : 
                        order.source === '네이버 스마트스토어' ? 'bg-green-100 text-green-600' : 
                        order.source === '지그재그' ? 'bg-pink-100 text-pink-600' :
                        'bg-gray-100 text-gray-600'}`}>
                      {order.source || '자사몰'}
                    </span>
                    <span className="align-middle">{order.product_name}</span>
                  </td>

                  <td className="p-4 text-gray-600">
                    {order.quantity}개
                  </td>
                  <td className="p-4 text-right font-bold text-gray-800">
                    ₩ {order.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {!loading && orders.length === 0 && (
            <div className="p-10 text-center text-gray-500">
              데이터가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}