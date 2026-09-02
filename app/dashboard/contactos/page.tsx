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
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Contactos</h1>

      {contacts.length === 0 ? (
        <p className="text-gray-500">No hay contactos todavía.</p>
      ) : (
        <div className="bg-white rounded-lg shadow divide-y">
          {contacts.map((contact) => (
            <div key={contact.id} className="p-4">
              <p className="font-medium">
                {contact.name || 'Sin nombre'}
              </p>
              <p className="text-sm text-gray-500">{contact.phone}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
