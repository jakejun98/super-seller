// 파일 위치: src/app/products/[id]/edit/page.tsx
import { createClient } from '@/lib/supabase/server';
import { updateProduct, deleteProduct } from '@/app/actions';
// 이 페이지는 초기 데이터를 가져와야 하므로 서버 컴포넌트로 시작합니다.
export default async function EditProductPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  // 1. 수정할 상품의 현재 정보 가져오기
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !product) {
    return <div className="p-8 text-center">상품을 찾을 수 없습니다.</div>;
  }

  // ID와 아까 만든 서버 액션을 묶어주는 마법의 함수
  const updateProductWithId = updateProduct.bind(null, params.id);
  const deleteProductWithId = deleteProduct.bind(null, params.id);
  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">🔧 상품 수정 (관리자용)</h1>
        <p className="mb-6 text-gray-600">
          <span className="font-semibold text-blue-600">{product.name}</span>의 정보를 수정합니다.
        </p>

        {/* form의 action에 아까 만든 서버 액션을 연결합니다.
          버튼을 누르면 이 액션이 실행됩니다.
        */}
        <form action={updateProductWithId} className="flex flex-col gap-4">
          
          {/* 가격 입력 필드 */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">가격 (원)</label>
            <input
              id="price"
              name="price" // 서버 액션에서 이 이름으로 데이터를 꺼냅니다.
              type="number"
              defaultValue={product.price} // 현재 값으로 미리 채워두기
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>

          {/* 재고 입력 필드 */}
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">재고 수량 (개)</label>
            <input
              id="stock"
              name="stock"
              type="number"
              defaultValue={product.stock}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>

          {/* 저장 버튼 */}
          <button 
            type="submit"
            className="mt-4 w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            수정 완료 및 저장
          </button>
        </form>

        {/* 삭제 폼 (위험 구역) */}
        <div className="mt-8 pt-8 border-t border-red-100">
          <h3 className="text-red-600 font-bold mb-2">⚠️ 위험 구역</h3>
          <form action={deleteProductWithId}>
            <button type="submit" className="w-full bg-red-100 text-red-600 py-3 rounded hover:bg-red-200 font-bold">
              🗑️ 이 상품 삭제하기
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}