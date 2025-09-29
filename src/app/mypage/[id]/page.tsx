'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useParams } from 'next/navigation';


type Rating = {
  id: number;
  userId: number;
  whiskyId: number;
  comment: string;
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
  isDeleted: boolean;
};
type WhiskyWithRating = Whisky & { rating: Rating | null };

type UserData = {
  users: {
    id: number;
    userName: string;
    mail: string;
    password: string;
    isDeleted: boolean;
  };
  whiskyList: WhiskyWithRating[];
  ratingList: Rating[];
};


export default function MyPage() {
  const [data, setData] = useState<UserData | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      const res = await fetch(`http://WhiskyQuestALB-2003468577.ap-northeast-1.elb.amazonaws.com/user/${id}`);
      const json: UserData = await res.json();
      console.log(json);

      const enrichedWhiskyList: WhiskyWithRating[] = json.whiskyList.map((whisky) => {
        const rating = json.ratingList.find((r) => r.whiskyId === whisky.id);
        return { ...whisky, rating: rating ?? null };

      })

        .filter((w): w is WhiskyWithRating => w !== null);
      console.log(json.whiskyList.map(w => w.name));
      console.log(json.ratingList.map(r => r.whiskyId));

      setData({
        users: json.users,
        whiskyList: enrichedWhiskyList,
        ratingList: json.ratingList,
      });
    };

    fetchData();
  }, [id]);



  if (!data) {
    return <p className="text-center text-gray-400 mt-10">読み込み中...</p>;
  }

  const renderStars = (rating: number) => {
    const validRating = Math.max(0, Math.min(5, rating));
    return '★'.repeat(validRating) + '☆'.repeat(5 - validRating);
  };

  return (

    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* ✅ ヘッダー */}
        <h1 className="text-3xl font-bold text-yellow-400 text-center mb-2">
          {data.users.userName}さんのマイページ
        </h1>
        <p className="text-center text-sm text-gray-400 mb-6">
          ユーザーID：{data.users.id}
        </p>



        <div className="flex justify-end mb-8">
          <Link href={`/mypage/edit-user/${data.users.id}`}>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded shadow">
              ユーザー情報を変更する
            </button>
          </Link>
        </div>

        {/* ✅ ウイスキー一覧 */}
        <ul className="space-y-6">
          {data.whiskyList.map((whisky) => (
            <li key={whisky.id} className="bg-gray-800 bg-opacity-80 p-6 rounded shadow relative">
              <p><strong className="text-yellow-400">名前：</strong>{whisky.name}</p>
              <p><strong className="text-yellow-400">テイスト：</strong>{whisky.taste}</p>
              <p><strong className="text-yellow-400">飲み方：</strong>{whisky.drinkingStyle}</p>
              <p><strong className="text-yellow-400">価格：</strong>{whisky.price} 円</p>
              <p><strong className="text-yellow-400">コメント：</strong>{whisky.rating?.comment}</p>
              <p>
                <strong className="text-yellow-400">評価：</strong>
                <span className="text-yellow-300 text-lg">
                  {renderStars(whisky.rating?.rating ?? 0)}
                </span>
              </p>
              <p className="text-sm text-gray-400">
                登録日時：{whisky.rating?.ratingAt
                  ? format(new Date(whisky.rating.ratingAt), 'yyyy年M月d日 HH:mm', { locale: ja })
                  : '未登録'}
              </p>

              {/* 編集ボタン */}
              <Link
                href={`/mypage/edit-whisky?id=${whisky.id}`}
                className="absolute bottom-4 right-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-1 px-4 rounded"
              >
                編集
              </Link>
            </li>
          ))}
        </ul>

        {/* ✅ フッター */}
        <div className="flex justify-end mt-10">
          <Link href="/">
            <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded shadow">
              TOPへ戻る
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
