'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';


type User = {
  id: string;
  userName: string;
  mail: string;
  password: string;
};

export default function EditUserPage() {
  const router = useRouter();

  const [user, setUser] = useState<User>({
    id: '',
    userName: '',
    mail: '',
    password: '',
  });

  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:8080/user/3');
        const json = await res.json();
        setUser({
          id: json.users.id,
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
      const res = await fetch('http://localhost:8080/updateUser/3', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      if (res.ok) {
        alert('ユーザー情報を更新しました！');
        router.push('/mypage');
      } else {
        alert('更新に失敗しました');
      }
    } catch (error) {
      console.error('更新失敗:', error);
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm('本当に退会しますか？');
    if (!confirm) return;

    try {
      await fetch('http://localhost:8080/deleteUser/3', {
        method: 'PUT',
      });
      alert('退会処理が完了しました');
    } catch (error) {
      console.error('退会失敗:', error);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-400 mt-10">読み込み中...</p>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white px-4 py-8">
      <h1 className="text-3xl font-bold text-yellow-400 text-center mb-6">ユーザー情報更新</h1>
      <form className="max-w-md mx-auto bg-gray-800 bg-opacity-80 p-6 rounded shadow space-y-6">
        <div>
          <input type="hidden" name="id" value={user.id} />
        </div>

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
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 p-1 text-gray-300 hover:text-white"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
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
          退会する
        </button>

        <div className="text-center mt-4">
          <Link href="/" className="text-yellow-400 hover:underline">TOPに戻る</Link>
        </div>
      </form>
    </main>
  );
}
