import CourseCard from "@/components/CourseCard";
import MyMetrics from "@/components/MyMetrics";
import { getCursos, getSiteSettings } from "@/lib/wp";

export default async function HomePage() {
  const coursedata = await getCursos();
  const {
    tituloCursos,
    subtituloCursos,
    numAlunos,
    numPaises,
    numAvaliacoes,
    numDuvidas,
  } = await getSiteSettings();

  return (
    <main className="homepage">
      <div className="flex flex-col gap-2 mb-8 title">
        <h1 className="text-3xl text-center font-serif font-bold text-gray-950">
          {tituloCursos}
        </h1>
        <p className="text-sm font-sans font-normal text-gray-400 text-center">
          {subtituloCursos}
        </p>
      </div>
      <CourseCard cursos={coursedata.cursos} isNotSidebar />
      <MyMetrics
        numAlunos={numAlunos}
        numPaises={numPaises}
        numAvaliacoes={numAvaliacoes}
        numDuvidas={numDuvidas}
      />
    </main>
  );
}
