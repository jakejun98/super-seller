'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);

  // 1. 진짜 상품 데이터 가져오기 (DB)
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error) console.error('상품 로딩 실패:', error);
    else setProducts(data || []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. 주문하기 (재고 확인 + 주문 넣기 + 재고 깎기)
  const handleOrder = async (product: any) => {
    // 1) 재고 체크
    if (product.stock <= 0) {
      alert('품절된 상품입니다 ㅠㅠ');
      return;
    }

    if (!confirm(`${product.name}을(를) 구매하시겠습니까?`)) return;

    // 2) 주문 테이블에 넣기
    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        product_name: product.name,
        amount: product.price,
        quantity: 1,
        customer_name: '웹사이트_고객',
        source: '자사몰'
      });

    if (orderError) {
  // ★ 에러의 진짜 이유를 알려달라고 함
  alert('주문 에러 발생: ' + orderError.message);
  console.log(orderError);
  return;
}

    // 3) 상품 테이블 재고 깎기 (-1)
    const { error: stockError } = await supabase
      .from('products')
      .update({ stock: product.stock - 1 })
      .eq('id', product.id);

    if (!stockError) {
      alert(`✅ ${product.name} 구매 완료!`);
      fetchProducts(); // 화면 새로고침 (재고 줄어든거 바로 반영)
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">🛍️ Aipon Store (Real DB)</h1>
          <span className="text-sm text-gray-500">실시간 재고 연동 중...</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow relative">
              
              {/* 이미지 (DB에 없으면 랜덤 이미지) */}
              <img 
                src={p.image_url || `https://picsum.photos/seed/${p.id}/400/300`} 
                alt={p.name} 
                className={`w-full h-48 object-cover ${p.stock <= 0 ? 'grayscale opacity-50' : ''}`} 
              />
              
              {/* 품절 뱃지 */}
              {p.stock <= 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  SOLD OUT
                </div>
              )}

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-gray-800">{p.name}</h2>
                  <span className={`text-xs font-bold px-2 py-1 rounded
                    ${p.stock > 5 ? 'bg-green-100 text-green-700' : 
                      p.stock > 0 ? 'bg-orange-100 text-orange-700' : 'bg-gray-200 text-gray-500'}`}>
                    재고: {p.stock}개
                  </span>
                </div>
                
                <p className="text-gray-600 text-lg font-medium mb-4">
                  ₩ {p.price.toLocaleString()}
                </p>
                
                <button 
                  onClick={() => handleOrder(p)}
                  disabled={p.stock <= 0}
                  className={`w-full py-3 rounded-lg font-bold transition-colors
                    ${p.stock > 0 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                >
                  {p.stock > 0 ? '구매하기' : '품절'}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {products.length === 0 && (
          <div className="text-center p-10 text-gray-500">
            상품이 없습니다. DB에 products 데이터를 넣어주세요!
          </div>
        )}
      </div>
    </div>
  );
}