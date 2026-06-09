"use client";

import { CleanCurso } from "@/types/wp";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface CoursesProp {
  cursos: CleanCurso[];
  isNotSidebar: boolean;
}

export default function CourseCard({ cursos, isNotSidebar }: CoursesProp) {
  const pathname = usePathname();
  const slug = pathname.split("/").pop();
  // generate coupon link
  const year = new Date().getFullYear();
  const simpleYear = year.toString().slice(-2);
  const month = new Date()
    .toLocaleString("pt-BR", { month: "short" })
    .replace(".", "")
    .toUpperCase();

  return (
    <div
      className={`flex flex-wrap ${
        isNotSidebar ? "flex-col md:flex-row" : "flex-col"
      } justify-center gap-8`}
    >
      {cursos
        .filter((curso) => curso.status === "publish")
        .filter((curso) => {
          if (slug === "wordpress-courses") {
            return curso.categories.some(
              (category) => category.slug !== "portugues",
            );
          } else {
            return curso.categories.some(
              (category) => category.slug === "portugues",
            );
          }
        })
        .map((curso) => (
          <article
            key={curso.slug}
            className={`flex flex-col gap-1 group items-center ${
              isNotSidebar ? "w-full md:w-80" : "w-full"
            }`}
          >
            {curso.featuredImage && (
              <div
                className={`relative mb-4 overflow-hidden rounded-lg ${
                  isNotSidebar ? "w-full md:w-80 h-48" : "w-full h-auto"
                }`}
              >
                <Image
                  src={curso.featuredImage}
                  alt={curso.title}
                  sizes={
                    isNotSidebar ? "(max-width: 768px) 100vw, 320px" : "200px"
                  }
                  fill={isNotSidebar ? true : false}
                  width={!isNotSidebar ? 400 : undefined}
                  height={!isNotSidebar ? 300 : undefined}
                  // sidebar: fill = false, width 400, height 300
                  // not sidebar: fill = true, width undefined, height undefined
                  priority={true}
                  className="object-cover w-full"
                />
              </div>
            )}
            <Link
              href={`${slug === "wordpress-courses" ? curso.link + month + "-" + simpleYear : curso.link}`}
              target="_blank"
              className="hover:no-underline w-full text-center"
            >
              <h4 className="text-center font-bold mb-2.5 line-clamp-2">
                {curso.title}
              </h4>
            </Link>
            <div className="course-meta flex flex-col items-center gap-1 py-2.5 w-full">
              {curso.regularPrice !== "0" ? (
                <div className="prices flex flex-col sm:flex-row gap-3 items-center">
                  <div className="regular-price line-through text-gray-400 text-sm">
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
              {curso.regularPrice !== "0" && (
                <div className="num-alunos text-gray-400 text-sm">
                  <span>{curso.numStudents} alunos</span>
                </div>
              )}
            </div>
          </article>
        ))}
    </div>
  );
}
