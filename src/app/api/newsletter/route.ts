import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Log de variables de entorno
    console.log('API Key:', process.env.MAILERLITE_API_KEY ? 'Presente' : 'Ausente');
    console.log('Group ID:', process.env.MAILERLITE_GROUP_ID ? 'Presente' : 'Ausente');

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' }, 
        { status: 400 }
      );
    }

    try {
      // Añadir suscriptor usando API directa de MailerLite
      console.log('Intentando suscribir:', email);
      const response = await fetch('https://api.mailerlite.com/api/v2/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-MailerLite-ApiKey': process.env.MAILERLITE_API_KEY!
        },
        body: JSON.stringify({
          email: email,
          groups: [process.env.MAILERLITE_GROUP_ID!]
        })
      });

      console.log('Respuesta de MailerLite:', response.status, response.statusText);

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Error body:', errorBody);
        throw new Error(`MailerLite error: ${errorBody}`);
      }

      const responseData = await response.json();
      console.log('Suscripción exitosa:', responseData);

      return NextResponse.json(
        { 
          message: 'Suscripción exitosa', 
          data: responseData 
        }, 
        { status: 200 }
      );

    } catch (mailerLiteError: unknown) {
      console.error('MailerLite Error:', mailerLiteError);

      return NextResponse.json(
        { 
          error: 'Error al suscribir', 
          details: mailerLiteError instanceof Error ? mailerLiteError.message : 'Unknown error'
        }, 
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    return NextResponse.json(
      { error: 'Suscripción fallida' }, 
      { status: 500 }
    );
  }
}
