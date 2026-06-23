import { getVideos } from "@/lib/wp";
import Link from "next/link";
import parse from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import HomeButton from "./HomeButton";

export default async function ListVideos() {
  const { videos } = await getVideos();

  return (
    <section className="blog-home bg-main-gray-500">
      <div className="container flex flex-col gap-8">
        <div className="cabecalho mb-5 text-center">
          <h2 className="main-title text-white">Tutoriais em Vídeo</h2>
          <p className="main-subtitle text-main-gray-400">
            Os vídeos-tutoriais mais úteis e interessantes sobre o universo
            WordPress voltados exclusivamente para desenvolvedores
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {videos.map((video) => (
            <article className="post flex flex-col gap-4" key={video.slug}>
              <div className="video-wrapper w-full aspect-video relative">
                {video.content && (
                  <div className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:absolute [&>iframe]:inset-0">
                    {parse(
                      DOMPurify.sanitize(video.content, {
                        ADD_TAGS: [
                          "iframe",
                          "video",
                          "audio",
                          "source",
                          "embed",
                        ],

                        ADD_ATTR: [
                          "allow",
                          "allowfullscreen",
                          "frameborder",
                          "scrolling",
                          "src",
                          "controls",
                          "autoplay",
                          "loop",
                          "width",
                          "height",
                        ],
                      }),
                    )}
                  </div>
                )}
              </div>
              <div className="video-content">
                <Link href={`/videos/${video.slug}`} key={video.slug}>
                  <h3 className="text-white text-[16px]! text-center hover:text-quaternary transition ">
                    {video.title}
                  </h3>
                </Link>
              </div>
            </article>
          ))}
        </div>
        <HomeButton link="/tutoriais-em-video" label="Mais vídeos" />
      </div>
    </section>
  );
}
