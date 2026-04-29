"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const SensitizingSection = () => {
  const images = [
    "/images/sensitizing-society.png",
    "/images/skills-industry-img.png",
    "/images/arts-culture-img.png",
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // start fade out

      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
        setFade(true); // fade in new image
      }, 400); // match with transition duration
    }, 6000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="bg-[#E6EBDB] lg:py-16 py-10 mt-10">
      <div className="mx-5 xl:mx-10 2xl:mx-0">
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 items-center">
          
          {/* Image Section */}
          <div className="w-full flex items-center justify-center overflow-hidden">
            <Image
              src={images[currentImage]}
              alt="society image"
              width={600}
              height={400}
              className={`transition-opacity duration-500 ${
                fade ? "opacity-100" : "opacity-0"
              }`}
              priority
            />
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h2 className="text-black lg:text-4xl md:text-3xl text-xl font-bold">
              Sensitizing Society on Menstrual Hygiene
            </h2>

            <p className="text-black">
              Menstruation remains a sensitive and often stigmatized topic in the lives of adolescents.
            </p>

            <p className="text-black">
              Project Swecha empowers girls with knowledge and hygiene support.
            </p>

            <Link
              href="#"
              className="inline-flex items-center bg-[#81BA45] rounded-full px-10 py-2.5 text-white font-semibold"
            >
              Stand With Her
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SensitizingSection;