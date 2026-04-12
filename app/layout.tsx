import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ELDIA Fridge',
  description: 'HOTEL ELDIA 神戸 冷蔵庫棚卸管理',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ELDIA Fridge',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#2c2c2c',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-cream font-sans text-[#1a1a1a] antialiased">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `if("serviceWorker"in navigator){navigator.serviceWorker.register("/sw.js").catch(()=>{});}`,
          }}
        />
      </body>
    </html>
  );
}
