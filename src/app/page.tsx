import CourseCard from "@/components/CourseCard";
import AboutMe from "@/components/Home/AboutMe";
import Advantages from "@/components/Home/Advantages";
import MyMetrics from "@/components/Home/MyMetrics";
import Testimonials from "@/components/Home/Testimonials";
import { getCursos, getSiteSettings, getDepoimentos } from "@/lib/wp";

export default async function HomePage() {
  const coursedata = await getCursos();
  const {
    tituloCursos,
    subtituloCursos,
    numAlunos,
    numPaises,
    numAvaliacoes,
    numDuvidas,
    textoSobreMim,
    tituloBotaoSobreMim,
    linkBotaoSobreMim,
    imagemSobreMim,
    tituloVantagens,
    subtituloVantagens,
    vantagensList,
  } = await getSiteSettings();

  const { depoimentos } = await getDepoimentos();
  //console.log(depoimentos);

  return (
    <main className="homepage">
      <div className="flex flex-col gap-2 title">
        <h2 className="text-3xl text-center font-serif font-bold text-gray-950">
          {tituloCursos}
        </h2>
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
      <Testimonials depoimentos={depoimentos} />
      <AboutMe
        textoSobreMim={textoSobreMim}
        linkBotaoSobreMim={linkBotaoSobreMim}
        tituloBotaoSobreMim={tituloBotaoSobreMim}
        imagemSobreMim={imagemSobreMim}
      />
      <Advantages
        tituloVantagens={tituloVantagens}
        subtituloVantagens={subtituloVantagens}
        vantagensList={vantagensList}
      />
    </main>
  );
}
