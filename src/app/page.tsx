'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';


type WhiskyRanking = {
  whiskyId: number;
  name: string;
  averageRating: number;
  ratingCount: number;
};

export default function RegisterWhiskyPage() {
  const { userId } = useParams();
  const [rankingList, setRankingList] = useState<WhiskyRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [selectedUserId, setSelectedUserId] = useState<number | ''>('');
  const [userExists, setUserExists] = useState<boolean | null>(null);


  useEffect(() => {
    const storedId = localStorage.getItem('selectedUserId');
    if (storedId) {
      setSelectedUserId(Number(storedId));
    }
  }, []);
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

      <div className="flex items-center gap-4 mb-2">
        <label className="text-white font-semibold mb-1">ユーザーIDを入力:</label>
        <div className="flex items-center gap-4 mb-2">
          <input
            type="number"
            value={selectedUserId}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedUserId(value === '' ? '' : Number(value));
            }}
            className="bg-gray-700 text-white p-2 rounded w-24"
            min={1}
          />
          <button
            onClick={async () => {
              if (selectedUserId === '') return;

              localStorage.setItem('selectedUserId', selectedUserId.toString());

              try {
                const res = await fetch(`http://localhost:8080/user/${selectedUserId}`);
                if (!res.ok) {
                  setUserExists(false);
                  return;
                }
                const json = await res.json();
                if (json && json.users) {
                  setUserExists(true);
                } else {
                  setUserExists(false);
                }
              } catch (error) {
                console.error('ユーザー確認失敗:', error);
                setUserExists(false);
              }
            }}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
          >
            ユーザー切り替え
          </button>

        </div>
      </div>

      {/* ← インデントして改行表示 */}
      {selectedUserId === '' && (
        <p className="text-sm text-red-400 ml-6 mb-5">
          ユーザーIDを選択してください
        </p>
      )}
      {selectedUserId !== '' && (
        <p className="text-smtext-white p-2 mb-5 ">
          現在のユーザーID: <span className="text-yellow-400 font-semibold">{selectedUserId}</span>
        </p>

      )}
      {userExists === false && (
        <p className="text-sm text-red-400 mb-5">
          このIDのユーザーは登録されていません
        </p>
      )}





      <div className="flex gap-6 mb-12">
        <button
          onClick={() => {
            if (!selectedUserId) {
              alert('ユーザーを選択してください');
              return;
            }
            router.push(`/register/${selectedUserId}`);
          }}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-6 rounded shadow transition"
        >
          ウイスキーを登録する
        </button>

        <button
          onClick={() => {
            if (!selectedUserId) {
              alert('ユーザーを選択してください');
              return;
            }
            router.push(`/mypage/${selectedUserId}`);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded shadow transition"
        >
          マイページへ
        </button>
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
      <div>
        <Link
          href="/userRegister"
          className="bg-sky-400 hover:bg-sky-500 text-white font-semibold py-2 px-6 rounded shadow transition"
        >
          ユーザー新規登録
        </Link>
      </div>

      <footer className="text-xs mt-5 text-gray-500">
        あなたの一番好きなウイスキーを探しに行きませんか？
      </footer>
    </main>
  );
}
