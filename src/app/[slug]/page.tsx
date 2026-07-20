import { getPageBySlug } from "@/lib/wp";
import { notFound } from "next/navigation";
import parse from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import FAQAccordion from "@/components/FAQAccordion";
import Cursos from "../cursos/page";

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  switch (page.slug) {
    case "perguntas-frequentes-faq":
      return (
        <main className="max-w-7xl mx-auto py-12 px-6">
          <div className="flex flex-col gap-2 mb-8 title">
            <h1 className="text-3xl text-center font-serif font-bold text-gray-950">
              Perguntas Frequentes (FAQ)
            </h1>
            <p className="text-sm font-sans font-normal text-gray-400 text-center">
              Confira algumas das dúvidas mais comuns sobre o curso logo abaixo.
            </p>
          </div>
          <FAQAccordion content={page.content} />
          <Cursos />
        </main>
      );
  }

  return (
    <main className="max-w-7xl mx-auto py-12 px-6">
      <article className="prose prose-lg">
        <h1>{page.title}</h1>
        {parse(DOMPurify.sanitize(page.content))}
      </article>
    </main>
  );
}
