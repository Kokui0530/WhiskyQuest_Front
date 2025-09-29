'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

type Rating = {
  id: number;
  userId: number;
  whiskyId: number;
  rating: number;
  comment: string;
  ratingAt: string;
  isDeleted: boolean;
};

type Whisky = {
  id: number;
  userId: number;
  name: string;
  taste: string;
  drinkingStyle: string;
  price: number | null;
  isDeleted: boolean;
};

export default function EditWhiskyPage() {
  return (
    <Suspense fallback={<p className="text-center text-gray-400 mt-10">読み込み中...</p>}>
      <EditWhiskyContent />
    </Suspense>
  );
}

function EditWhiskyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [id, setId] = useState<string | null>(null);
  const [whisky, setWhisky] = useState<Whisky | null>(null);
  const [rating, setRating] = useState<Rating | null>(null);
  const [loading, setLoading] = useState(true);
  const drinkingOptions = ['ストレート', 'ロック', 'ハイボール', '水割り'];

  useEffect(() => {
    const paramId = searchParams.get('id');
    if (paramId) setId(paramId);
  }, [searchParams]);

  useEffect(() => {
    if (!id) return;

    const fetchWhisky = async () => {
      try {
        const res = await fetch(`http://WhiskyQuestALB-2003468577.ap-northeast-1.elb.amazonaws.com/whisky/${id}`);
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

  const handleStyleChange = (style: string) => {
    if (!whisky) return;
    const current = whisky.drinkingStyle?.split(',') ?? [];
    const updated = current.includes(style)
      ? current.filter((s) => s !== style)
      : [...current, style];
    setWhisky({ ...whisky, drinkingStyle: updated.join(',') });
  };

  const handleUpdate = async () => {
    if (!whisky || !rating) return;

    try {
      const res = await fetch(`http://WhiskyQuestALB-2003468577.ap-northeast-1.elb.amazonaws.com/updateWhiskyInfo/${whisky.id}/${rating.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whisky, rating }),
      });

      if (res.ok) {
        alert('ウイスキー情報を更新しました！');
        router.push(`/mypage/${whisky.userId}`);
      } else {
        alert('更新に失敗しました');
      }
    } catch (error) {
      console.error('更新失敗:', error);
      alert('エラーが発生しました');
    }
  };

  const handleDelete = async () => {
    if (!whisky || !rating) return;

    const confirmDelete = window.confirm('本当に削除しますか？');
    if (!confirmDelete) return;

    try {
      const resWhisky = await fetch(`http://WhiskyQuestALB-2003468577.ap-northeast-1.elb.amazonaws.com/deleteWhisky/${whisky.userId}/${whisky.id}`, {
        method: 'PUT',
      });

      const resRating = await fetch(`http://WhiskyQuestALB-2003468577.ap-northeast-1.elb.amazonaws.com/deleteRating/${rating.userId}/${rating.id}`, {
        method: 'PUT',
      });

      if (resWhisky.ok && resRating.ok) {
        alert('削除が完了しました');
        router.push('/');
      } else {
        alert('削除に失敗しました');
      }
    } catch (error) {
      console.error('削除失敗:', error);
      alert('エラーが発生しました');
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

  const selectedStyles = whisky.drinkingStyle?.split(',') ?? [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white px-4 py-8">
      <h1 className="text-3xl font-bold text-yellow-400 text-center mb-6">ウイスキー情報更新</h1>

      <form className="max-w-md mx-auto bg-gray-800 bg-opacity-80 p-6 rounded shadow space-y-6">
        <div>
          <label className="block mb-1 font-semibold">ウイスキー名（必須）</label>
          <input
            type="text"
            value={whisky.name}
            onChange={(e) => setWhisky({ ...whisky, name: e.target.value })}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            required
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
          <label className="block mb-1 font-semibold">飲み方（複数選択可）</label>
          <div className="flex flex-wrap gap-2">
            {drinkingOptions.map((style) => (
              <label key={style} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={selectedStyles.includes(style)}
                  onChange={() => handleStyleChange(style)}
                  className="accent-yellow-500"
                />
                {style}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-1 font-semibold">価格</label>
          <input
            type="number"
             step="1"
            min="0" // ← 小数を防ぐ
            value={whisky.price ?? ''}
            onChange={(e) =>
              setWhisky({
                ...whisky,
                price: e.target.value === '' ? null : parseInt(e.target.value, 10),
              })
            }
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 appearance-none"
          />

        </div>

        <div>
          <label className="block mb-1 font-semibold">コメント</label>
          <textarea
            value={rating.comment ?? ''}
            onChange={(e) => setRating({ ...rating, comment: e.target.value })}
            rows={3}
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

        <div className="flex justify-end mt-10">
          <Link href="/">
            <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded shadow">
              TOPへ戻る
            </button>
          </Link>
        </div>
      </form>
    </main>
  );
}
