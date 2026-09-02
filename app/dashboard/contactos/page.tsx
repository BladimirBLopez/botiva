import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function ContactosPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const orgId = (session.user as any).organizationId;

  const contacts = await prisma.contact.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-xl font-semibold text-botiva-ink mb-6">
        Contactos
      </h1>

      {contacts.length === 0 ? (
        <p className="text-sm text-gray-500">Todavía no hay contactos.</p>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
          {contacts.map((contact) => (
            <div key={contact.id} className="px-5 py-4">
              <p className="text-sm font-medium text-botiva-ink">
                {contact.name || 'Sin nombre'}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{contact.phone}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
