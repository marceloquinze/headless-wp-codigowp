import { getPosts } from "@/lib/wp";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import HomeButton from "./HomeButton";

export default async function ListBlog() {
  const { posts } = await getPosts(1, 3);

  return (
    <section className="blog-home bg-black">
      <div className="container flex flex-col gap-8">
        <div className="cabecalho text-center">
          <h2 className="main-title text-white">Dicas e Tutoriais WordPress</h2>
          <p className="main-subtitle text-main-gray-400">
            Dicas valiosas para o seu aprendizado WordPress
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {posts.map((post) => {
            const fullDate = format(
              new Date(post.date),
              "dd 'de' MMMM 'de' yyyy",
              {
                locale: ptBR,
              },
            );
            return (
              <article className="post" key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  key={post.slug}
                  className="hover:no-underline blog-image"
                >
                  {post.featuredImage && (
                    <div className="relative w-full h-60 mb-4 overflow-hidden">
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
                        priority={true}
                        className="object-cover w-full"
                      />
                      <span className="flex items-center justify-center gap-3 author absolute bottom-0 left-0 w-full bg-primary-rgb text-white uppercase py-1 px-4 text-sm font-bold">
                        {post.authorName}
                        <span> | </span>
                        <span className="text-white!">{fullDate}</span>
                      </span>
                    </div>
                  )}
                </Link>
                <div className="post-content">
                  <Link href={`/blog/${post.slug}`} key={post.slug}>
                    <h3 className="text-white text-[16px]! text-center hover:text-quaternary transition ">
                      {post.title}
                    </h3>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
        <HomeButton link="/blog" label="Mais dicas" />
      </div>
    </section>
  );
}
