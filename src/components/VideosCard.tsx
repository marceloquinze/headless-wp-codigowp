import { CleanVideo } from "@/types/wp";
import parse from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import Link from "next/link";

interface VideosCardProps {
  videos: CleanVideo[];
  isHome: boolean;
}

export default function VideosCard({ videos, isHome }: VideosCardProps) {
  console.log(isHome);

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {videos.map((video) => (
        <article className="post flex flex-col gap-4" key={video.slug}>
          <div className="video-wrapper w-full aspect-video relative">
            {video.content && (
              <div className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:absolute [&>iframe]:inset-0">
                {parse(
                  DOMPurify.sanitize(video.content, {
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
              <h3
                className={`${isHome ? "text-white" : "text-gray-950"} text-[16px]! text-center hover:text-quaternary transition`}
              >
                {video.title}
              </h3>
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
