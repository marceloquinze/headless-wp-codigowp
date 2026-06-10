import Link from "next/link";

export default function TopBar() {
  return (
    <div className="top-bar bg-primary h-auto ">
      <div className="max-w-7xl mx-auto flex justify-start gap-3 text-white px-6 py-4">
        <span className="font-bold">Tire suas dúvidas</span>
        <Link
          href="mailto:cursos@codigowp.net"
          className="hover:underline font-bold text-primary-rgb2"
        >
          cursos@codigowp.net
        </Link>
      </div>
    </div>
  );
}
