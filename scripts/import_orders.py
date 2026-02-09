# scripts/import_orders.py

# 1. 필요한 라이브러리 설치 명령어 (터미널에서 실행)
# pip install pandas supabase python-dotenv openpyxl

import os
import pandas as pd
from supabase import create_client, Client
from dotenv import load_dotenv

# .env.local 파일 로드 (환경 변수 가져오기)
# 스크립트 실행 위치(루트)에 있는 .env.local을 찾습니다.
load_dotenv('.env.local')

# Supabase 설정
url: str = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key: str = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

# 환경 변수 체크
if not url or not key:
    print("❌ 에러: .env.local 파일에서 Supabase URL과 KEY를 찾을 수 없습니다.")
    exit()

supabase: Client = create_client(url, key)

def import_orders():
    print("🚀 엑셀 주문 데이터 업로드 시작...")

    file_path = 'data/orders.xlsx'

    # 1. 엑셀 파일 확인
    if not os.path.exists(file_path):
        print(f"❌ 에러: '{file_path}' 파일을 찾을 수 없습니다.")
        print("💡 data 폴더 안에 orders.xlsx 파일을 먼저 만들어주세요.")
        return

    try:
        # 2. 엑셀 파일 읽기 (pandas 활용)
        df = pd.read_excel(file_path)
        
        # NaN(빈값)을 None으로 변환 (DB 호환성)
        df = df.where(pd.notnull(df), None)
        
        print(f"📄 {len(df)}개의 주문 데이터를 읽었습니다.")

        # 3. 데이터프레임을 딕셔너리 리스트로 변환
        orders_data = df.to_dict(orient='records')

        # 4. Supabase에 대량 데이터 삽입 (Bulk Insert)
        # count='exact'를 쓰면 몇 개가 들어갔는지 정확히 알려줍니다.
        response = supabase.table('orders').insert(orders_data).execute()

        # 성공 메시지
        print(f"✅ 성공! 총 {len(response.data)}건의 주문이 DB에 저장되었습니다.")

    except Exception as e:
        print(f"💥 오류 발생: {e}")

if __name__ == "__main__":
    import_orders()