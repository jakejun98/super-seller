import os
from dotenv import load_dotenv
from google import genai

def list_models():
    load_dotenv(dotenv_path='.env.local')
    api_key = os.environ.get("GEMINI_API_KEY")
    
    if not api_key:
        print("❌ API 키 없음")
        return

    client = genai.Client(api_key=api_key)
    
    print("🔍 사용 가능한 모델 리스트 (전체 출력):")
    try:
        # 그냥 있는 거 다 가져와서 이름만 출력
        for m in client.models.list():
            print(f" - {m.name}")
            
    except Exception as e:
        print(f"💥 에러: {e}")

if __name__ == "__main__":
    list_models()