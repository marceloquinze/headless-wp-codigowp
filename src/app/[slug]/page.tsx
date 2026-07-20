import { getPageBySlug } from "@/lib/wp";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto py-12 px-6">
      <article className="prose prose-lg">
        <h1>{page.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: page.content }} />
      </article>
    </main>
  );
}
