import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import SiteLogo from "./SiteLogo";

export default function Header() {
  return (
    <header className="bg-white sticky top-0 z-50 py-3">
      <nav className="max-w-7xl mx-auto px-6 h-auto md:h-16 flex items-center justify-between flex-col md:flex-row gap-2">
        <SiteLogo />

        {/* Desktop Menu */}
        <div className="hidden md:block">
          <DesktopMenu />
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden w-full">
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}
