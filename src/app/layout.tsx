import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { AuthInitializer } from '@/components/auth/AuthInitializer';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { ThemeHydrator } from '@/components/layout/ThemeHydrator';

export const metadata: Metadata = {
  title: 'FlexAgenda | Flexible Booking Solutions',
  description: 'Adjustable appointment and event reservation platform for any business.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen bg-background text-foreground transition-colors duration-500">
        <FirebaseClientProvider>
          <ThemeHydrator />
          <FirebaseErrorListener />
          <AuthInitializer />
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}