"use client";

import { useState } from "react";
import { ChevronDownIcon } from "../components/icons"

type FaqItem = {
  question: string;
  answer: string;
};

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <div className="faq-list" data-reveal>
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <article key={item.question} className="faq-item" data-open={open ? "true" : "false"}>
            <button
              type="button"
              className="faq-trigger"
              aria-expanded={open}
              onClick={() => setOpenIndex((prev) => (prev === index ? -1 : index))}
            >
              <span>{item.question}</span>
              <ChevronDownIcon />
            </button>
            <div className="faq-panel">
              <p>{item.answer}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}