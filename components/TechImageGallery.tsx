"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

type GalleryImage = {
  url: string;
  alt: string;
};

const TechImageGallery = ({
  technologyImages,
  labImages,
  fallbackLabImage,
}: {
  technologyImages: GalleryImage[];
  labImages: GalleryImage[];
  fallbackLabImage: GalleryImage;
}) => {
  // Build the final list (no fallback when the other array has images)
  const tech = technologyImages.length > 0 ? technologyImages : [];
  const lab =
    labImages.length > 0
      ? labImages
      : technologyImages.length > 0
      ? []
      : [fallbackLabImage];

  const allImages = [...tech, ...lab];

  // ---- Carousel state & auto-scroll ----
  const carouselImages =
    allImages.length > 3 ? allImages.slice(1, -1) : [];
  const [carouselIndex, setCarouselIndex] = useState(0);

  const goToNext = useCallback(() => {
    if (carouselImages.length === 0) return;
    setCarouselIndex((i) => (i + 1) % carouselImages.length);
  }, [carouselImages.length]);

  // Auto-scroll every 3 seconds
  useEffect(() => {
    if (carouselImages.length < 2) return; // no need to scroll single image
    const timer = setInterval(goToNext, 3000);
    return () => clearInterval(timer);
  }, [goToNext, carouselImages.length]);

  if (allImages.length === 0) return null;

  const showCarousel = carouselImages.length > 0;
  const carouselCurrent = showCarousel ? carouselImages[carouselIndex] : null;

  return (
    <div className="tech-main">
      <div className="tech-image-grid">
        {/* Top – always the first image */}
        <div className="tech-slot tech-slot-top">
          <Image
            src={allImages[0].url}
            alt={allImages[0].alt}
            width={600}
            height={400}
            className="media-image"
          />
        </div>

        {/* Centre – carousel or the second image */}
        <div className="tech-slot tech-slot-center">
          {showCarousel ? (
            <div className="tech-carousel">
              <Image
                src={carouselCurrent?.url || ""}
                alt={carouselCurrent?.alt || ""}
                width={600}
                height={400}
                className="media-image"
              />
            </div>
          ) : allImages.length >= 2 ? (
            <Image
              src={allImages[1].url}
              alt={allImages[1].alt}
              width={600}
              height={400}
              className="media-image"
            />
          ) : null}
        </div>

        {/* Bottom – last image (only if at least 3) */}
        <div className="tech-slot tech-slot-bottom">
          {allImages.length >= 3 && (
            <Image
              src={allImages[allImages.length - 1].url}
              alt={allImages[allImages.length - 1].alt}
              width={600}
              height={400}
              className="media-image"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TechImageGallery;