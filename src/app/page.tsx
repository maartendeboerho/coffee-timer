'use client';

import Link from 'next/link';

interface BrewMethod {
  id: string;
  name: string;
  description: string;
}

const brewMethods: BrewMethod[] = [
  {
    id: 'kalita',
    name: 'Kalita Wave 101D',
    description: 'Perfect voor een enkele kop filter koffie'
  },
  {
    id: 'aeropress',
    name: 'AeroPress',
    description: 'Snel en gemakkelijk voor een rijke kop koffie'
  },
  {
    id: 'v60',
    name: 'Hario V60',
    description: 'De klassieke pour-over methode'
  }
];

export default function Home() {
  return (
    <main className="min-h-screen p-6 bg-black text-white">
      <h1 className="text-3xl font-bold mb-8 text-center">Koffie Timer</h1>
      <div className="grid gap-4 max-w-md mx-auto">
        {brewMethods.map((method) => (
          <Link
            key={method.id}
            href={`/brew/${method.id}`}
            className="p-6 border border-gray-700 rounded-lg hover:border-blue-500 transition-colors bg-gray-900"
          >
            <h2 className="text-xl font-semibold mb-2">{method.name}</h2>
            <p className="text-gray-400">{method.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
