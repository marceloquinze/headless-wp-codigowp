import Pagination from "@/components/Pagination";
import VideosCard from "@/components/VideosCard";
import { getVideos } from "@/lib/wp";

export default async function TutoriaisEmVideo() {
  const currentPage = 1;
  const postsPerPage = 6;

  const { videos, total } = await getVideos(currentPage, postsPerPage);

  const totalPages = Math.ceil(total / postsPerPage);

  return (
    <main className="max-w-7xl mx-auto videos py-12 px-6">
      <div className="flex flex-col gap-2 mb-8 title">
        <h1 className="text-3xl text-center font-serif font-bold text-gray-950">
          Tutoriais em Video
        </h1>
        <p className="text-sm font-sans font-normal text-gray-400 text-center">
          Os vídeos-tutoriais mais úteis e interessantes sobre o universo
          WordPress voltados exclusivamente para desenvolvedores
        </p>
      </div>
      <VideosCard videos={videos} isHome={false} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        type="tutoriais-em-video"
      />
    </main>
  );
}
