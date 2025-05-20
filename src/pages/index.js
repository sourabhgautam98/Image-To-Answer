'use client';

import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-4">
      {/* Header */}
      <header className="w-full text-center py-6">
        <h1 className="text-4xl font-bold text-gray-800">Clear Interview</h1>
      </header>

      {/* Buttons */}
      <div className="flex flex-col items-center space-y-12 mt-8">
        <Link href="/camera">
          <button className="w-48 py-3 bg-blue-600 text-white rounded-lg border-2 border-white hover:bg-blue-700 hover:border-white transition">
            Camera to Answer
          </button>
        </Link>
        <Link href="/upload">
          <button className="w-48 py-3 bg-green-600 text-white rounded-lg border-2 border-white hover:bg-green-700 hover:border-white transition">
            Upload to Answer
          </button>
        </Link>
        <Link href="/">
          <button className="w-48 py-3 bg-purple-600 text-white rounded-lg border-2 border-white hover:bg-purple-700 hover:border-white transition">
            Speak to Answer
          </button>
        </Link>
      </div>
    </div>
  );
}