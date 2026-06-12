import parse from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";

interface AdvantagesProps {
  tituloVantagens: string;
  subtituloVantagens: string;
  vantagensList: string[];
}

export default function Advantages({
  tituloVantagens,
  subtituloVantagens,
  vantagensList,
}: AdvantagesProps) {
  return (
    <section className="vantagens">
      <div className="vantagens-wrapper py-4">
        <div className="container">
          <div className="cabecalho mb-5 text-center">
            <h2 className="main-title">{tituloVantagens}</h2>
            <p className="main-subtitle mb-3">{subtituloVantagens}</p>
          </div>

          <div className="vantagens-list flex flex-wrap flex-col md:flex-row justify-center gap-8">
            {vantagensList.map((vantagem) => (
              <div
                className="flex flex-col gap-3 group items-center w-full md:w-80 text-center"
                key={vantagem}
              >
                {parse(
                  DOMPurify.sanitize(vantagem, {
                    ADD_TAGS: ["i", "h3", "p", "span", "em", "br"],
                    ADD_ATTR: ["class"],
                  }),
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
