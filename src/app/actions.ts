// 파일 위치: src/app/actions.ts
'use server'; // 👈 중요: 이 파일의 함수들은 무조건 서버에서만 실행된다는 선언

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// 상품 정보를 업데이트하는 서버 액션 함수
export async function updateProduct(id: string, formData: FormData) {
  const supabase = createClient();

  // 1. 폼에서 입력한 데이터 꺼내기
  const price = parseInt(formData.get('price') as string);
  const stock = parseInt(formData.get('stock') as string);

  console.log(`서버 액션 실행됨! ID: ${id}, 가격: ${price}, 재고: ${stock}`);

  // 2. Supabase DB 업데이트 요청
  const { error } = await supabase
    .from('products')
    .update({ price, stock }) // 가격과 재고만 수정
    .eq('id', id); // ID가 같은 상품 찾아서

  if (error) {
    console.error('업데이트 실패:', error);
    throw new Error('상품 업데이트에 실패했습니다.');
  }

  // 3. 성공 후 처리
  // 해당 상세 페이지의 캐시를 날려서, 새로고침 없이도 바뀐 정보가 바로 보이게 함
  revalidatePath(`/products/${id}`);
  
  // 수정이 끝나면 상세 페이지로 이동시킴
  redirect(`/products/${id}`);
}

// 새 상품을 추가하는 서버 액션 함수
export async function createProduct(formData: FormData) {
    const supabase = createClient();
  
    // 1. 폼에서 입력한 데이터 꺼내기
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseInt(formData.get('price') as string);
    const stock = parseInt(formData.get('stock') as string);
    const image_url = formData.get('image_url') as string; 
  
    // 2. Supabase DB에 삽입(insert) 요청
    const { error } = await supabase
      .from('products')
      .insert({ name, description, price, stock, image_url });
  
    if (error) {
      console.error('상품 추가 실패:', error);
      throw new Error('상품 추가에 실패했습니다.');
    }
  
    // 3. 성공 후 메인 페이지로 이동
    revalidatePath('/'); // 메인 페이지 새로고침 효과
    redirect('/');
}

// 상품을 삭제하는 서버 액션 함수
export async function deleteProduct(id: string) {
  const supabase = createClient();
  console.log(`상품 삭제 시도: ID ${id}`);

  // Supabase DB에 삭제(delete) 요청
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id); // ID가 같은 걸 찾아서 지움

  if (error) {
    console.error('상품 삭제 실패:', error);
    throw new Error('상품 삭제에 실패했습니다.');
  }

  // 성공 후 처리
  // 메인 페이지 캐시를 날려서 삭제된 상품이 안 보이게 함
  revalidatePath('/');
  // 메인 페이지로 이동
  redirect('/');
}