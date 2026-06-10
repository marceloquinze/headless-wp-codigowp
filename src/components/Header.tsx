import Link from "next/link";
import { getMenu, getSiteSettings } from "@/lib/wp";
import MobileMenu from "./MobileMenu";
import { MenuItem } from "@/types/wp";
import Image from "next/image";
import DesktopMenu from "./DesktopMenu";

export default async function Header() {
  const data = await getMenu("main-menu");
  const menuItems: MenuItem[] = data?.menu?.menuItems?.nodes || [];

  const { siteLogo } = await getSiteSettings();

  return (
    <header className="bg-white sticky top-0 z-50 py-3">
      <nav className="max-w-7xl mx-auto px-6 h-auto md:h-16 flex items-center justify-between flex-col md:flex-row gap-2">
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
              className="object-contain h-16 w-auto"
            />
          ) : (
            <span className="text-xl font-bold text-blue-900 font-sans">
              Código WP
            </span>
          )}
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:block">
          <DesktopMenu menuItems={menuItems} />
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden w-full">
          <MobileMenu menuItems={menuItems} />
        </div>
      </nav>
    </header>
  );
}
