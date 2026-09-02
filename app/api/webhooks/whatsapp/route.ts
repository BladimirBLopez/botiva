import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

// Verificación inicial del webhook (Meta la llama una sola vez al configurar)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse('Forbidden', { status: 403 });
}

// Recepción de mensajes entrantes
export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const entry = body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const phoneNumberId = value?.metadata?.phone_number_id;
    const message = value?.messages?.[0];

    if (!message || !phoneNumberId) {
      return NextResponse.json({ ok: true });
    }

    const organization = await prisma.organization.findFirst({
      where: { phoneNumberId },
    });

    if (!organization) {
      return NextResponse.json({ ok: true });
    }

    const fromPhone = message.from;
    const text = message.text?.body || '[mensaje no soportado]';

    let contact = await prisma.contact.findUnique({
      where: {
        organizationId_phone: {
          organizationId: organization.id,
          phone: fromPhone,
        },
      },
    });

    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          phone: fromPhone,
          organizationId: organization.id,
        },
      });
    }

    let conversation = await prisma.conversation.findFirst({
      where: {
        contactId: contact.id,
        status: { not: 'finished' },
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          organizationId: organization.id,
          contactId: contact.id,
          status: 'waiting',
        },
      });
    }

    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        direction: 'inbound',
        body: text,
        status: 'received',
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error procesando webhook:', error);
    return NextResponse.json({ ok: true }); // Meta espera 200 siempre
  }
}
