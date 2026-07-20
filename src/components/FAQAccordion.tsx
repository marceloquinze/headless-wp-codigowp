"use client";

import { useState, useMemo } from "react";
import parse from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";

interface FAQAccordionProps {
  content: string; // HTML bruto vindo do WordPress
}

interface FAQGroup {
  title: string;
  items: {
    question: string;
    answer: string;
  }[];
}

export default function FAQAccordion({ content }: FAQAccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // 🔍 Extrai grupos e perguntas/respostas do HTML
  const faqGroups = useMemo<FAQGroup[]>(() => {
    if (!content) return [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");

    const groups: FAQGroup[] = [];
    const groupElements = doc.querySelectorAll(".group");

    groupElements.forEach((group) => {
      const h2 = group.querySelector("h2");
      const title = h2?.textContent?.trim() || "Seção";

      const items: { question: string; answer: string }[] = [];
      const h3s = group.querySelectorAll("h3");

      h3s.forEach((h3) => {
        let answer = "";
        let next = h3.nextElementSibling;

        // Pega os parágrafos seguintes (respostas)
        while (next && next.tagName === "P") {
          answer += next.outerHTML;
          next = next.nextElementSibling;
        }

        if (answer) {
          items.push({
            question: h3.textContent?.trim() || "Pergunta sem título",
            answer: answer.trim(),
          });
        }
      });

      if (items.length > 0) {
        groups.push({ title, items });
      }
    });

    return groups;
  }, [content]);

  if (faqGroups.length === 0) {
    return <p className="text-gray-500">Nenhuma FAQ encontrada.</p>;
  }

  const getGlobalIndex = (groupIndex: number, itemIndex: number) => {
    let count = 0;
    for (let i = 0; i < groupIndex; i++) {
      count += faqGroups[i].items.length;
    }
    return count + itemIndex;
  };

  return (
    <div className="faq space-y-6">
      {faqGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="group space-y-2">
          <h2 className="text-lg! font-bold text-gray-900 mb-4 text-center uppercase pt-8">
            {group.title}
          </h2>

          {group.items.map((item, itemIndex) => {
            const globalIndex = getGlobalIndex(groupIndex, itemIndex);
            const isActive = activeIndex === globalIndex;

            return (
              <div
                key={itemIndex}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <h3
                  className={`cursor-pointer px-4 py-3 font-semibold text-gray-800 transition-colors hover:bg-gray-50 ${
                    isActive ? "bg-main-gray-200 text-blue-600" : ""
                  }`}
                  onClick={() => setActiveIndex(isActive ? -1 : globalIndex)}
                >
                  {item.question}
                </h3>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isActive ? "max-h-500 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-4 py-4 text-gray-600 prose prose-sm max-w-none">
                    {parse(
                      DOMPurify.sanitize(item.answer, {
                        ADD_TAGS: ["br", "a", "strong", "em", "ul", "li", "ol"],
                        ADD_ATTR: ["href", "target", "rel"],
                      }),
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
