"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CommentFormProps {
  postId: number;
  replyTarget: { id: number; name: string } | null;
  onCancelReply: () => void;
  // Passamos a mutation como prop ou chamamos via fetch para manter o isolamento de ambientes
  onSubmitComment: (formData: {
    name: string;
    email: string;
    content: string;
    parentId?: number;
  }) => Promise<{ success: boolean; message: string }>;
}

export default function CommentForm({
  postId,
  replyTarget,
  onCancelReply,
  onSubmitComment,
}: CommentFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "loading", message: "" });

    const result = await onSubmitComment({
      name,
      email,
      content,
      parentId: replyTarget?.id || undefined,
    });

    if (result.success) {
      setStatus({ type: "success", message: result.message });
      setContent(""); // Limpa apenas o campo de texto
      onCancelReply(); // Reseta o alvo de resposta
      router.refresh(); // Atualiza os Server Components do Next.js trazendo os dados novos do banco
    } else {
      setStatus({ type: "error", message: result.message });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-12 bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col gap-4"
    >
      <div>
        <h3 className="text-xl font-semibold text-gray-900">
          Deixe um comentário
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          Seu endereço de e-mail não será publicado.
        </p>
      </div>

      {/* Alerta Visual de que o usuário está respondendo a alguém */}
      {replyTarget && (
        <div className="flex justify-between items-center bg-lime-50 border border-lime-200 px-4 py-2 rounded-xl text-sm text-lime-800">
          <span>
            Respondendo ao comentário de <strong>{replyTarget.name}</strong>
          </span>
          <button
            type="button"
            onClick={onCancelReply}
            className="text-xs font-bold text-lime-900 hover:underline cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Seu nome *"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-white border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-lime-600 transition"
        />
        <input
          type="email"
          placeholder="Seu e-mail *"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-lime-600 transition"
        />
      </div>

      <textarea
        placeholder="Escreva seu comentário... *"
        rows={5}
        required
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="bg-white border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-lime-600 transition resize-y"
      />

      <button
        type="submit"
        disabled={status.type === "loading"}
        className="self-start px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50 cursor-pointer"
      >
        {status.type === "loading" ? "Enviando..." : "Enviar Comentário"}
      </button>

      {status.message && (
        <p
          className={`text-sm font-medium mt-2 ${status.type === "success" ? "text-emerald-600" : "text-rose-600"}`}
        >
          {status.message}
        </p>
      )}
    </form>
  );
}
