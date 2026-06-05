import { CleanCurso } from "@/types/wp";
import Link from "next/link";
import Image from "next/image";

interface CoursesProp {
  cursos: CleanCurso[];
  isNotSidebar: boolean;
}

export default function CourseCard({ cursos, isNotSidebar }: CoursesProp) {
  return (
    <div
      className={`flex flex-wrap ${isNotSidebar ? "flex-col md:flex-row" : "flex-col"} justify-center gap-6`}
    >
      {cursos
        .filter((curso) => curso.status === "publish")
        .filter((curso) =>
          curso.categories.some((category) => category.slug === "portugues"),
        )
        .map((curso) => (
          <article
            key={curso.slug}
            className="flex-1 flex flex-col gap-1 group"
          >
            {curso.featuredImage && (
              <div className="relative w-full h-96 mb-4 overflow-hidden">
                <Image
                  src={curso.featuredImage}
                  alt={curso.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
                  priority={true}
                  className="object-cover"
                />
              </div>
            )}
            <Link
              href={curso.link}
              key={curso.slug}
              className="hover:no-underline"
            >
              <h4 className="text-center font-bold mb-2.5">{curso.title}</h4>
            </Link>
            <div className="course-meta flex flex-col items-center gap-1 py-2.5">
              {curso.regularPrice !== "0" ? (
                <div className="prices flex gap-3 items-center">
                  <div className="regular-price line-through text-gray-400">
                    R$ {curso.regularPrice}
                  </div>
                  <div className="sale-price text-primary font-bold text-xl">
                    R$ {curso.salesPrice}
                  </div>
                </div>
              ) : (
                <div className="prices flex gap-3 items-center">
                  <div className="sale-price text-primary font-bold text-xl">
                    GRATUITO
                  </div>
                </div>
              )}
              <div className="num-alunos text-gray-400 text-sm">
                <span>
                  {curso.regularPrice !== "0" && `${curso.numStudents} alunos`}
                </span>
              </div>
            </div>
          </article>
        ))}
    </div>
  );
}
