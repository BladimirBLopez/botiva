import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect('/login');

  const navItems = [
    { href: '/dashboard', label: 'Inicio' },
    { href: '/dashboard/conversaciones', label: 'Conversaciones' },
    { href: '/dashboard/contactos', label: 'Contactos' },
  ];

  return (
    <div className="min-h-screen flex bg-botiva-bg">
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-5 py-6">
          <span className="text-lg font-semibold text-botiva-ink">
            Botiva
          </span>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block px-3 py-2 rounded-md text-sm text-gray-600 border-l-2 border-transparent hover:bg-botiva-blue-soft hover:text-botiva-blue hover:border-botiva-blue transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
