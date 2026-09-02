'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError('Correo o contraseña incorrectos');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-botiva-bg px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg border border-gray-200 w-full max-w-sm"
      >
        <h1 className="text-xl font-semibold text-botiva-ink mb-1">
          Botiva
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Ingresa a tu panel de mensajería
        </p>

        {error && (
          <p className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded mb-4">
            {error}
          </p>
        )}

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Correo
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-botiva-blue focus:border-botiva-blue"
          required
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Contraseña
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-6 text-sm focus:outline-none focus:ring-2 focus:ring-botiva-blue focus:border-botiva-blue"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-botiva-blue text-white py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}
