# scripts/check_inventory.py

import os
from dotenv import load_dotenv
from supabase import create_client, Client

def check_inventory():
    # 1. 환경 변수 로드 (.env.local)
    load_dotenv(dotenv_path='.env.local')

    # 2. Supabase 접속 정보 (Next.js 환경변수명 사용)
    url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

    if not url or not key:
        print("❌ 에러: .env.local 파일에서 Supabase 정보를 찾을 수 없습니다.")
        return

    try:
        # 3. 클라이언트 연결
        supabase: Client = create_client(url, key)
        print("🔌 Supabase 연결 성공! 재고 점검을 시작합니다...\n")

        # 4. 모든 상품의 이름과 재고(stock) 조회
        response = supabase.table('products').select('name, stock').execute()
        products = response.data

        if not products:
            print("📭 등록된 상품이 없습니다.")
            return

        # 5. 재고 수량 체크 루프
        warning_count = 0
        
        for product in products:
            name = product.get('name', '이름없음')
            stock = product.get('stock', 0) # stock이 비어있으면 0으로 취급

            if stock is None: 
                stock = 0

            # 임계값 설정 (10개 미만이면 경고)
            if stock < 10:
                print(f"🚨 [경고] '{name}' 재고 부족! (현재: {stock}개)")
                warning_count += 1
            else:
                print(f"✅ [정상] '{name}' 재고 충분 (현재: {stock}개)")

        print(f"\n--- 점검 완료 ---")
        if warning_count > 0:
            print(f"⚠️ 총 {warning_count}개의 상품이 재고 부족 상태입니다. 발주가 필요합니다!")
        else:
            print("🎉 모든 상품의 재고가 넉넉합니다.")

    except Exception as e:
        print(f"💥 오류 발생: {e}")

if __name__ == "__main__":
    check_inventory()