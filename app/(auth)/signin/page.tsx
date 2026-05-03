"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Attempt to sign in using NextAuth
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false, // Handle redirect manually to check for verification error
    });

    if (res?.error) {
      if (res.error === "ACCOUNT_NOT_VERIFIED") {
        setError("Account not verified. Redirecting to verification page...");
        // Delay redirect so user can read the message
        setTimeout(() => router.push("/verify"), 2000);
      } else {
        setError("Invalid email or password.");
      }
      setLoading(false);
    } else {
      // Success! Redirect to home or dashboard
      router.push("/home-login");
      router.refresh();
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 rounded text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {loading ? "Processing..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <Link href="/signup" className="text-blue-600 hover:underline">
            No account? Sign up
          </Link>
        </div>
      </div>
    </main>
  );
}
