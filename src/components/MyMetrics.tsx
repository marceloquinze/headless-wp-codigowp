interface MyMetricsProps {
  numAlunos: number;
  numPaises: number;
  numAvaliacoes: number;
  numDuvidas: number;
}
export default function MyMetrics({
  numAlunos,
  numPaises,
  numAvaliacoes,
  numDuvidas,
}: MyMetricsProps) {
  return (
    <section className="dados-site bg-primary2 text-white text-center">
      <div className="container grid grid-cols-none md:grid-cols-4 gap-12 md:gap-4">
        <div className="flex flex-col items-center gap-4">
          <span className="font-extrabold text-5xl text-quaternary">
            {numAlunos}
          </span>
          <span className="font-bold uppercase">Alunos Felizes</span>
        </div>
        <div className="flex flex-col items-center gap-4">
          <span className="font-extrabold text-5xl text-quaternary">
            {numPaises}
          </span>
          <span className="font-bold uppercase">Paises Alcançadoss</span>
        </div>
        <div className="flex flex-col items-center gap-4">
          <span className="font-extrabold text-5xl text-quaternary">
            {numAvaliacoes}
          </span>
          <span className="font-bold uppercase">Avaliações</span>
        </div>
        <div className="flex flex-col items-center gap-4">
          <span className="font-extrabold text-5xl text-quaternary">
            {numDuvidas}
          </span>
          <span className="font-bold uppercase">Dúvidas Respondidas</span>
        </div>
      </div>
    </section>
  );
}
