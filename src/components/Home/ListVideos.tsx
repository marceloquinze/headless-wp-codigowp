import HomeButton from "./HomeButton";
import VideosCard from "../VideosCard";
import { getVideos } from "@/lib/wp";

export default async function ListVideos() {
  const { videos } = await getVideos(1, 3);

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
        <VideosCard videos={videos} isHome={true} />
        <HomeButton link="/tutoriais-em-video" label="Mais vídeos" />
      </div>
    </section>
  );
}
