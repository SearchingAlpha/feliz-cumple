// app/layout.js
import './globals.css';

export const metadata = {
  title: 'Retro Gaming Hub',
  description: 'A retro pixel art gaming hub with a girly twist',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Import pixel font from Google Fonts */}
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}