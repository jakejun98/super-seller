# scripts/generate_invoices.py

import os
import random
from dotenv import load_dotenv
from supabase import create_client, Client

def generate_tracking_number():
    """
    'CJ'로 시작하고 뒤에 10자리 랜덤 숫자가 붙는 가상 운송장 번호 생성
    예: CJ1234567890
    """
    random_digits = ''.join([str(random.randint(0, 9)) for _ in range(10)])
    return f"CJ{random_digits}"

def process_orders():
    # 1. 환경 변수 파일 로드 (.env.local)
    # 현재 위치(루트)에 있는 .env.local 파일을 읽어옵니다.
    load_dotenv(dotenv_path='.env.local')

    # 2. Supabase 접속 정보 가져오기 (Next.js 기본 변수명 사용)
    # ⚠️ 중요: 여기를 NEXT_PUBLIC_... 으로 맞춰야 합니다!
    supabase_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    supabase_key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

    # 디버깅: 실제로 값을 잘 가져왔는지 확인
    if not supabase_url or not supabase_key:
        print("❌ 에러: .env.local 파일을 찾았으나 내부의 변수 값을 읽지 못했습니다.")
        print(f"   - 확인된 URL: {supabase_url}")
        print(f"   - 확인된 KEY: {'(비어있음)' if not supabase_key else '(있음)'}")
        print("💡 팁: .env.local 파일 안에 NEXT_PUBLIC_SUPABASE_URL=... 형태가 맞는지 확인하세요.")
        return

    try:
        # 3. 클라이언트 연결
        supabase: Client = create_client(supabase_url, supabase_key)
        print("🔌 Supabase 연결 성공!")

        # 4. 'paid'(결제완료) 상태인 주문 조회
        print("🔍 'paid' 상태의 주문을 찾는 중...")
        response = supabase.table('orders').select('*').eq('status', 'paid').execute()
        
        # response.data가 리스트 형태입니다.
        orders = response.data
        
        if not orders:
            print("📭 처리할 주문이 없습니다. (모두 처리되었거나 'paid' 상태가 없음)")
            return

        print(f"📦 총 {len(orders)}건의 주문 발견! 송장 발급 시작합니다.")

        # 5. 반복문으로 송장 발급 및 업데이트
        count = 0
        for order in orders:
            order_id = order['id']
            tracking_num = generate_tracking_number()
            
            # DB 업데이트 (송장번호 넣고, 상태를 shipping으로 변경)
            supabase.table('orders').update({
                'tracking_number': tracking_num,
                'status': 'shipping'
            }).eq('id', order_id).execute()
            
            print(f"  [✅ 처리완료] 주문ID: {order_id} -> 송장: {tracking_num}")
            count += 1

        print(f"\n🎉 총 {count}건 처리 완료! 모두 'shipping' 상태로 변경됨.")

    except Exception as e:
        print(f"💥 오류 발생: {e}")

if __name__ == "__main__":
    process_orders()