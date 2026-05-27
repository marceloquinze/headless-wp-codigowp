"use client";

import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <div className="flex justify-between items-center mt-12 border-t pt-6">
      {/* Botão Anterior */}
      {currentPage > 1 ? (
        <Link
          href={prevPage === 1 ? "/blog" : `/blog/page/${prevPage}`}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-medium transition cursor-pointer"
        >
          Anteriores
        </Link>
      ) : (
        <div className="opacity-0 pointer-events-none" />
      )}

      <span className="text-sm text-gray-500 font-medium">
        Página {currentPage} de {totalPages}
      </span>

      {/* Botão Próximo */}
      {hasNextPage ? (
        <Link
          href={`/blog/page/${nextPage}`}
          className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition cursor-pointer"
        >
          Próximos Posts →
        </Link>
      ) : (
        <div className="opacity-0 pointer-events-none" />
      )}
    </div>
  );
}
