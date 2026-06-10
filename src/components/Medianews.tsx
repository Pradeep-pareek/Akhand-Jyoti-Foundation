"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

<<<<<<< HEAD
const newsData = [
  {
    id: 1,
    image: "/images/media-news-slider01.png",
    title: "Government Girls Football Team Creates History",
    description:
      "The students of Government Girls Inter College, Noida, have achieved an extraordinary milestone in football through dedication, teamwork, and perseverance. Their remarkable success reflects the power of hard work, disciplined training, and strong mentorship. This achievement not only brings pride to the institution but also inspires young girls to pursue their dreams and excel in sports and beyond.",
    link: "/about-us",
  },
  {
    id: 2,
    image: "/images/media-news-slider02.png",
    title: "Empowering Education Through Digital Learning Support",
    description:
      "A collaborative initiative by Ercon and Akhand Jyoti Foundation has strengthened educational resources in Buxar by providing computer systems and a projector to a local school. The program aims to promote quality education, digital learning, and skill development, creating better opportunities for students and supporting the overall growth of the community.",
   link: "/about-us",
  },
  {
    id: 3,
    image: "/images/media-slider-image03.png",
    title: "Rahul Pawar Inspires Young Minds Through Summer Camp",
    description:
      "A special summer camp was organized to encourage creativity, learning, and personal development among children. Through engaging activities, cultural programs, skill-building sessions, and interactive learning experiences, students were motivated to explore their talents and build confidence. The initiative highlights the importance of nurturing young minds and creating opportunities for holistic growth and development.",
    link: "/about-us",
  },
  {
    id: 4,
    image: "/images/media-news-image04.png",
    title: "Football Kits Distributed to Empower Young Women Athletes",
    description:
      "As part of a sports development initiative, football kits and jerseys were distributed to 33 girl students from a government girls' inter college in Noida. The program aims to encourage young athletes by providing professional sports equipment, promoting participation in football, and supporting excellence in education, sports, and personal development.",
    link: "/about-us",
  },
  {
    id: 5,
    image: "/images/media-news-image-05.png",
    title: "Football Kits Distributed to Government School Girls",
    description:
      "Under a CSR initiative, 33 girl football players from a Government Girls Inter College in Sector-51, Noida, received football kits and jerseys to support their sporting aspirations. The program aims to encourage young talent, promote participation in sports, and empower students to excel both on and off the field.",
    link: "/about-us",
  },
  
];
=======
interface NewsItem {
  id: number;
  image: string;
  title: string;
  description: string;
  link: string;
}
>>>>>>> f1409298e0903c70fe5da04dd84abfb05a816e76

export default function NewsSection() {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetch("/api/medianews")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data.length > 0) {
          setNewsData(json.data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (newsData.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % newsData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [newsData.length]);

  if (newsData.length === 0) return null;

  const current = newsData[activeIndex];

  return (
    <div className="bg-white py-8 md:py-12 px-4 md:px-10 rounded-[16px] mt-10">
      <div className="grid lg:grid-cols-2 gap-6 md:gap-10 items-center">
<<<<<<< HEAD
       <div className="relative w-full aspect-[4/3] rounded-[18px] overflow-hidden border border-black/10">
  <Image
    src={newsData[activeIndex].image}
    alt={newsData[activeIndex].title}
    fill
    className="object-contain transition-all duration-700"
  />
</div>
=======
        <div className="w-full aspect-[4/3] rounded-[18px] overflow-hidden border border-black/10">
          <Image
            src={current.image}
            alt={current.title}
            width={600}
            height={400}
            className="w-full h-full object-cover transition-all duration-700"
          />
        </div>
>>>>>>> f1409298e0903c70fe5da04dd84abfb05a816e76
        <div className="flex flex-col justify-between h-full">
          <div className="space-y-3 md:space-y-4">
<<<<<<< HEAD
            <h2 className="text-black text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-snug mb-0">
              {newsData[activeIndex].title}
=======
            <h2 className="text-black text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-snug">
              {current.title}
>>>>>>> f1409298e0903c70fe5da04dd84abfb05a816e76
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-black leading-relaxed">
              {current.description}
            </p>

            <div className="flex items-center justify-between">
              <Link
<<<<<<< HEAD
                href={newsData[activeIndex].link}
                className="bg-[#81BA45] text-white text-sm md:text-base px-10 py-2 rounded-full font-medium"
=======
                href={current.link || "/contact-us"}
                className="bg-[#81BA45] text-white text-sm md:text-base px-8 py-2 rounded-full font-medium"
>>>>>>> f1409298e0903c70fe5da04dd84abfb05a816e76
              >
                About Us
              </Link>
              <div className="flex items-center gap-2">
                {newsData.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      activeIndex === i ? "w-8 bg-[#81BA45]" : "w-2 bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
