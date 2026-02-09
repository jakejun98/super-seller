import os
import time
from dotenv import load_dotenv
from google import genai
from supabase import create_client, Client

def generate_cs_reply():
    # 1. 환경 변수 로드
    load_dotenv(dotenv_path='.env.local', override=True)
    
    gemini_key = os.environ.get("GEMINI_API_KEY")
    supa_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    supa_key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

    genai_client = genai.Client(api_key=gemini_key)
    supabase: Client = create_client(supa_url, supa_key)

    # 2. 테스트 데이터 (상황극)
    test_inquiries = [
        "옷을 빨았는데 줄어들었어요. 환불해주세요. (구매한지 10일 지남)",
        "배송 조회해보니 배송완료라는데 문 앞에 없어요. 도난당한 것 같아요.",
        "이거 소재가 뭔가요? 알러지가 있어서요.",
    ]

    print("🤖 [Day 3] AI 답변 에이전트 가동 시작...\n")

    for i, inquiry in enumerate(test_inquiries, 1):
        # 3. AI에게 "분류"와 "답변작성" 동시 요청
        prompt = f"""
        너는 베테랑 CS 매니저야.
        
        [문의]: "{inquiry}"
        
        [규정]:
        1. 단순 변심/세탁 후 환불 불가.
        2. 배송 분실 시 택배사 확인 후 재발송.
        3. 소재: 울 80%, 나일론 20%.

        위 내용을 바탕으로:
        1. [환불, 배송, 상품문의] 중 하나로 분류해.
        2. 고객에게 보낼 정중한 답변을 작성해.
        3. 출력 형식: "분류 | 답변내용" (파이프 기호 필수)
        """
        
        response = genai_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        
        # 4. 결과 파싱
        try:
            raw_text = response.text.strip()
            if "|" in raw_text:
                category, reply = raw_text.split("|", 1)
            else:
                category = "기타"
                reply = raw_text
        except:
            category = "에러"
            reply = "AI 처리 실패"

        # 5. DB 저장 (답변 초안 포함!)
        data = {
            "content": inquiry,
            "category": category.strip(),
            "response_draft": reply.strip()  # ★ 여기가 핵심!
        }
        
        supabase.table("inquiries").insert(data).execute()

        print(f"[{i}] 문의: {inquiry[:15]}...")
        print(f"    ✍️ 답변 생성 완료! (DB 저장됨)")
        print("-" * 30)
        
        time.sleep(1)

    print("\n🎉 모든 작업 완료! 웹사이트를 새로고침 하세요.")

if __name__ == "__main__":
    generate_cs_reply()