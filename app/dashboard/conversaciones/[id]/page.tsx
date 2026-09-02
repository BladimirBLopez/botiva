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
    <div className="p-8 flex flex-col h-screen max-w-3xl">
      <div className="mb-4 pb-4 border-b border-gray-200">
        <h1 className="text-base font-semibold text-botiva-ink">
          {conversation.contact.name || conversation.contact.phone}
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          {conversation.contact.phone}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto bg-white rounded-lg border border-gray-200 p-5 space-y-3">
        {conversation.messages.length === 0 ? (
          <p className="text-sm text-gray-400">Sin mensajes todavía.</p>
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
                    ? 'bg-botiva-blue text-white'
                    : 'bg-gray-100 text-botiva-ink'
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
