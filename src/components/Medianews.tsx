"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const newsData = [
  {
    id: 1,
    image: "/images/news-img.png",
    title: "Sanitation Workers Training Program Begins",
    description:
      "A training initiative for sanitation workers has been launched to improve work quality, health awareness, and effective waste management practices. A training initiative for sanitation workers has been launched to improve work quality, health awareness, and effective waste management practices.",
    link: "/contact-us",
  },
  {
    id: 2,
    image: "/images/news-img.png",
    title: "Health Awareness Campaign Across Rural Areas",
    description:
      "A large-scale health awareness campaign has been launched in rural communities. A training initiative for sanitation workers has been launched to improve work quality, health awareness, and effective waste management practices.",
    link: "/contact-us",
  },
  {
    id: 3,
    image: "/images/news-img.png",
    title: "Waste Management Workshop for Local Workers",
    description:
      "A workshop focused on waste management techniques was conducted. A training initiative for sanitation workers has been launched to improve work quality, health awareness, and effective waste management practices.",
    link: "/contact-us",
  },
  {
    id: 4,
    image: "/images/news-img.png",
    title: "Skill Development Program for Youth",
    description:
      "A new skill development initiative aims to empower youth. A training initiative for sanitation workers has been launched to improve work quality, health awareness, and effective waste management practices.",
    link: "/contact-us",
  },
];

export default function NewsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % newsData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white py-8 md:py-12 px-4 md:px-10 rounded-[16px] mt-10">

    
      <div className="grid lg:grid-cols-2 gap-6 md:gap-10 items-center">


        <div className="w-full aspect-[4/3] rounded-[18px] overflow-hidden border border-black/10">
          <Image
            src={newsData[activeIndex].image}
            alt={newsData[activeIndex].title}
            width={600}
            height={400}
            className="w-full h-full object-cover transition-all duration-700"
          />
        </div>
        <div className="flex flex-col justify-between h-full">

          <div className="space-y-3 md:space-y-4">
            <h2 className="text-black text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-snug">
              {newsData[activeIndex].title}
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-black leading-relaxed">
              {newsData[activeIndex].description}
            </p>

            <div className="flex items-center justify-between ">

              <Link
                href={newsData[activeIndex].link}
                className="bg-[#81BA45] text-white text-sm md:text-base px-8 py-2 rounded-full font-medium"
              >
                About Us
              </Link>
              <div className="flex items-center gap-2">
                {newsData.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`h-2 rounded-full transition-all duration-500 ${activeIndex === i
                        ? "w-8 bg-[#81BA45]"
                        : "w-2 bg-gray-300"
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