"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Slider from "react-slick";
import Link from "next/link";
import { IconHeartFilled } from "@tabler/icons-react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

/* ✅ DATA */
const newsData = [
  {
    id: 1,
    image: "/images/news-img.png",
    title: "Sanitation Workers Training Program Begins",
    description:
      "A training initiative for sanitation workers has been launched to improve work quality, health awareness, and effective waste management practices.",
    link: "/contact-us",
  },
  {
    id: 2,
    image: "/images/news-img.png",
    title: "Health Awareness Campaign Across Rural Areas",
    description:
      "A large-scale health awareness campaign has been launched in rural communities.",
    link: "/contact-us",
  },
  {
    id: 3,
    image: "/images/news-img.png",
    title: "Waste Management Workshop for Local Workers",
    description:
      "A workshop focused on waste management techniques was conducted.",
    link: "/contact-us",
  },
  {
    id: 4,
    image: "/images/news-img.png",
    title: "Skill Development Program for Youth",
    description:
      "A new skill development initiative aims to empower youth.",
    link: "/contact-us",
  },
];

export default function NewsSlider() {
  const sliderRef = useRef<Slider>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,

    // ✅ Track active slide
    beforeChange: (_: number, next: number) => {
      setActiveSlide(next);
    },
  };

  return (
    <div className="bg-white py-10 px-6 md:px-10 rounded-[16px] mt-10">
      <Slider ref={sliderRef} {...settings}>
        {newsData.map((item) => (
          <div key={item.id}>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 items-center">

              {/* Image */}
              <div className="bg-white rounded-[18px] border border-black/20 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={700}
                  height={500}
                  className="w-full h-[300px] md:h-[400px] object-cover"
                />
              </div>

              {/* Content */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <h2 className="text-black lg:text-4xl md:text-3xl text-xl font-bold leading-snug">
                    {item.title}
                  </h2>
                  <p className="text-black text-sm md:text-base lg:text-lg leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between">

                  {/* Button */}
                  <Link
                    href={item.link}
                    className="inline-flex items-center gap-2 bg-[#81BA45] rounded-full px-6 py-2 text-white font-semibold"
                  >
                    <IconHeartFilled className="text-red-500" />
                    Donate Now
                  </Link>

                
                  <div className="flex items-center gap-2">
                    {newsData.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => sliderRef.current?.slickGoTo(i)}
                        className={`h-2 rounded-full transition-all duration-500 ease-in-out ${
                          activeSlide === i
                            ? "w-10 bg-[#81BA45] scale-110"
                            : "w-3 bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}