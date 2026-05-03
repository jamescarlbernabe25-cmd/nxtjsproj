import Link from "next/link";

export default function HomeNotLogin() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
        Share your story with the world.
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl">
        Join our community of writers and readers. Sign up today to start posting and engaging with others.
      </p>
      <div className="flex gap-4">
        <Link href="/signup" className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700">
          Create Account
        </Link>
        <Link href="/signin" className="px-8 py-3 border border-gray-300 rounded-full font-bold text-lg hover:bg-gray-50">
          Sign In
        </Link>
      </div>
    </div>
  );
}
