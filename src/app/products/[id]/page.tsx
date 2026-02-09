// 파일 위치: src/app/products/[id]/page.tsx
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  // 1. URL의 id에 해당하는 상품 1개만 가져오기
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id) // DB의 id 컬럼과 URL의 id가 같은 것 찾기
    .single(); // 딱 하나만 가져와!

  // 2. 에러 처리 (상품이 없거나 못 가져왔을 때)
  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <div className="text-6xl mb-4">😭</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">상품을 찾을 수 없습니다.</h2>
        <p className="text-gray-500 mb-6">존재하지 않거나 삭제된 상품입니다.</p>
        <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  // 3. 상품 정보 보여주기 (성공 시)
  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="md:flex">
          {/* 왼쪽: 상품 이미지 */}
          <div className="md:w-1/2 relative h-96 md:h-auto bg-gray-100">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">이미지 없음</div>
            )}
          </div>
          
          {/* 오른쪽: 상세 정보 */}
          <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
            <div className="uppercase tracking-wide text-sm text-blue-600 font-bold mb-2">AI Commerce Best Pick</div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">{product.description}</p>
            
            <div className="border-t border-gray-100 pt-8 mt-auto">
              <div className="flex items-end justify-between mb-6">
                 <div>
                   <span className="text-sm text-gray-500 block mb-1">판매 가격</span>
                   <span className="text-3xl font-bold text-gray-900">
                    {new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(product.price)}
                  </span>
                 </div>
                 <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {product.stock > 0 ? `재고 ${product.stock}개 남음` : '품절됨'}
                </span>
              </div>

              <div className="flex gap-4">
                <button 
                  className={`flex-1 py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1 ${
                    product.stock > 0 
                      ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  disabled={product.stock <= 0}
                >
                  {product.stock > 0 ? '바로 구매하기' : '재입고 알림 신청'}
                </button>
                <button className="p-4 rounded-xl border-2 border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-colors">
                  ♥
                </button>
              </div>
              
               <Link href="/" className="block mt-6 text-center text-gray-400 hover:text-gray-600 text-sm font-medium underline decoration-gray-300 underline-offset-4">
                ← 다른 상품 더 둘러보기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}