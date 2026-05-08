'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SuccessPage() {
  const router = useRouter();
  const [count, setCount] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => {
        if (prev === 1) {
          router.push('/portail/dashboard');
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">Succès!</h1>
        <p className="text-xl text-gray-600 mb-2">Votre devis a été signé avec succès.</p>
        <p className="text-gray-600 mb-8">
          Nous avons bien reçu votre signature et nous vous contacterons bientôt pour planifier les travaux.
        </p>

        <div className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg mb-8">
          <p className="text-lg font-semibold">
            Redirection dans <span className="font-bold text-2xl">{count}</span> secondes...
          </p>
        </div>

        <button
          onClick={() => router.push('/portail/dashboard')}
          className="text-blue-600 hover:text-blue-700 font-semibold underline"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}
