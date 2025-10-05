'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type WhiskyRanking = {
    whiskyId: number;
    name: string;
    averageRating: number;
    ratingCount: number;
};

export default function RankingPage() {
    const [rankingList, setRankingList] = useState<WhiskyRanking[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const res = await fetch('http://WhiskyQuestALB-2003468577.ap-northeast-1.elb.amazonaws.com/whiskyRanking');
                const json = await res.json();
                setRankingList(json);
            } catch (error) {
                console.error('ランキング取得失敗:', error);
            } finally {
                setLoading(false);
            }
        };

        const storedId = localStorage.getItem('selectedUserId');
        if (storedId) setUserId(storedId);

        fetchRanking();
    }, []);

    const renderStars = (rating: number) => {
        const fullStars = Math.round(rating);
        return '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
    };

    return (
        <main className="min-h-screen bg-gray-900 text-white px-4 py-8 flex flex-col items-center">
            <h1 className="text-4xl font-bold mb-6 text-yellow-400">ウイスキーランキング</h1>

            {loading ? (
                <p className="text-center text-gray-400">読み込み中...</p>
            ) : rankingList.length === 0 ? (
                <p className="text-center text-gray-400">ランキングデータがありません</p>
            ) : (
                <ul className="w-full max-w-xl space-y-4">
                    {rankingList.map((item, index) => (
                        <li key={item.whiskyId} className="bg-gray-800 p-4 rounded shadow">
                            <Link
                                href={`/rankingDetail/${item.whiskyId}`}
                                className="text-lg font-semibold text-yellow-300 hover:underline"
                            >
                                {item.name}
                            </Link>
                            <p className="text-yellow-400">
                                {renderStars(item.averageRating)}（{item.averageRating.toFixed(1)}）{' '}
                                <span className="text-sm text-gray-300">（{item.ratingCount}件）</span>
                            </p>
                        </li>
                    ))}
                </ul>
            )}

            {/* ✅ 下部ナビゲーション */}
            <div className="flex gap-6 mt-12">
                <button
                    onClick={() => {
                        if (!userId) {
                            alert('ユーザーIDが未選択です');
                            return;
                        }
                        router.push(`/mypage/${userId}`);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded shadow"
                >
                    マイページへ
                </button>

                <button
                    onClick={() => {
                        if (!userId) {
                            alert('ユーザーIDが未選択です');
                            return;
                        }
                        router.push(`/registerWhisky/${userId}`);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-6 rounded shadow"
                >
                    ウイスキーを登録する
                </button>
            </div>
        </main>
    );
}
