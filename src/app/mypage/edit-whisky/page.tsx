'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Whisky = {
    id: number;
  name: string;
  taste: string;
  drinkingStyle: string;
  price: number;
  memo: string;
  rating?: number; // ratingListと紐づけるなら後で使う
};

type UserDetailResponse = {
  users: {
    userName: string;
  };
  whiskyList: Whisky[];
  ratingList: {
    whiskyId: number;
    rating: number;
  }[];
};

export default function MyPage() {
  const [data, setData] = useState<UserDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:8080/user/3');
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error('ユーザー情報取得失敗:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p className="text-center mt-10 text-black">読み込み中...</p>;
  if (!data) return <p className="text-center mt-10 text-red-800">ユーザー情報が見つかりませんでした。</p>;

  return (
   <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white px-4 py-8">
  <h1 className="text-3xl font-bold text-yellow-400 text-center mb-6">マイページ</h1>
  <div className="max-w-2xl mx-auto bg-gray-800 bg-opacity-80 p-6 rounded shadow">
    <h2 className="text-xl font-semibold mb-4">ユーザー名：{data.users.userName}</h2>

        <h3 className="text-lg font-bold mb-2">登録済みウイスキー一覧</h3>
        {data.whiskyList.length === 0 ? (
          <p className="text-black">まだウイスキーが登録されていません。</p>
        ) : (
          <ul className="space-y-4">
            {data.whiskyList.map((whisky, index) => {
              const rating = data.ratingList.find(r => r.whiskyId === whisky.id)?.rating ?? 0;
              return (
                <li key={index} className="border p-4 rounded bg-gray-800 text-white shadow">
  <p><strong className="text-yellow-400">名前：</strong>{whisky.name}</p>
  <p><strong className="text-yellow-400">テイスト：</strong>{whisky.taste}</p>
  <p><strong className="text-yellow-400">飲み方：</strong>{whisky.drinkingStyle}</p>
  <p><strong className="text-yellow-400">価格：</strong>{whisky.price} 円</p>
  <p><strong className="text-yellow-400">メモ：</strong>{whisky.memo}</p>
  <p><strong className="text-yellow-400">評価：</strong>{'★'.repeat(rating)}</p>
</li>

              );
            })}
          </ul>
        )}
      </div>
      
<div className="mt-10 text-center">
  <Link href="/" className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded shadow transition">
    TOPに戻る
  </Link>
</div>


      
    </main>
  );
}
