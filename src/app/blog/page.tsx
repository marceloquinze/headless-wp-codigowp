import Image from "next/image";
import parse from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import Link from "next/link";

import DateBox from "@/components/DateBox";
import PostMetaInfo from "@/components/PostMetaInfo";
import Pagination from "@/components/Pagination";
import { getPosts } from "@/lib/wp";
import { Metadata } from "next";

// SEO
export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.codigowp.net/blog",
  },
};

export default async function Blog() {
  const currentPage = 1; // Página inicial fixa
  const postsPerPage = 6;

  const { posts, total } = await getPosts(currentPage, postsPerPage);

  const totalPages = Math.ceil(total / postsPerPage);

  return (
    <main className="max-w-7xl mx-auto blog py-12 px-6">
      <h1 className="text-4xl font-serif font-bold text-gray-900 mb-10">
        Blog
      </h1>
      <div className="flex gap-8">
        <div className="w-3/4 flex flex-col gap-16">
          {posts.map((post) => (
            <article key={post.slug} className="flex flex-col gap-8 group">
              <Link
                href={`/blog/${post.slug}`}
                key={post.slug}
                className="hover:no-underline"
              >
                {post.featuredImage && (
                  <div className="relative w-full h-96 mb-4 overflow-hidden rounded-xl">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
                      priority={true}
                      className="object-cover"
                    />
                  </div>
                )}
              </Link>
              <div className="meta-data flex gap-16 items-center">
                <DateBox dateString={post.date} />
                <Link
                  href={`/blog/${post.slug}`}
                  key={post.slug}
                  className="hover:no-underline"
                >
                  <h2 className="transition delay-150 duration-300 ease-in-out font-semibold text-3xl hover:text-lime-600">
                    {post.title}
                  </h2>
                </Link>
              </div>
              <PostMetaInfo
                authorName={post.authorName}
                categories={post.categories}
                commentCount={post.commentCount}
              />
              <div className="excerpt text-gray-700 transition delay-150 duration-300 ease-in-out line-clamp-2 text-md leading-relaxed">
                {parse(DOMPurify.sanitize(post.excerpt))}
              </div>
            </article>
          ))}
        </div>
        <div className="w-1/4">Sidebar</div>
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </main>
  );
}
