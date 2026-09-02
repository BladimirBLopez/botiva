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
    waiting: 'bg-amber-50 text-amber-700',
    attending: 'bg-botiva-blue-soft text-botiva-blue',
    finished: 'bg-emerald-50 text-emerald-700',
  };

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-xl font-semibold text-botiva-ink mb-6">
        Conversaciones
      </h1>

      {conversations.length === 0 ? (
        <p className="text-sm text-gray-500">
          Todavía no hay conversaciones.
        </p>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
          {conversations.map((conv) => (
            <Link
              key={conv.id}
              href={`/dashboard/conversaciones/${conv.id}`}
              className="flex items-center justify-between px-5 py-4 hover:bg-botiva-bg transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-botiva-ink">
                  {conv.contact.name || conv.contact.phone}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {conv.contact.phone}
                </p>
              </div>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${
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
