'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Head from 'next/head';

export default function TopPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<number | ''>('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (userId === '') {
      setError('ユーザーIDを入力してください');
      return;
    }

    try {
      const res = await fetch(`http://WhiskyQuestALB-2003468577.ap-northeast-1.elb.amazonaws.com/user/${userId}`);
      if (!res.ok) {
        setError('このIDのユーザーは存在しません');
        return;
      }

      const json = await res.json();
      if (!json || !json.users || json.users.isDeleted) {
        setError('このユーザーは無効です');
        return;
      }

      localStorage.setItem('selectedUserId', userId.toString());
      router.push(`/registerWhisky/${userId}`);
    } catch (err) {
      console.error('ログイン失敗:', err);
      setError('ログイン中にエラーが発生しました');
    }
  };
  // 🔽 TopPage コンポーネント内に追加（handleLoginの下あたり）

  const handleGuestLogin = async () => {
    setError('');
    const guestId = 4;

    try {
      const res = await fetch(`http://WhiskyQuestALB-2003468577.ap-northeast-1.elb.amazonaws.com/user/${guestId}`);
      if (!res.ok) {
        setError('ゲストユーザーが見つかりません');
        return;
      }

      const json = await res.json();
      if (!json || !json.users || json.users.isDeleted) {
        setError('ゲストユーザーは無効です');
        return;
      }

      localStorage.setItem('selectedUserId', guestId.toString());
      router.push(`/registerWhisky/${guestId}`);
    } catch (err) {
      console.error('ゲストログイン失敗:', err);
      setError('ゲストログイン中にエラーが発生しました');
    }
  };


  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6">WhiskyQuest 🥃</h1>
      <p className="text-lg text-gray-300 mb-10 text-center">お気に入りの1本を探しに</p>

      <div className="flex flex-col gap-6 w-full max-w-md">
        {/* ✅ 新規登録 */}
        <Link href="/registerUser">
          <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded shadow">
            ユーザー新規登録
          </button>
        </Link>

        {/* ✅ IDログイン */}
        <div className="bg-gray-800 p-6 rounded shadow space-y-4">
          <label className="block font-semibold">ユーザーIDでログイン</label>
          <input
            type="number"
            value={userId}
            onChange={(e) => {
              const value = e.target.value;
              setUserId(value === '' ? '' : Number(value));
            }}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            placeholder="ユーザーIDを入力"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            ウイスキー登録へ進む
          </button>

        </div>
        {/* ✅ ゲストログイン */}
        <button
          onClick={handleGuestLogin}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded shadow"
        >
          ゲストログインして試してみる
        </button>
      </div>

      <footer className="text-xs mt-10 text-gray-500">
        あなたのウイスキー体験を記録しよう。
      </footer>
    </main>
  );
}
