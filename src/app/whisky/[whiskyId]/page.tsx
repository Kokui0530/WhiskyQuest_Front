'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

type Review = {
    rating: number;
    comment: string;
};

export default function WhiskyDetailPage() {
    const { whiskyId } = useParams();
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        fetch(`http://localhost:8080/whisky/${whiskyId}`)
            .then((res) => res.json())
            .then((data) => {
                console.log('APIレスポンス:', data);
                setReviews(data.ratingList);
            });
    }, [whiskyId]);


    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center px-4">
            <div className="bg-gray-800 bg-opacity-80 p-8 rounded shadow-md w-full max-w-md space-y-6">
                <h1 className="text-2xl font-bold text-yellow-400 text-center">評価一覧</h1>
                <ul className="space-y-4">
                    {reviews.map((review, idx) => (
                        <li key={idx} className="bg-gray-700 p-4 rounded shadow">
                            <div className="text-yellow-400 text-xl">
                                {'★'.repeat(review.rating)}
                            </div>
                            <p className="mt-2 text-white">{review.comment}</p>
                        </li>
                    ))}
                </ul>
                <div className="flex justify-end mt-6">
                    <Link href="/">
                        <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded">
                            TOPへ戻る
                        </button>
                    </Link>
                </div>
            </div>
        </main>

    );
}
