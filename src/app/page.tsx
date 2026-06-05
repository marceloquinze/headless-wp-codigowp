import { getCursos } from "@/lib/wp";

export default async function HomePage() {
  const data = await getCursos();
  const cursos = data.cursos.nodes;

  return (
    <main className="p-10 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Meus Cursos Headless</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cursos.map((curso) => (
          <div
            key={curso.slug}
            className="border p-6 rounded-lg shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-xl font-bold mb-2">{curso.title}</h2>
            <p className="text-gray-600 mb-4">
              Duração: {curso.codigowpCourseDuration}
            </p>

            <div className="flex justify-between items-center">
              <span className="text-green-600 font-bold">
                {curso.codigowpSalePrice}
              </span>
              <a
                href={curso.codigowpCourseLink}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
              >
                Ver curso
              </a>
            </div>

            {curso.codigowpIsUdemy && (
              <span className="mt-4 block text-xs text-orange-500 uppercase font-semibold">
                Disponível na Udemy
              </span>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
