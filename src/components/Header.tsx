import Link from "next/link";
import { getMenu } from "@/lib/wp";

export default async function Header() {
  const data = await getMenu("main-menu");
  const menuItems = data?.menu?.menuItems?.nodes || [];

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-2xl text-blue-600">
          CódigoWP
        </Link>

        <ul className="flex gap-6">
          {menuItems.map((item) => (
            <li key={item.uri}>
              <Link
                href={item.uri}
                className="text-gray-600 hover:text-blue-600 transition"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
