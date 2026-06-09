import Link from "next/link";
import { MenuItem } from "@/types/wp";

export default function MobileMenu({ menuItems }: { menuItems: MenuItem[] }) {
  const buildMenu = (
    menuItems: MenuItem[],
    parentId: number = 0,
    level: number = 0,
  ) => {
    const currentLevelItems = menuItems.filter((mn) => {
      return mn.parentDatabaseId === parentId;
    });

    if (currentLevelItems.length === 0) return null;

    return (
      <ul className="space-y-1">
        {currentLevelItems.map((item) => {
          const hasChildren = menuItems.some(
            (child) => child.parentDatabaseId === item.databaseId,
          );

          return (
            <li key={item.databaseId}>
              {hasChildren ? (
                <details>
                  <summary className="flex gap-2 items-center justify-between cursor-pointer list-none px-4 py-2 text-gray-600 hover:bg-gray-50">
                    {item.label}
                    {hasChildren && (
                      <svg
                        className="w-4 h-4 mt-0.5 group-hover:rotate-180 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </summary>
                  <div className="pl-4">
                    {buildMenu(menuItems, item.databaseId, level + 1)}
                  </div>
                </details>
              ) : (
                <Link
                  href={item.uri}
                  className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <details className="relative">
      <summary className="cursor-pointer list-none p-2 flex justify-center">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </summary>
      <div className="absolute right-0 mt-2 w-full bg-white shadow-lg rounded-md py-2 z-50">
        {buildMenu(menuItems)}
      </div>
    </details>
  );
}
