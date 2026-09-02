import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { id } = await params;
  const orgId = (session.user as any).organizationId;
  const { body } = await req.json();

  if (!body || typeof body !== 'string') {
    return NextResponse.json({ error: 'Mensaje vacío' }, { status: 400 });
  }

  const conversation = await prisma.conversation.findFirst({
    where: { id, organizationId: orgId },
    include: { contact: true },
  });

  if (!conversation) {
    return NextResponse.json(
      { error: 'Conversación no encontrada' },
      { status: 404 }
    );
  }

  const organization = await prisma.organization.findUnique({
    where: { id: orgId },
  });

  if (!organization?.phoneNumberId || !organization?.accessToken) {
    return NextResponse.json(
      { error: 'Esta organización no tiene WhatsApp conectado' },
      { status: 400 }
    );
  }

  // Enviar el mensaje a través de la API de Meta
  const metaResponse = await fetch(
    `https://graph.facebook.com/v21.0/${organization.phoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${organization.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: conversation.contact.phone,
        type: 'text',
        text: { body },
      }),
    }
  );

  const metaData = await metaResponse.json();

  if (!metaResponse.ok) {
    return NextResponse.json(
      { error: 'Error al enviar a WhatsApp', details: metaData },
      { status: 500 }
    );
  }

  const savedMessage = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      direction: 'outbound',
      body,
      status: 'sent',
    },
  });

  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { status: 'attending' },
  });

  return NextResponse.json({ ok: true, message: savedMessage });
}
