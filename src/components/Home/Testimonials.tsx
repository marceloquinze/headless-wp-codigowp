import parse from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import { CleanDepoimento } from "@/types/wp";
import Image from "next/image";
import HomeButton from "./HomeButton";

interface TestimonialsProps {
  depoimentos: CleanDepoimento[];
  tituloBotaoDepoimentos: string;
  linkBotaoDepoimentos: string;
  tituloDepoimentos: string;
  subtituloDepoimentos: string;
}

export default function Testimonials({
  depoimentos,
  tituloBotaoDepoimentos,
  linkBotaoDepoimentos,
  tituloDepoimentos,
  subtituloDepoimentos,
}: TestimonialsProps) {
  console.log(depoimentos);

  return (
    <section className="testimonials">
      <div className="vantagens-wrapper py-4">
        <div className="container flex flex-col gap-8">
          <div className="cabecalho mb-5 text-center">
            <h2 className="main-title">{tituloDepoimentos}</h2>
            <p className="main-subtitle mb-3">{subtituloDepoimentos}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
            {depoimentos.map((depoimento) => {
              const isFeatured = depoimento.isFeatured === "1";
              return (
                <div
                  className={`depoimentos ${isFeatured ? "order-first md:col-span-2 w-full" : ""}`}
                  key={depoimento.slug}
                >
                  <h3
                    className={`main-title uppercase mb-5 ${!isFeatured ? "text-sm! " : ""}`}
                  >
                    {depoimento.title}
                  </h3>
                  <div
                    className={`w-full flex gap-8 ${!isFeatured ? "items-start bg-quaternary2 p-10" : ""}`}
                  >
                    <div className="shrink-0 w-20 h-20 md:w-24 md:h-24 relative rounded-full overflow-hidden">
                      {depoimento.featuredImage && (
                        <Image
                          src={depoimento.featuredImage}
                          alt={depoimento.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
                          className="object-cover rounded-full"
                        />
                      )}
                    </div>
                    <div className="content flex-1">
                      {parse(
                        DOMPurify.sanitize(depoimento.content, {
                          ADD_TAGS: ["i", "h3", "p", "span", "em", "br"],
                          ADD_ATTR: ["class"],
                        }),
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <HomeButton
            link={linkBotaoDepoimentos}
            label={tituloBotaoDepoimentos}
          />
        </div>
      </div>
    </section>
  );
}
