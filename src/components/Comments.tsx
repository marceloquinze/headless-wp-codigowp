"use client";

import parse from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import { CleanPost } from "@/types/wp";

interface CommentsProps {
  comments: CleanPost["comments"];
  onReplyClick: (commentId: number, authorName: string) => void;
}

export default function Comments({ comments, onReplyClick }: CommentsProps) {
  if (!comments || comments.length === 0) {
    return (
      <p className="text-gray-500 text-sm mt-8 border-t pt-6">
        Nenhum comentário ainda. Seja o primeiro a comentar!
      </p>
    );
  }

  // Função recursiva para gerar a árvore ramificada de respostas
  const renderCommentTree = (parentId: number | null, level = 0) => {
    const currentLevelComments = comments.filter((c) => {
      // Se estamos buscando a raiz (parentId === null), aceita null, undefined ou 0
      if (parentId === null) {
        return (
          c.parentDatabaseId === null ||
          c.parentDatabaseId === 0 ||
          !c.parentDatabaseId
        );
      }
      // Se estamos buscando uma resposta, compara os IDs normalmente
      return c.parentDatabaseId === parentId;
    });

    if (currentLevelComments.length === 0) return null;

    return (
      <ul
        className={`flex flex-col gap-6 ${level > 0 ? "ml-6 md:ml-10 border-l-2 border-gray-100 pl-4 mt-4" : "mt-6"}`}
      >
        {currentLevelComments.map((comment) => (
          <li
            key={comment.databaseId}
            className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs"
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900 text-sm">
                  {comment.author.node.name}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(comment.date).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>

              <button
                onClick={() =>
                  onReplyClick(comment.databaseId, comment.author.node.name)
                }
                className="text-xs font-medium text-lime-700 hover:text-lime-600 transition cursor-pointer bg-lime-50 hover:bg-lime-100 px-3 py-1 rounded-md"
              >
                Responder
              </button>
            </div>

            <div className="text-gray-700 text-sm prose max-w-none break-words leading-relaxed">
              {parse(DOMPurify.sanitize(comment.content))}
            </div>

            {/* Renderiza filhos deste comentário se houverem */}
            {renderCommentTree(comment.databaseId, level + 1)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="mt-12 border-t pt-8">
      <h3 className="text-2xl font-semibold text-gray-900">
        Comentários ({comments.length})
      </h3>
      {renderCommentTree(null)}
    </div>
  );
}
