import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    await resend.emails.send({
      from: 'KuhmDev <contacto@kuhmdev.com>',
      to: ['tu_email_personal@ejemplo.com'],
      subject: `Nuevo mensaje de contacto: ${subject}`,
      html: `
        <h1>Nuevo mensaje de contacto</h1>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Asunto:</strong> ${subject}</p>
        <p><strong>Mensaje:</strong> ${message}</p>
      `,
    });

    return NextResponse.json({ message: 'Mensaje enviado exitosamente' }, { status: 200 });
  } catch (err) {
    console.error('Error al enviar el email:', err);
    return NextResponse.json({ error: 'Error al procesar el formulario' }, { status: 500 });
  }
}
