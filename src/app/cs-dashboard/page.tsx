'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CSDashboard() {
  const [inquiries, setInquiries] = useState<any[]>([]);

  // 데이터 가져오기 (새로고침)
  const fetchInquiries = async () => {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setInquiries(data || []);
  };

  // ★ 버튼 클릭 시 '완료(sent)'로 상태 변경하는 함수
  const handleSend = async (id: number) => {
    // 1. 진짜 보낼지 물어보기
    if (!confirm('답변을 전송하고 완료 처리하시겠습니까?')) return;

    // 2. Supabase 데이터 업데이트 (status -> 'sent')
    const { error } = await supabase
      .from('inquiries')
      .update({ status: 'sent' }) // 상태를 'sent'로 변경
      .eq('id', id);              // 클릭한 그 녀석(id)만!

    if (error) {
      alert('에러 발생: ' + error.message);
    } else {
      alert('✅ 전송 완료!');
      fetchInquiries(); // 화면 새로고침
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          🤖 AI CS 답변 에이전트
        </h1>
        
        <div className="grid gap-6">
          {inquiries.map((item) => (
            <div 
              key={item.id} 
              className={`p-6 rounded-xl shadow-sm border transition-all
                ${item.status === 'sent' ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}
              `}
            >
              <div className="flex justify-between items-start mb-4">
                {/* 뱃지 (카테고리 & 상태) */}
                <div className="flex gap-2">
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">
                    {item.category || '미분류'}
                  </span>
                  {item.status === 'sent' && (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
                      ✅ 처리완료
                    </span>
                  )}
                </div>
                <span className="text-gray-400 text-xs">
                  {new Date(item.created_at).toLocaleTimeString()}
                </span>
              </div>

              {/* 문의 내용 */}
              <p className="font-medium text-gray-800 mb-4">{item.content}</p>

              {/* AI 답변 영역 */}
              <div className={`p-4 rounded-lg text-sm whitespace-pre-wrap mb-4
                ${item.status === 'sent' ? 'bg-white/60 text-gray-500' : 'bg-purple-50 text-gray-700'}
              `}>
                <span className="block font-bold mb-2 text-xs text-purple-600">
                  {item.status === 'sent' ? '보낸 답변:' : '✨ AI 제안 답변:'}
                </span>
                {item.response_draft || "답변 생성 중..."}
              </div>

              {/* 버튼 (아직 안 보냈을 때만 보임) */}
              {item.status !== 'sent' && (
                <div className="flex justify-end">
                  <button 
                    onClick={() => handleSend(item.id)}
                    className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold px-5 py-2.5 rounded-lg shadow-md transition-colors"
                  >
                    검토 완료 및 전송 🚀
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}