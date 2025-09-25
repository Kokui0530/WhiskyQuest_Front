'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';




export default function RegisterWhiskyPage() {
  const [name, setName] = useState('');
  const [taste, setTaste] = useState('');
  const [drinkingStyle, setDrinkingStyle] = useState<string[]>([]);
  const [price, setPrice] = useState<number | ''>('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState<number>(1); // 初期値を1に設定
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { id } = useParams();
  const router = useRouter();

  const drinkingOptions = ['ストレート', 'ロック', 'ハイボール', '水割り'];

  const handleStyleChange = (style: string) => {
    setDrinkingStyle((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('ウイスキー名は必須です');
      return;
    }

    const whiskyInfo = {
      whisky: {
        userId: Number(id),
        name,
        taste,
        drinkingStyle: drinkingStyle.join(','),
        price: price === '' ? null : price,
      },
      rating: {
        userId: Number(id),
        rating,
        comment,
      },
    };

    try {
      const res = await fetch('http://WhiskyQuestALB-2003468577.ap-northeast-1.elb.amazonaws.com/whisky', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(whiskyInfo),
      });

      if (res.status === 409) {
        alert('同じウイスキーの登録があります。\nマイページの編集から編集をしてください。');
        return;
      }

      if (!res.ok) throw new Error('登録失敗');

      alert('ウイスキーを登録しました！');
      router.push(`/mypage/${id}`);
    } catch (err) {
      console.error('登録失敗:', err);
      alert('登録中にエラーが発生しました');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center px-4">
      <form className="bg-gray-800 bg-opacity-80 p-8 rounded shadow-md w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-yellow-400 text-center">ウイスキー登録</h1>

        <div>
          <label className="block mb-1 font-semibold">ウイスキー名（必須）</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">テイスト</label>
          <input
            type="text"
            value={taste}
            onChange={(e) => setTaste(e.target.value)}
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
                  checked={drinkingStyle.includes(style)}
                  onChange={() => handleStyleChange(style)}
                  className="accent-yellow-500"
                />
                <span>{style}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-1 font-semibold">値段</label>
          <input
            type="number"
            step="1"
            value={price}
            onChange={(e) => {
              const value = e.target.value;
              setPrice(value === '' ? '' : parseInt(value, 10)); // ← 小数を完全に防ぐ！
            }}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 appearance-none"
          />


        </div>

        <div>
          <label className="block mb-1 font-semibold">コメント</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            rows={3}
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">評価（1〜5）</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl ${rating >= star ? 'text-yellow-400' : 'text-gray-500'
                  } hover:scale-110 transition-transform`}
              >
                ★
              </button>

            ))}
          </div>
        </div>
        {error && <p className="text-red-500 text-center whitespace-pre-line">{error}</p>}
        {success && <p className="text-green-400 text-center">{success}</p>}
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
        >
          登録する
        </button>
        <div className="flex justify-end mt-6">
          <Link href="/">
            <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded">
              TOPへ戻る
            </button>
          </Link>
        </div>
      </form>
    </main>
  );
}
