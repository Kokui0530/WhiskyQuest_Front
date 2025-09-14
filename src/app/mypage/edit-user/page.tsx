'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type User = {
  userName: string;
  mail: string;
  password: string;
};

export default function EditUserPage() {
  const [user, setUser] = useState<User>({
    userName: '',
    mail: '',
    password: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:8080/user/1');
        const json = await res.json();
        setUser({
          userName: json.users.userName,
          mail: json.users.mail,
          password: json.users.password,
        });
      } catch (error) {
        console.error('ユーザー情報取得失敗:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleUpdate = async () => {
    try {
      await fetch('http://localhost:8080/user/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      alert('ユーザー情報を更新しました！');
    } catch (error) {
      console.error('更新失敗:', error);
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm('本当に退会しますか？');
    if (!confirm) return;

    try {
      await fetch('http://localhost:8080/user/1/delete', {
        method: 'PUT',
      });
      alert('退会処理が完了しました');
    } catch (error) {
      console.error('退会失敗:', error);
    }
  };

  if (loading) return <p className="text-center text-gray-400 mt-10">読み込み中...</p>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white px-4 py-8">
      <h1 className="text-3xl font-bold text-yellow-400 text-center mb-6">ユーザー情報更新</h1>
      <form className="max-w-md mx-auto bg-gray-800 bg-opacity-80 p-6 rounded shadow space-y-4">
        <div>
          <label className="block mb-1 font-semibold">ユーザーネーム</label>
          <input
            type="text"
            value={user.userName}
            onChange={(e) => setUser({ ...user, userName: e.target.value })}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">メールアドレス</label>
          <input
            type="email"
            value={user.mail}
            onChange={(e) => setUser({ ...user, mail: e.target.value })}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">パスワード</label>
          <input
            type="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
          />
        </div>

        <button
          type="button"
          onClick={handleUpdate}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
        >
          更新する
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          退会する（論理削除）
        </button>

        <div className="text-center mt-4">
          <Link href="/" className="text-yellow-400 hover:underline">TOPに戻る</Link>
        </div>
      </form>
    </main>
  );
}
