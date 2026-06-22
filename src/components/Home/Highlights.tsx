import parse from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import HomeButton from "./HomeButton";
import Image from "next/image";

interface ImageData {
  alt: string;
  height: number;
  width: number;
  url: string;
}

interface HighlightsProps {
  textoDestaque: string;
  tituloBotaoDestaque: string;
  linkBotaoDestaque: string;
  imagemDestaque: ImageData | null;
  imagemDestaqueFundo: string;
}
export default function Highlights({
  textoDestaque,
  tituloBotaoDestaque,
  linkBotaoDestaque,
  imagemDestaque,
  imagemDestaqueFundo,
}: HighlightsProps) {
  // Only renders if there is text or an image
  if (!textoDestaque && !imagemDestaque) return null;

  return (
    <section
      className="relative highlights bg-cover bg-top bg-no-repeat"
      style={
        imagemDestaqueFundo
          ? { backgroundImage: `url(${imagemDestaqueFundo})` }
          : {}
      }
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 justify-between md:items-center py-16 px-6 relative z-10">
        {imagemDestaque && (
          <div className="w-full md:w-1/2 shrink-0">
            <Image
              src={imagemDestaque.url}
              alt={imagemDestaque.alt || "Imagem destaque"}
              width={imagemDestaque.width}
              height={imagemDestaque.height}
              priority
              className="object-contain w-full h-auto"
            />
          </div>
        )}
        <div
          className={`flex flex-col gap-6 text-center ${imagemDestaque ? "md:w-1/2" : "w-full"}`}
        >
          {textoDestaque && (
            <div className="text-base/8 font-sans font-normal text-white content">
              {parse(
                DOMPurify.sanitize(textoDestaque, {
                  ADD_TAGS: [
                    "i",
                    "strong",
                    "em",
                    "br",
                    "span",
                    "p",
                    "h1",
                    "h2",
                    "h3",
                    "h4",
                    "a",
                  ],
                  ADD_ATTR: ["class"],
                }),
              )}
            </div>
          )}

          {tituloBotaoDestaque && linkBotaoDestaque && (
            <div className="flex justify-center">
              <HomeButton
                link={linkBotaoDestaque}
                label={tituloBotaoDestaque}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
