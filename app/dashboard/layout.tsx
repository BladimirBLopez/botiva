import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect('/login');

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 bg-gray-900 text-white p-4 flex flex-col gap-2">
        <h1 className="text-xl font-bold mb-6">Botiva</h1>
        <a href="/dashboard" className="hover:bg-gray-800 rounded px-3 py-2">
          Inicio
        </a>
        <a
          href="/dashboard/conversaciones"
          className="hover:bg-gray-800 rounded px-3 py-2"
        >
          Conversaciones
        </a>
        <a
          href="/dashboard/contactos"
          className="hover:bg-gray-800 rounded px-3 py-2"
        >
          Contactos
        </a>
      </aside>
      <main className="flex-1 bg-gray-50">{children}</main>
    </div>
  );
}
