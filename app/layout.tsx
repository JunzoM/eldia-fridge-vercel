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
      {/* アンチフラッシュ: レンダリング前にダーククラスをセット */}
      <head>
        <script dangerouslySetInnerHTML={{ __html:
          `(function(){var t=localStorage.getItem('eldia_theme');var d=!t&&window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||d)document.documentElement.classList.add('dark');})()`
        }} />
      </head>
      <body className="bg-cream dark:bg-[#111] font-sans text-[#1a1a1a] dark:text-gray-100 antialiased transition-colors">
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
