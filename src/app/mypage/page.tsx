'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';


type Rating = {
  id: number;
  userId: number;
  whiskyId: number;
  rating: number;
  ratingAt: string;
  isDeleted: boolean;
};

type Whisky = {
  id: number;
  userId: number;
  name: string;
  taste: string;
  drinkingStyle: string;
  price: number;
  memo: string;
  isDeleted: boolean;
  rating?: Rating;
};

type UserData = {
  users: {
    id: number;
    userName: string;
    mail: string;
    password: string;
    isDeleted: boolean;
  };
  whiskyList: Whisky[];
  ratingList: Rating[];
};



export default function MyPage() {
  const [data, setData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('http://localhost:8080/user/3');
      const json: UserData = await res.json();

      const enrichedWhiskyList: Whisky[] = json.whiskyList.map((whisky) => {
        const rating = json.ratingList.find(
          (r) => r.whiskyId === whisky.id
        );
        return { ...whisky, rating };
      });

      setData({
        users: json.users,
        whiskyList: enrichedWhiskyList,
        ratingList: json.ratingList,
      });
    };

    fetchData();
  }, []);


  if (!data) {
    return <p className="text-center text-gray-400 mt-10">読み込み中...</p>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white px-4 py-8">
      <h1 className="text-3xl font-bold text-yellow-400 text-center mb-6">
        {data.users.userName}さんの登録したウイスキー
      </h1>

      <ul className="max-w-3xl mx-auto space-y-6">
        {data.whiskyList.map((whisky) => (
          <li key={whisky.id} className="bg-gray-800 p-6 rounded shadow relative">
            <p><strong className="text-yellow-400">名前：</strong>{whisky.name}</p>
            <p><strong className="text-yellow-400">テイスト：</strong>{whisky.taste}</p>
            <p><strong className="text-yellow-400">飲み方：</strong>{whisky.drinkingStyle}</p>
            <p><strong className="text-yellow-400">価格：</strong>{whisky.price} 円</p>
            <p><strong className="text-yellow-400">メモ：</strong>{whisky.memo}</p>
            <p>
              <strong className="text-yellow-400">評価：</strong>
              <span className="text-yellow-300 text-lg">
                {'★'.repeat(whisky.rating?.rating || 0) + '☆'.repeat(5 - (whisky.rating?.rating || 0))}
              </span>

            </p>
            <p className="text-sm text-gray-400">
              登録日時:{' '}
              {whisky.rating?.ratingAt
                ? format(new Date(whisky.rating.ratingAt), 'yyyy年M月d日 HH:mm', { locale: ja })
                : '未登録'}
            </p>

            <Link
              href={`/mypage/edit-whisky?id=${whisky.id}`}
              className="absolute bottom-4 right-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-1 px-4 rounded"
            >
              編集
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-10 text-center space-x-4">
        <Link href="/mypage/edit-user">
          <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded">
            ユーザー情報を変更する
          </button>
        </Link>

        <Link href="/">
          <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded">
            TOPへ戻る
          </button>
        </Link>
      </div>
    </main>
  );
}
