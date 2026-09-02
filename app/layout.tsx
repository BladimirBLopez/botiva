import './globals.css';
import Providers from './providers';

export const metadata = {
  title: 'Botiva',
  description: 'CRM de WhatsApp con chatbot',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
