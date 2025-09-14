export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-5xl font-bold mb-6 text-yellow-400">WhiskyQuest 🥃</h1>
      <p className="text-lg text-gray-300 text-center max-w-xl mb-10">
        あなたのウイスキー体験を記録・共有しましょう。
      </p>

      <div className="flex gap-6">
        <a
          href="/register"
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-6 rounded shadow transition"
        >
          ウイスキーを登録する
        </a>
        <a
          href="/mypage"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded shadow transition"
        >
          マイページへ
        </a>
      </div>

      <footer className="absolute bottom-4 text-xs text-gray-500">
         あなたの一番好きなウイスキーは？
      </footer>
    </main>
  );
}
