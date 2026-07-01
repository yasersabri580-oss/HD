"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useMemo } from "react";
import { TestimonialCard } from "./testimonial-card";

type Testimonial = {
  name: string;
  role: string;
  quote: string;
  rating: number;
};

type Props = {
  testimonials: Testimonial[];
  direction?: "ltr" | "rtl";
};

export function Testimonials({
  testimonials,
  direction = "ltr",
}: Props) {
  const autoplay = useMemo(
    () =>
      Autoplay({
        delay: 5000,
        stopOnInteraction: true,
        stopOnMouseEnter: true,
      }),
    []
  );

  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      direction, // <-- RTL FIX
    },
    [autoplay]
  );

  return (
    <div className="embla" dir={direction}>
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {testimonials.map((item, index) => (
            <div
              className="embla__slide"
              key={`${item.name}-${index}`}
            >
              <TestimonialCard {...item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}