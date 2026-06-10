import Link from "next/link";
import Image from "next/image";
import { getMenu, getSiteSettings } from "@/lib/wp";
import { MenuItem } from "@/types/wp";
import { FaYoutube, FaLinkedin, FaInstagram, FaEnvelope } from "react-icons/fa";

export default async function Footer() {
  const data = await getMenu("privacy");
  const menuItems: MenuItem[] = data?.menu?.menuItems?.nodes || [];
  const { siteLogo } = await getSiteSettings();

  return (
    <footer className="bg-main-gray-700 text-main-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="first-part flex gap-2 md:gap-6 items-center text-sm">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-90 transition"
          >
            {siteLogo ? (
              <Image
                src={siteLogo.sourceUrl}
                alt={siteLogo.altText}
                width={siteLogo.mediaDetails.width}
                height={siteLogo.mediaDetails.height}
                priority={true}
                className="object-contain h-8 w-auto"
              />
            ) : (
              <span className="text-xl font-bold text-blue-900 font-sans">
                Código WP
              </span>
            )}
          </Link>
          <Link href="https://www.youtube.com/c/MarceloXavierVieira">
            <FaYoutube />
          </Link>
          <Link href="https://www.linkedin.com/in/marceloxvieira/">
            <FaLinkedin />
          </Link>
          <Link href="https://www.instagram.com/wpparadevs/">
            <FaInstagram />
          </Link>
          <Link
            href="mailto:cursos@codigowp.net"
            className="hover:underline flex gap-2 items-center"
          >
            <FaEnvelope /> cursos@codigowp.net
          </Link>
        </div>
        <div className="last-part text-sm">
          <ul className="footer-menu flex gap-2">
            {menuItems.map((mn) => (
              <li key={mn.databaseId}>
                <Link href={mn.uri}>{mn.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
