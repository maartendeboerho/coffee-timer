'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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

type Props = {
  params: {
    method: string;
  };
};

export default function BrewTimer({ params }: Props) {
  const method = params.method;
  const brewMethod = brewMethods[method];
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [targetVolume, setTargetVolume] = useState(250); // standaard 250ml
  const [coffeeAmount, setCoffeeAmount] = useState(0);
  const [waterAmount, setWaterAmount] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (currentStep < brewMethod.steps.length - 1) {
              setCurrentStep((prev) => prev + 1);
              setTimeLeft(brewMethod.steps[currentStep + 1].time);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, currentStep, brewMethod.steps]);

  useEffect(() => {
    // Bereken koffie en water hoeveelheden
    const coffee = targetVolume / brewMethod.ratio;
    setCoffeeAmount(Math.round(coffee * 10) / 10);
    setWaterAmount(targetVolume);
  }, [targetVolume, brewMethod.ratio]);

  const handleStart = () => {
    setIsRunning(true);
    setTimeLeft(brewMethod.steps[currentStep].time);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setTimeLeft(0);
  };

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

  return (
    <div className="min-h-screen p-6 bg-black text-white">
      <div className="max-w-md mx-auto">
        <Link href="/" className="text-blue-500 hover:text-blue-400 mb-4 inline-block">
          ← Terug naar home
        </Link>
        
        <h1 className="text-3xl font-bold mb-8 text-center">{brewMethod.name}</h1>

        <div className="mb-8 p-4 bg-gray-900 rounded-lg">
          <label className="block mb-2">
            Gewenste hoeveelheid koffie (ml):
            <input
              type="number"
              value={targetVolume}
              onChange={(e) => setTargetVolume(Number(e.target.value))}
              className="w-full mt-1 p-2 bg-gray-800 rounded border border-gray-700 text-white"
              min="100"
              max="1000"
              step="50"
            />
          </label>
          <div className="mt-2 text-sm text-gray-400">
            <p>Benodigde koffie: {coffeeAmount}g</p>
            <p>Benodigd water: {waterAmount}ml</p>
          </div>
        </div>

        <div className="mb-8 p-4 bg-gray-900 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Stap {currentStep + 1} van {brewMethod.steps.length}</h2>
          <p className="text-lg mb-4">{brewMethod.steps[currentStep].description}</p>
          {timeLeft > 0 && (
            <div className="text-4xl font-bold text-center mb-4">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4">
          {!isRunning && currentStep === 0 ? (
            <button
              onClick={handleStart}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 