'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

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
};

export default function EditWhiskyPage() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const [id, setId] = useState<string | null>(null);
  const [whisky, setWhisky] = useState<Whisky | null>(null);
  const [rating, setRating] = useState<Rating | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const paramId = searchParams.get('id');
    if (paramId) {
      setId(paramId);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!id) return;

    const fetchWhisky = async () => {
      try {
        const res = await fetch(`http://localhost:8080/whisky/${id}`);
        if (!res.ok) throw new Error('API取得失敗');

        const json = await res.json();
        setWhisky(json.whisky);
        setRating(json.ratingList[0]);
      } catch (error) {
        console.error('取得失敗:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWhisky();
  }, [id]);

  const handleDelete = async (): Promise<void> => {
    if (!whisky) return;

    const confirmDelete = window.confirm('本当に削除しますか？');
    if (!confirmDelete) return;

    try {
      await fetch(`http://localhost:8080/deleteWhisky/${whisky.userId}/${whisky.id}`, {
        method: 'PUT',
      });

      alert('削除が完了しました');
    } catch (error) {
      console.error('削除失敗:', error);
    }
  };

  const handleUpdate = async (): Promise<void> => {
    if (!whisky || !rating) return;

    try {
      await fetch(`http://localhost:8080/updateWhiskyInfo/${whisky.id}/${rating.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whisky, rating }),
      });

      alert('ウイスキー情報を更新しました！');
      router.push('/mypage');
    } catch (error) {
      console.error('更新失敗:', error);
    }
  };


  if (loading) {
    return <p className="text-center text-gray-400 mt-10">読み込み中...</p>;
  }

  if (!whisky || !rating) {
    return (
      <main className="min-h-screen bg-black text-white px-4 py-8">
        <h1 className="text-center text-red-500 text-xl">データ取得に失敗しました</h1>
        <p className="text-center text-gray-400 mt-4">ウイスキーID: {id ?? '未取得'}</p>
        <div className="text-center mt-6">
          <Link href="/" className="text-yellow-400 hover:underline">TOPに戻る</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white px-4 py-8">
      <h1 className="text-3xl font-bold text-yellow-400 text-center mb-6">ウイスキー情報更新</h1>

      <form className="max-w-md mx-auto bg-gray-800 bg-opacity-80 p-6 rounded shadow space-y-6">
        <div>
          <label className="block mb-1 font-semibold">ウイスキー名</label>
          <input
            type="text"
            value={whisky.name}
            onChange={(e) => setWhisky({ ...whisky, name: e.target.value })}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">テイスト</label>
          <input
            type="text"
            value={whisky.taste}
            onChange={(e) => setWhisky({ ...whisky, taste: e.target.value })}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">飲み方</label>
          <input
            type="text"
            value={whisky.drinkingStyle}
            onChange={(e) => setWhisky({ ...whisky, drinkingStyle: e.target.value })}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">価格</label>
          <input
            type="number"
            value={whisky.price}
            onChange={(e) => setWhisky({ ...whisky, price: Number(e.target.value) })}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">メモ</label>
          <textarea
            value={whisky.memo}
            onChange={(e) => setWhisky({ ...whisky, memo: e.target.value })}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
          />
        </div>

        <div>
          <label className="block mb-5 font-semibold">評価（★1〜5）</label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setRating({ ...rating, rating: num })}
                className={`text-2xl ${num <= rating.rating ? 'text-yellow-400' : 'text-gray-500'
                  } hover:scale-110 transition-transform`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleUpdate}
          className="mb-5 w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
        >
          更新する

        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="mb-5 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          削除する
        </button>

        <div className="text-center mt-4">
          <Link href="/" className="text-yellow-400 hover:underline">TOPに戻る</Link>
        </div>
      </form>
    </main>
  );
}
