'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type WhiskyRanking = {
  whiskyId: number;
  name: string;
  averageRating: number;
  ratingCount: number;
};

export default function Home() {
  const [rankingList, setRankingList] = useState<WhiskyRanking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const res = await fetch('http://localhost:8080/whiskyRanking');
        const json = await res.json();
        setRankingList(json);
      } catch (error) {
        console.error('ランキング取得失敗:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  const renderStars = (rating: number) => {
    const fullStars = Math.round(rating);
    return '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white px-4 py-8 flex flex-col items-center">
      <h1 className="text-5xl font-bold mb-6 text-yellow-400">WhiskyQuest 🥃</h1>
      <p className="text-lg text-gray-300 text-center max-w-xl mb-10">
        あなたのウイスキー体験を記録・共有しましょう。
      </p>

      <div className="flex gap-6 mb-12">
        <Link
          href="/register"
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-6 rounded shadow transition"
        >
          ウイスキーを登録する
        </Link>
        <Link
          href="/mypage"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded shadow transition"
        >
          マイページへ
        </Link>
      </div>

      <section className="w-full max-w-xl bg-gray-800 bg-opacity-80 p-6 rounded shadow mb-16">
        <h2 className="text-xl font-bold text-yellow-300 mb-4 text-center">ウイスキーランキング</h2>

        {loading ? (
          <p className="text-center text-gray-400">読み込み中...</p>
        ) : rankingList.length === 0 ? (
          <p className="text-center text-gray-400">ランキングデータがありません</p>
        ) : (
          <ul className="space-y-4">
            {rankingList.map((item) => (
              <li key={item.whiskyId} className="bg-gray-700 p-4 rounded shadow">
                <Link href={`/whisky/${item.whiskyId}`} className="text-lg font-semibold text-yellow-300 hover:underline">
                  {item.name}
                </Link>
                <p className="text-yellow-400">
                  {renderStars(item.averageRating)}{' '}
                  <span className="text-sm text-gray-300">（{item.ratingCount}件）</span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="text-xs text-gray-500">
        あなたの一番好きなウイスキーは？
      </footer>
    </main>
  );
}
