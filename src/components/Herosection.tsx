"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

const SLIDES = [
  {
    id: 1,
    badge: "AKHANDJYOTI",
    title: "FOUNDATION",
    description:
      "We are a registered NPO delivering skill development, education, health, community, corporate training, and women entrepreneurship programs.",
    heroBg: "/images/hero-img-bg-landing.png", 
    personImg: "/images/hero-img01.png", 
  },
  {
    id: 2,
    badge: "AKHANDJYOTI",
    title: "FOUNDATION",
    description:
      "Empowering communities through education, healthcare, and sustainable livelihood programs across India.",
  heroBg: "/images/hero-img-bg-landing.png", 
    personImg: "/images/hero-img01.png", 
  },
  {
    id: 3,
    badge: "AKHANDJYOTI",
    title: "FOUNDATION",
    description:
      "Building a better tomorrow through women entrepreneurship, skill development, and community health initiatives.",
    heroBg: "/images/hero-img-bg-landing.png", 
    personImg: "/images/hero-img01.png", 
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
    <section className="lg:mx-5 xl:mx-10 2xl:mx-0 mt-2 ">
      <div className="relative overflow-hidden bg-[#EFF0EA]  rounded-[18px] border-1 border-[#000]/10 flex items-center">
        <div className={`absolute inset-0 transition-opacity duration-500 ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}>
          <Image
            src={slide.heroBg}
            alt="Hero background"
            fill
            className="object-cover object-center rounded-[18px]"
            priority
          />
          <div className="absolute inset-0 bg-white/40" />
        </div>

        <div className="relative z-10 w-full flex items-center justify-between px-8 md:px-16 ">
          <div
            className={`max-w-sm transition-all duration-500 lg:py-16 py-10 ${
              isTransitioning
                ? "opacity-0 translate-y-4"
                : "opacity-100 translate-y-0"
            }`}
          >
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-1">
              <span className="text-[#5a9e3a]">{slide.badge}</span>
              <br />
              <span className="text-gray-900">{slide.title}</span>
            </h1>
            <p className="text-gray-600 text-sm md:text-base lg:text-lg mt-3 mb-6 leading-relaxed">
              {slide.description}
            </p>
            <button className="bg-[#5a9e3a] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#4a8a2e] transition-colors cursor-pointer">
              Become a Volunteer
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2 mt-6">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-6 h-2.5 bg-[#5a9e3a]"
                      : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right: Person / collage image */}
          <div
            className={` relative w-[580px] lg:h-[380px] h-auto transition-all duration-500 ${
              isTransitioning
                ? "opacity-0 scale-95"
                : "opacity-100 scale-100"
            }`}
          >
            <Image
              src={slide.personImg}
              alt="Hero person"
              fill
              className="object-contain object-right-bottom drop-shadow-xl "
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}