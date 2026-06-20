"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const attachObservers = () => {
      const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)"));

      if (!elements.length) {
        return undefined;
      }

      if (!("IntersectionObserver" in window)) {
        for (const element of elements) {
          element.classList.add("is-visible");
        }
        return undefined;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
      );

      for (const element of elements) {
        observer.observe(element);
      }

      return observer;
    };

    let observer = attachObservers();

    const mutationObserver = new MutationObserver(() => {
      observer?.disconnect();
      observer = attachObservers();
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer?.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname]);

  return null;
}