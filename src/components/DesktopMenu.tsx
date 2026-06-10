import Link from "next/link";
import { MenuItem } from "@/types/wp";

export default async function DesktopMenu({
  menuItems,
}: {
  menuItems: MenuItem[];
}) {
  const buildMenu = (parentId: number | 0, level = 0) => {
    const currentLevelItems = menuItems.filter((mn) => {
      return mn.parentDatabaseId === parentId;
    });

    if (currentLevelItems.length === 0) return null;

    return (
      <ul
        className={`${
          level === 0
            ? "flex gap-3"
            : "absolute left-0 top-0 min-w-max bg-white shadow-lg rounded-md py-2"
        }`}
      >
        {currentLevelItems.map((item) => {
          const hasChildren = menuItems.some(
            (child) => child.parentDatabaseId === item.databaseId,
          );

          return (
            <li
              key={item.databaseId}
              className="relative group focus-within:bg-gray-50"
            >
              <Link
                href={item.uri}
                className={`flex items-center gap-2 py-2 px-3 text-gray-600 hover:text-blue-600 uppercase font-bold transition 
                  ${level > 0 ? "hover:bg-gray-50" : ""}`}
              >
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
              </Link>

              {hasChildren && (
                <div className="hidden group-hover:block focus-within:block absolute left-0 top-full">
                  <div className="bg-white shadow-lg rounded-md min-w-max py-2 mt-0">
                    {buildMenu(item.databaseId, level + 1)}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return <div>{buildMenu(0)}</div>;
}
