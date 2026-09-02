import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function ConversacionesPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const orgId = (session.user as any).organizationId;

  const conversations = await prisma.conversation.findMany({
    where: { organizationId: orgId },
    include: { contact: true },
    orderBy: { updatedAt: 'desc' },
  });

  const statusLabel: Record<string, string> = {
    waiting: 'En espera',
    attending: 'En atención',
    finished: 'Finalizada',
  };

  const statusColor: Record<string, string> = {
    waiting: 'bg-yellow-100 text-yellow-800',
    attending: 'bg-blue-100 text-blue-800',
    finished: 'bg-green-100 text-green-800',
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Conversaciones</h1>

      {conversations.length === 0 ? (
        <p className="text-gray-500">No hay conversaciones todavía.</p>
      ) : (
        <div className="bg-white rounded-lg shadow divide-y">
          {conversations.map((conv) => (
            <Link
              key={conv.id}
              href={`/dashboard/conversaciones/${conv.id}`}
              className="flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <div>
                <p className="font-medium">
                  {conv.contact.name || conv.contact.phone}
                </p>
                <p className="text-sm text-gray-500">{conv.contact.phone}</p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  statusColor[conv.status]
                }`}
              >
                {statusLabel[conv.status]}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
