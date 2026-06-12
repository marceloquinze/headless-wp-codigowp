import Header from "@/components/Header";
import { montserrat, merriweather } from "./fonts";
import "./globals.css";
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";
import "@fortawesome/fontawesome-free/css/all.min.css";

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
        <TopBar />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
