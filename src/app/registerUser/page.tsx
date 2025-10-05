'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterUserPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (!userName.trim() || !mail.trim() || !password.trim()) {
      setError('すべての項目は必須です');
      return;
    }

    const userInfo = { userName, mail, password };

    try {
      const res = await fetch('http://WhiskyQuestALB-2003468577.ap-northeast-1.elb.amazonaws.com/registerUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userInfo),
      });

      if (!res.ok) throw new Error('登録失敗');

      const data = await res.json();
      setSuccess(`ユーザー登録が完了しました！あなたのユーザーIDは ${data.id} です`);
      alert(`ユーザー登録が完了しました！\nあなたのユーザーIDは ${data.id} です`);

      // ✅ registerWhisky/[id] に遷移
      router.push(`/registerWhisky/${data.id}`);
    } catch (err) {
      console.error('登録失敗:', err);
      setError('登録中にエラーが発生しました');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center px-4">
      <form className="bg-gray-800 bg-opacity-80 p-8 rounded shadow-md w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-yellow-400 text-center">ユーザー新規登録</h1>

        <div>
          <label className="block mb-1 font-semibold">ユーザーネーム（必須）</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">メールアドレス（必須）</label>
          <input
            type="email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">パスワード（必須）</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            required
          />
        </div>

        {error && <p className="text-red-500 text-center whitespace-pre-line">{error}</p>}
        {success && <p className="text-green-400 text-center whitespace-pre-line">{success}</p>}

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
        >
          登録する
        </button>

        <div className="flex justify-between mt-6">
          <Link href="/">
            <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
              TOPへ戻る
            </button>
          </Link>
          <Link href="/login">
            <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
              ログインへ
            </button>
          </Link>
        </div>
      </form>
    </main>
  );
}
