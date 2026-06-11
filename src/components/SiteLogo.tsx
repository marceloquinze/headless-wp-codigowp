import { getSiteSettings } from "@/lib/wp";
import Image from "next/image";
import Link from "next/link";

export default async function SiteLogo() {
  const { siteLogo } = await getSiteSettings();

  return (
    <Link
      href="/"
      className="flex items-center gap-2 hover:opacity-90 transition"
    >
      {siteLogo ? (
        <Image
          src={siteLogo.sourceUrl}
          alt={siteLogo.altText}
          width={siteLogo.mediaDetails.width}
          height={siteLogo.mediaDetails.height}
          priority={true}
          className="object-contain h-16 w-auto"
        />
      ) : (
        <span className="text-xl font-bold text-blue-900 font-sans">
          Código WP
        </span>
      )}
    </Link>
  );
}
