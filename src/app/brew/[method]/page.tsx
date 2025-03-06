import { useState, useEffect } from 'react';
import Link from 'next/link';
import BrewTimerClient from './BrewTimerClient';

interface Step {
  time: number;
  description: string;
  waterAmount?: number;
}

const brewMethods: Record<string, {
  name: string;
  steps: Step[];
  ratio: number; // koffie:water ratio (bijv. 1:16)
}> = {
  kalita: {
    name: 'Kalita Wave 101D',
    ratio: 16,
    steps: [
      { time: 0, description: 'Start met het verwarmen van het water tot 94°C' },
      { time: 0, description: 'Maal de koffiebonen' },
      { time: 0, description: 'Voeg de gemalen koffie toe aan het filter' },
      { time: 0, description: 'Start met het eerste gietje (bloom)' },
      { time: 30, description: 'Wacht tot het water is doorgetrokken' },
      { time: 30, description: 'Giet het resterende water in cirkels' },
      { time: 180, description: 'Wacht tot alle koffie is doorgetrokken' }
    ]
  },
  aeropress: {
    name: 'AeroPress',
    ratio: 16,
    steps: [
      { time: 0, description: 'Start met het verwarmen van het water tot 94°C' },
      { time: 0, description: 'Maal de koffiebonen' },
      { time: 0, description: 'Voeg de gemalen koffie toe aan de AeroPress' },
      { time: 0, description: 'Giet het water toe' },
      { time: 60, description: 'Roer voorzichtig' },
      { time: 60, description: 'Wacht tot het water is doorgetrokken' },
      { time: 60, description: 'Duw de plunger naar beneden' }
    ]
  },
  v60: {
    name: 'Hario V60',
    ratio: 16,
    steps: [
      { time: 0, description: 'Start met het verwarmen van het water tot 94°C' },
      { time: 0, description: 'Maal de koffiebonen' },
      { time: 0, description: 'Voeg de gemalen koffie toe aan het filter' },
      { time: 0, description: 'Start met het eerste gietje (bloom)' },
      { time: 30, description: 'Wacht tot het water is doorgetrokken' },
      { time: 30, description: 'Giet het resterende water in cirkels' },
      { time: 180, description: 'Wacht tot alle koffie is doorgetrokken' }
    ]
  }
};

export default function BrewTimerPage({
  params,
}: {
  params: { method: string };
}) {
  const method = params.method;
  const brewMethod = brewMethods[method];

  if (!brewMethod) {
    return (
      <div className="min-h-screen p-6 bg-black text-white">
        <h1 className="text-3xl font-bold mb-8 text-center">Methode niet gevonden</h1>
        <Link href="/" className="text-blue-500 hover:text-blue-400">
          ← Terug naar home
        </Link>
      </div>
    );
  }

  return <BrewTimerClient brewMethod={brewMethod} />;
} 