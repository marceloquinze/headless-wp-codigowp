import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DateBoxProps {
  dateString: string;
  isSimple?: boolean;
}

export default function DateBox({ dateString, isSimple }: DateBoxProps) {
  const fullDate = format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });
  const day = format(new Date(dateString), "dd");
  const month = format(new Date(dateString), "MMMM", { locale: ptBR });

  return isSimple ? (
    <div className="simple-date">
      <span>{fullDate}</span>
    </div>
  ) : (
    <div className="full-date">
      <span className="text-7xl font-bold leading-none mb-3">{day}</span>
      <span className="text-sm leading-none">{month.toLocaleUpperCase()}</span>
    </div>
  );
}
