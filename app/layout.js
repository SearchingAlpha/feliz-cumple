// app/layout.js
import './globals.css';
import favicon from '@/public/favicon.svg'

export const metadata = {
  title: 'Feliz Cumple',
  description: 'Un portal de juegos retro con estilo pixelado femenino',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href='/favicon.svg' type="image/svg+xml" />
        {/* Import pixel font from Google Fonts */}
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}