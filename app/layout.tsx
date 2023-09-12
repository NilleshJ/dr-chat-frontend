import localFont from '@next/font/local';
import "../styles/index.css";
import { Providers } from "./providers";

const poppins = localFont({
  src: [
    {
      path: '../public/fonts/Montserrat-Regular.ttf',
      weight: '400'
    },
    {
      path: '../public/fonts/Montserrat-Medium.ttf',
      weight: '500'
    },
    {
      path: '../public/fonts/Montserrat-Light.ttf',
      weight: '500'
    },
    {
      path: '../public/fonts/Montserrat-SemiBold.ttf',
      weight: '600'
    },
    {
      path: '../public/fonts/Montserrat-Bold.ttf',
      weight: '700'
    },
    {
      path: '../public/fonts/Montserrat-Thin.ttf',
      weight: '500'
    }
  ],
  variable: '--font-poppins'
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} font-sans`}>
      <body className="dark:bg-black">
        <Providers attribute="class" defaultTheme="system" enableSystem>
          {children}
        </Providers>
      </body>
    </html>
  );
}