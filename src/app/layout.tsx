import Header from "@/components/Header";
import { montserrat, merriweather } from "./fonts";
import "./globals.css";
import Link from "next/link";

// children: our pages (page.tsx)
// children: React.ReactNode => children can be everything React can render
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-br"
      className={`${montserrat.variable} ${merriweather.variable}`}
    >
      <body>
        <div className="top-bar bg-primary h-auto ">
          <div className="max-w-7xl mx-auto flex justify-start gap-3 text-white px-6 py-4">
            <span className="font-bold">Tire suas dúvidas</span>
            <Link
              href="mailto:cursos@codigowp.net"
              className="hover:underline font-bold text-primary-rgb2"
            >
              cursos@codigowp.net
            </Link>
          </div>
        </div>
        <Header />
        {children}
      </body>
    </html>
  );
}
