"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

const SLIDES = [
  {
    id: 1,
     badge: "Empowering Women, ",
    title: "Transforming Communities",
    description:
      "Akhandjyoti Foundation empowers women and youth through skill development, vocational training, and entrepreneurship support to create sustainable livelihoods and economic independence.",
    heroBg: "/images/women-hero-section-image.png",
  },
  {
    id: 2,
    badge: "Building Skills,",
    title: "Transforming Futures",
    description:
      "Building sustainable livelihoods for women through skill development, entrepreneurship, education, and community led initiatives across India.",
    heroBg: "/images/building-skills-hero-img.png",
    // personImg: "/images/hero-img01.png",
  },
  {
    id: 3,
    badge: "Creating Sustainable Change,",
    title: "One Community at a Time",
    description:
      "Empowering communities through education, healthcare, women entrepreneurship, and sustainable development initiatives.",
    heroBg: "/images/herosection-slider-img11.png",
    // personImg: "/images/hero-img01.png",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || index === current) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent(index);
        setIsTransitioning(false);
      }, 800);
    },
    [current, isTransitioning]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      goToSlide((current + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [current, goToSlide]);

  const slide = SLIDES[current];

  return (
    <section className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 mt-2 pb-4  ">
      <div className="relative overflow-hidden bg-[#000] rounded-[18px] border border-[#000]/10 lg:min-h-[500px] flex items-center bg-[#fff]">
        <div className={`absolute inset-0 transition-opacity duration-500 ${isTransitioning ? "opacity-0" : "opacity-100"
          }`}>
          <Image
            src={slide.heroBg}
            alt="Hero background"
            fill
            className="object-cover object-center rounded-[18px]"
            priority
          />
          <div className="absolute inset-0 lg:bg-[#e6edd5]/20 bg-[#e6edd5]/70" />
        </div>
        <div className="relative z-10 w-full flex items-center justify-between px-8 md:px-16 ">
          <div
            className={` transition-all duration-500 lg:py-16 py-10 ${isTransitioning
              ? "opacity-0 translate-y-4"
              : "opacity-100 translate-y-0"
              }`}>
            <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-1 text-[#000]">
              <span className="text-[#81ba45]">{slide.badge}</span>
              <br />
              <span className="text-[#000]">{slide.title}</span>
            </h1>
            <p className="text-black text-sm md:text-base lg:text-base mt-3 mb-6 leading-relaxed lg:w-[60%]">
              {slide.description}
            </p>
            <button className="bg-[#81ba45] text-white text-base font-semibold px-6 py-2.5 rounded-full hover:bg-[#4a8a2e]  transition-colors cursor-pointer">
              Become a Volunteer
            </button>
            <div className="flex items-center gap-2 mt-6">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${i === current
                    ? "w-6 h-2.5 bg-[#5a9e3a]"
                    : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}