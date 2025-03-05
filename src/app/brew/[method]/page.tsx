'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface BrewStep {
  id: number;
  description: string;
  duration: number;
  waterAmount?: number;
}

const brewMethods = {
  kalita: {
    name: 'Kalita Wave 101D',
    ratio: 16, // 1:16 koffie tot water ratio
    steps: [
      { id: 1, description: 'Voeg koffie toe en maak een kuiltje in het midden', duration: 0 },
      { id: 2, description: 'Bloom: giet voorzichtig water in het midden', duration: 30, waterAmount: 40 },
      { id: 3, description: 'Eerste gieting', duration: 30, waterAmount: 100 },
      { id: 4, description: 'Tweede gieting', duration: 30, waterAmount: 100 },
      { id: 5, description: 'Wacht tot al het water is doorgelopen', duration: 60 }
    ]
  },
  aeropress: {
    name: 'AeroPress',
    ratio: 15,
    steps: [
      { id: 1, description: 'Voeg koffie toe', duration: 0 },
      { id: 2, description: 'Giet water tot aan markering 4', duration: 10, waterAmount: 240 },
      { id: 3, description: 'Roer voorzichtig', duration: 10 },
      { id: 4, description: 'Wacht', duration: 90 },
      { id: 5, description: 'Druk de plunger langzaam naar beneden', duration: 30 }
    ]
  },
  v60: {
    name: 'Hario V60',
    ratio: 16.5,
    steps: [
      { id: 1, description: 'Voeg koffie toe en maak een kuiltje', duration: 0 },
      { id: 2, description: 'Bloom: giet voorzichtig 50ml water', duration: 30, waterAmount: 50 },
      { id: 3, description: 'Eerste spiraalvormige gieting', duration: 30, waterAmount: 100 },
      { id: 4, description: 'Tweede spiraalvormige gieting', duration: 30, waterAmount: 100 },
      { id: 5, description: 'Laatste gieting', duration: 30, waterAmount: 100 },
      { id: 6, description: 'Wacht tot al het water is doorgelopen', duration: 45 }
    ]
  }
};

export default function BrewPage() {
  const router = useRouter();
  const params = useParams();
  const method = params.method as keyof typeof brewMethods;
  
  const [coffeeAmount, setCoffeeAmount] = useState(15);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const brewMethod = brewMethods[method];
  const waterTotal = coffeeAmount * brewMethod.ratio;

  useEffect(() => {
    if (!isRunning || timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((time) => {
        if (time <= 1) {
          setIsRunning(false);
          return 0;
        }
        return time - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const startStep = (step: BrewStep) => {
    setTimeLeft(step.duration);
    setIsRunning(true);
  };

  const nextStep = () => {
    if (currentStep < brewMethod.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      startStep(brewMethod.steps[currentStep + 1]);
    }
  };

  const resetTimer = () => {
    setCurrentStep(0);
    setTimeLeft(0);
    setIsRunning(false);
  };

  return (
    <main className="min-h-screen p-6 bg-black text-white">
      <button
        onClick={() => router.push('/')}
        className="mb-6 text-blue-500 hover:text-blue-400 transition-colors"
      >
        ← Terug naar overzicht
      </button>
      
      <h1 className="text-3xl font-bold mb-8">{brewMethod.name}</h1>
      
      <div className="mb-8">
        <label className="block mb-2">Hoeveelheid koffie (g):</label>
        <input
          type="number"
          value={coffeeAmount}
          onChange={(e) => setCoffeeAmount(Number(e.target.value))}
          className="bg-gray-800 border border-gray-700 rounded px-3 py-2 w-24 text-white"
          min="1"
          max="50"
        />
        <p className="mt-2">Water nodig: {waterTotal}ml</p>
      </div>

      <div className="bg-gray-900 rounded-lg p-6 mb-6">
        <div className="text-4xl font-bold mb-4 text-center">
          {timeLeft}s
        </div>
        
        <p className="text-xl mb-4">
          {currentStep < brewMethod.steps.length
            ? brewMethod.steps[currentStep].description
            : 'Klaar!'}
        </p>

        {brewMethod.steps[currentStep]?.waterAmount && (
          <p className="text-gray-400 mb-4">
            Water deze stap: {Math.round(brewMethod.steps[currentStep].waterAmount! * (coffeeAmount / 15))}ml
          </p>
        )}
      </div>

      <div className="flex gap-4 justify-center">
        {!isRunning && currentStep === 0 && (
          <button
            onClick={() => startStep(brewMethod.steps[0])}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Start
          </button>
        )}
        
        {isRunning && (
          <button
            onClick={() => setIsRunning(false)}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Pauze
          </button>
        )}
        
        {!isRunning && currentStep > 0 && currentStep < brewMethod.steps.length && (
          <button
            onClick={() => setIsRunning(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Hervat
          </button>
        )}
        
        {!isRunning && timeLeft === 0 && currentStep < brewMethod.steps.length - 1 && (
          <button
            onClick={nextStep}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Volgende stap
          </button>
        )}
        
        {!isRunning && currentStep > 0 && (
          <button
            onClick={resetTimer}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Reset
          </button>
        )}
      </div>
    </main>
  );
} 