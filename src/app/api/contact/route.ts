import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    const body = await req.json();
    const { name, email, subject, message } = body;

    const { error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [process.env.CONTACT_FORM_EMAIL || process.env.CONTACT_SENDER_EMAIL || 'contacto@website.com'],
      subject: `Nuevo mensaje de contacto: ${subject}`,
      html: `
        <h1>Nuevo mensaje de contacto</h1>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email del remitente:</strong> ${email}</p>
        <p><strong>Asunto:</strong> ${subject}</p>
        <p><strong>Mensaje:</strong> ${message}</p>
      `,
      reply_to: email,
    });

    if (error) {
      console.error('Error al enviar el email:', error);
      return NextResponse.json({ error: 'Error al enviar el email' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Mensaje enviado exitosamente' }, { status: 200 });
  } catch (err) {
    console.error('Error al procesar el formulario:', err);
    return NextResponse.json({ error: 'Error al procesar el formulario' }, { status: 500 });
  }
}
