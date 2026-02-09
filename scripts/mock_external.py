import os
import random
import time
from dotenv import load_dotenv
from supabase import create_client, Client

# 환경 변수 로드
load_dotenv(dotenv_path='.env.local', override=True)
supa_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
supa_key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

supabase: Client = create_client(supa_url, supa_key)

# 가짜 데이터 재료
products = [
    {"name": "[네이버] 초경량 패딩 조끼", "price": 29900},
    {"name": "[쿠팡] 로켓배송 수면 양말 세트", "price": 9900},
    {"name": "[지그재그] 데일리 와이드 슬랙스", "price": 35000},
    {"name": "[자사몰] 프리미엄 울 코트", "price": 120000}
]

sources = ["네이버 스마트스토어", "쿠팡", "지그재그", "자사몰"]

print("🛒 외부몰 주문 수집 시뮬레이터 시작...")

for i in range(1, 6):  # 5개 주문 생성
    prod = random.choice(products)
    src = random.choice(sources)
    
    data = {
        "product_name": prod["name"],
        "amount": prod["price"],
        "quantity": random.randint(1, 3),
        "customer_name": f"외부고객_{random.randint(100, 999)}",
        "source": src  # ★ 여기가 핵심!
    }
    
    supabase.table("orders").insert(data).execute()
    
    print(f"[{i}] 🔔 띠링! {src}에서 주문 접수: {prod['name']}")
    time.sleep(0.5)

print("\n✅ 외부 채널 주문 수집 완료!")