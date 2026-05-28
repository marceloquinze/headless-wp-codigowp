"use client";

import { useState } from "react";
import Comments from "./Comments";
import CommentForm from "./CommentForm";
import { CleanPost } from "@/types/wp";

interface BlogCommentSectionProps {
  postId: number;
  commentStatus: "open" | "closed";
  comments: CleanPost["comments"];
  submitAction: any;
}

export default function BlogCommentSection({
  postId,
  commentStatus,
  comments,
  submitAction,
}: BlogCommentSectionProps) {
  const [replyTarget, setReplyTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const handleReplySetup = (id: number, name: string) => {
    setReplyTarget({ id, name });
    // Dá scroll suave automático até o formulário de resposta
    document
      .getElementById("comment-form-anchor")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Comments comments={comments} onReplyClick={handleReplySetup} />

      <div id="comment-form-anchor">
        {commentStatus === "open" ? (
          <CommentForm
            postId={postId}
            replyTarget={replyTarget}
            onCancelReply={() => setReplyTarget(null)}
            onSubmitComment={submitAction}
          />
        ) : (
          <p className="text-gray-400 text-sm text-center mt-12 border-t pt-4">
            A seção de comentários deste artigo foi fechada.
          </p>
        )}
      </div>
    </>
  );
}
