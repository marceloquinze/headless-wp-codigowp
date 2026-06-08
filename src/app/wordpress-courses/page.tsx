import CourseCard from "@/components/CourseCard";
import { getCursos } from "@/lib/wp";

export default async function WordpressCourses() {
  const { cursos } = await getCursos();

  return (
    <main className="max-w-7xl mx-auto cursos py-16 px-6">
      <div className="flex flex-col gap-2 mb-8 title">
        <h1 className="text-3xl text-center font-serif font-bold text-gray-950">
          WordPress Courses
        </h1>
        <p className="text-sm font-sans font-normal text-gray-400 text-center">
          Get a huge discount on all of my courses below
        </p>
      </div>
      <CourseCard cursos={cursos} isNotSidebar />
    </main>
  );
}
