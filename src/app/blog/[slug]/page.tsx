import { getPostBySlug, createComment } from "@/lib/wp";
import BlogCommentSection from "@/components/BlogCommentSection";
import DateBox from "@/components/DateBox";
import PostMetaInfo from "@/components/PostMetaInfo";
import Image from "next/image";
import parse from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import { notFound } from "next/navigation";
import Sidebar from "@/components/Sidebar";

// using App Router, Next passes URL params as a Promise
interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PostPage({ params }: PostPageProps) {
  // this is how we get the URL params, especially the slug
  // this comes from 'params'
  const { slug } = await params;
  // now, slug is used to get the post data from GraphQL
  const post = await getPostBySlug(slug);
  // console.log(post);

  if (!post) {
    notFound();
  }

  // Server action for comments
  const handleCommentSubmit = async (formData: {
    name: string;
    email: string;
    content: string;
    parentId?: number;
  }) => {
    "use server";
    // calls createComment from wp.ts
    return await createComment({
      commentOn: post.databaseId,
      parent: formData.parentId,
      content: formData.content,
      authorName: formData.name,
      authorEmail: formData.email,
    });
  };

  return (
    <main className="max-w-7xl mx-auto py-12 px-6">
      <div className="flex flex-wrap md:flex-nowrap gap-8">
        <div className="md:w-3/4 flex flex-col gap-16">
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
        <div className="w-full md:w-1/4">
          <Sidebar />
        </div>
      </div>
    </main>
  );
}
