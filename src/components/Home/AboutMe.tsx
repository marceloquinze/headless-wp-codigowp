import parse from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import HomeButton from "./HomeButton";

interface AboutMeProps {
  textoSobreMim: string;
  tituloBotaoSobreMim: string;
  linkBotaoSobreMim: string;
  imagemSobreMim: string;
}
export default function AboutMe({
  textoSobreMim,
  tituloBotaoSobreMim,
  linkBotaoSobreMim,
  imagemSobreMim,
}: AboutMeProps) {
  // Only renders if there is text or an image
  if (!textoSobreMim && !imagemSobreMim) return null;

  return (
    <section
      className="relative about-me bg-cover bg-top bg-no-repeat"
      style={{ backgroundImage: `url(${imagemSobreMim})` }}
    >
      <div className="max-w-5xl mx-auto flex flex-col gap-8 justify-between py-16 px-6 relative z-10">
        <div className="text-base/8 font-sans font-normal text-center text-white">
          {parse(DOMPurify.sanitize(textoSobreMim))}
        </div>
        <HomeButton link={linkBotaoSobreMim} label={tituloBotaoSobreMim} />
      </div>
    </section>
  );
}
