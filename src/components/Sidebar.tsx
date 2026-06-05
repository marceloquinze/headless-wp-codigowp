import CourseCard from "./CourseCard";
import { getCursos } from "@/lib/wp";

export default async function Sidebar() {
  const { cursos } = await getCursos();
  return (
    <>
      <CourseCard cursos={cursos} isNotSidebar={false} />
    </>
  );
}
