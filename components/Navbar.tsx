"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-sm border-b">
      <Link href="/" className="text-xl font-bold text-blue-600">MyBlog</Link>
      
      <div className="flex gap-4 items-center">
        {session ? (
          <>
            <span className="text-sm text-gray-600">Hi, {session.user?.email}</span>
            <button 
              onClick={() => signOut()} 
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/signin" className="text-gray-600 hover:text-blue-600">Sign In</Link>
            <Link href="/signup" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
