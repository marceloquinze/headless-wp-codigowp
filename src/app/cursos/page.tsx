import CourseCard from "@/components/CourseCard";
import { getCursos } from "@/lib/wp";

export default async function Cursos() {
  const { cursos } = await getCursos();

  return (
    <main className="max-w-7xl mx-auto cursos py-16 px-6">
      <div className="flex flex-col gap-2 mb-8 title">
        <h1 className="text-3xl text-center font-serif font-bold text-gray-950">
          Conheça meus cursos WordPress
        </h1>
        <p className="text-sm font-sans font-normal text-gray-400 text-center">
          Veja como posso te ajudar a deslanchar sua carreira profissional
        </p>
      </div>
      <CourseCard cursos={cursos} />
    </main>
  );
}
