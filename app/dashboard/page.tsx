import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-2">
        Bienvenido, {session.user?.name}
      </h1>
      <p className="text-gray-600">
        Organización: {(session.user as any).organizationId}
      </p>
      <p className="text-gray-600">
        Rol: {(session.user as any).role}
      </p>
    </div>
  );
}
