import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';

export default async function ConversacionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) redirect('/login');

  const { id } = await params;
  const orgId = (session.user as any).organizationId;

  const conversation = await prisma.conversation.findFirst({
    where: { id, organizationId: orgId },
    include: {
      contact: true,
      messages: { orderBy: { createdAt: 'asc' } },
    },
  });

  if (!conversation) notFound();

  return (
    <div className="p-8 flex flex-col h-screen">
      <div className="mb-4">
        <h1 className="text-xl font-bold">
          {conversation.contact.name || conversation.contact.phone}
        </h1>
        <p className="text-sm text-gray-500">{conversation.contact.phone}</p>
      </div>

      <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow p-4 space-y-3">
        {conversation.messages.length === 0 ? (
          <p className="text-gray-400 text-sm">Sin mensajes todavía.</p>
        ) : (
          conversation.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.direction === 'outbound' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                  msg.direction === 'outbound'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                {msg.body}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
