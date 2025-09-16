'use client';

import { useState } from 'react';
import Link from 'next/link';

type FormData = {
  whiskyName: string;
  taste: string;
  style: string[];
  price: string;
  memo: string;
  rating: string;
};

export default function RegisterPage() {
  const [form, setForm] = useState<FormData>({
    whiskyName: '',
    taste: '',
    style: [],
    price: '',
    memo: '',
    rating: '3',
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/registerWhisky', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert('ウイスキーを登録しました！');
        setForm({
          whiskyName: '',
          taste: '',
          style: [],
          price: '',
          memo: '',
          rating: '3',
        });
      } else {
        alert('登録に失敗しました');
      }
    } catch (error) {
      console.error('登録エラー:', error);
      alert('通信エラーが発生しました');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center px-4">
      <form className="bg-gray-800 bg-opacity-80 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-yellow-400 text-center">ウイスキー登録</h2>
        <label className="block mb-2 font-semibold">ウイスキー名</label>
        <input className="w-full p-2 mb-4 border rounded" />

        <label className="block mb-2 font-semibold">テイスト</label>
        <input type="text" name="taste" value={form.taste} onChange={handleChange} required className="w-full p-2 mb-4 border rounded" />



        <label className="block mb-2 font-semibold">飲み方（複数選択可）</label>
        <div className="mb-4 space-y-2">
          {["ストレート", "ロック", "水割り", "ハイボール"].map((style) => (
            <label key={style} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={style}
                checked={form.style.includes(style)}
                onChange={() => {
                  const selected = form.style.includes(style)
                    ? form.style.filter((s) => s !== style)
                    : [...form.style, style];
                  setForm({ ...form, style: selected });
                }}
                className="accent-yellow-500"
              />
              <span>{style}</span>
            </label>
          ))}
        </div>




        <label className="block mb-2 font-semibold">値段（円）</label>
        <input name="price" value={form.price} onChange={handleChange} required className="w-full p-2 mb-4 border rounded" />

        <label className="block mb-2 font-semibold">メモ</label>
        <textarea name="memo" value={form.memo} onChange={handleChange} rows={3} className="w-full p-2 mb-4 border rounded" />
        
        <label className="block mb-2 font-semibold">評価</label>
        <div className="mb-6">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setForm({ ...form, rating: num.toString() })}
              className={`text-2xl mr-1 ${num <= parseInt(form.rating) ? 'text-yellow-400' : 'text-gray-500'
                } hover:scale-110 transition-transform`}
            >
              ★
            </button>
          ))}
        </div>


        <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded">
          登録する
        </button>

        <div className="mt-10 text-center">
          <Link href="/" className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded shadow transition">
            TOPに戻る
          </Link>
        </div>
      </form>
    </main>
  );
}
