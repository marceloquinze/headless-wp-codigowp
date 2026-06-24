import Pagination from "@/components/Pagination";
import { getVideos } from "@/lib/wp";
import { Metadata } from "next";
import VideosCard from "@/components/VideosCard";

interface VideoSubPageProps {
  params: Promise<{
    pageNumber: string;
  }>;
}

export async function generateMetadata({
  params,
}: VideoSubPageProps): Promise<Metadata> {
  const routeParams = await params;
  return {
    alternates: {
      canonical: `https://www.codigowp.net/tutoriais-em-video/page/${routeParams.pageNumber}`,
    },
  };
}

export default async function VideoSubPage({ params }: VideoSubPageProps) {
  const routeParams = await params;
  const currentPage = Number(routeParams.pageNumber) || 1;
  const postsPerPage = 6;
  const { videos, total } = await getVideos(currentPage, postsPerPage);
  const totalPages = Math.ceil(total / postsPerPage);

  return (
    <main className="max-w-7xl mx-auto blog py-12 px-6">
      <h1 className="text-4xl font-serif font-bold text-gray-900 mb-10 text-center">
        Tutoriais em vídeo - Página {currentPage}
      </h1>
      <VideosCard videos={videos} isHome={false} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        type="tutoriais-em-video"
      />
    </main>
  );
}
