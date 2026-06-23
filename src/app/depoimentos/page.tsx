import Testimonials from "@/components/Home/Testimonials";
import { getDepoimentos, getSiteSettings } from "@/lib/wp";

export default async function Depoimentos() {
  const { depoimentos } = await getDepoimentos();
  const {
    tituloDepoimentos,
    subtituloDepoimentos,
    tituloBotaoDepoimentos,
    linkBotaoDepoimentos,
  } = await getSiteSettings();

  return (
    <main className="max-w-7xl mx-auto cursos py-16 px-6">
      <div className="flex flex-col gap-2 mb-8 title">
        <h1 className="text-3xl text-center font-serif font-bold text-gray-950">
          Depoimentos
        </h1>
      </div>
      <Testimonials
        depoimentos={depoimentos}
        tituloDepoimentos={tituloDepoimentos}
        subtituloDepoimentos={subtituloDepoimentos}
        tituloBotaoDepoimentos={tituloBotaoDepoimentos}
        linkBotaoDepoimentos={linkBotaoDepoimentos}
        isHome={false}
      />
    </main>
  );
}
