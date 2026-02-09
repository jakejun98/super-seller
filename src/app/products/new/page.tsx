// 파일 위치: src/app/products/new/page.tsx
import { createProduct } from '@/app/actions';

export default function NewProductPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">✨ 새 상품 등록</h1>
        
        {/* 폼 제출 시 createProduct 서버 액션 실행 */}
        <form action={createProduct} className="flex flex-col gap-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">상품명 *</label>
            <input name="name" type="text" required className="w-full p-3 border rounded-lg" placeholder="예: AI 코딩 맥북" />
          </div>

           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">간단한 설명</label>
            <textarea name="description" rows={3} className="w-full p-3 border rounded-lg" placeholder="설명 입력" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">가격 (원) *</label>
            <input name="price" type="number" required className="w-full p-3 border rounded-lg" placeholder="0" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">초기 재고량 (개) *</label>
            <input name="stock" type="number" required className="w-full p-3 border rounded-lg" placeholder="100" />
          </div>

           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이미지 주소 (URL)</label>
            <input name="image_url" type="text" className="w-full p-3 border rounded-lg" placeholder="https://..." />
          </div>

          <button type="submit" className="mt-4 w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
            등록하기
          </button>
        </form>
      </div>
    </main>
  );
}