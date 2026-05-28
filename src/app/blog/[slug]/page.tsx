import { getPostBySlug, createComment } from "@/lib/wp";
import BlogCommentSection from "@/components/BlogCommentSection";
import DateBox from "@/components/DateBox";
import PostMetaInfo from "@/components/PostMetaInfo";
import Image from "next/image";
import parse from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import { notFound } from "next/navigation";

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  console.log(post);

  if (!post) {
    notFound();
  }

  const handleCommentSubmit = async (formData: {
    name: string;
    email: string;
    content: string;
    parentId?: number;
  }) => {
    "use server";
    return await createComment({
      commentOn: post.databaseId,
      parent: formData.parentId,
      content: formData.content,
      authorName: formData.name,
      authorEmail: formData.email,
    });
  };

  return (
    <main className="max-w-6xl mx-auto py-12 px-6">
      <div className="flex gap-8">
        <div className="w-3/4 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold text-gray-950 leading-tight">
              {post.title}
            </h1>
            <DateBox dateString={post.date} isSimple={true} />
          </div>
          <PostMetaInfo
            authorName={post.authorName}
            categories={post.categories}
            commentCount={post.commentCount}
          />
          {post.featuredImage && (
            <div className="relative block h-96 md:h-[400px] mb-8 overflow-hidden rounded-xl">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                className="object-cover"
              />
            </div>
          )}
          <div className="wp-content-render">
            {parse(
              DOMPurify.sanitize(post.content, {
                ADD_TAGS: ["iframe", "video", "audio", "source", "embed"],

                ADD_ATTR: [
                  "allow",
                  "allowfullscreen",
                  "frameborder",
                  "scrolling",
                  "src",
                  "controls",
                  "autoplay",
                  "loop",
                ],
              }),
            )}
          </div>
          <BlogCommentSection
            postId={post.databaseId}
            comments={post.comments}
            commentStatus={post.commentStatus}
            submitAction={handleCommentSubmit}
          />
        </div>
        <div className="w-1/4">Sidebar</div>
      </div>
    </main>
  );
}
