import CourseCard from "./CourseCard";
import { getCursos } from "@/lib/wp";

export default async function Sidebar() {
  const { cursos } = await getCursos();
  return (
    <>
      <h3 className="sidebar-title uppercase text-sm pl-4 border-l-4 border-l-quaternary mb-3 leading-none">
        Cursos Recentes
      </h3>
      <CourseCard cursos={cursos} isNotSidebar={false} />
    </>
  );
}
