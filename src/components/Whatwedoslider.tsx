"use client";

import React from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const whatWeDoData = [
  {
    image: "/images/education-slider-img.png",
    title: "Education",
    description: "Unlocking Potential Through Learning",
    link: "#",
  },
  {
    image: "/images/education-slider-img.png",
    title: "Women Empowerment",
    description: "Empowering Women, Transforming Communities",
    link: "#",
  },
  {
    image: "/images/education-slider-img.png",
    title: "Environment",
    description: "Sustainable Actions for a Better Tomorrow",
    link: "#",
  },
  {
    image: "/images/education-slider-img.png",
    title: "Education",
    description: "Unlocking Potential Through Learning",
    link: "#",
  },
];

export default function WhatWeDoSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    dotsClass: "slick-dots whatwedo-dots",
    customPaging: () => <div className="whatwedo-dot" />,
    responsive: [
      {
        breakpoint: 1280, // laptop
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1024, // tablet
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640, // mobile
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="whatwedo-slider mt-10 px-2 sm:px-4">
      <Slider {...settings}>
        {whatWeDoData.map((item, index) => (
          <div key={index} className="px-2 sm:px-3 h-full">
            <div className="bg-white border border-[#000000]/10 rounded-[16px] p-4 sm:p-5 space-y-4 flex flex-col h-full">
              
              {/* Image */}
              <div className="overflow-hidden rounded-[12px]">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={500}
                  height={300}
                  className="w-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1">
                <div>
                  <h3 className="text-black text-lg sm:text-xl lg:text-2xl font-bold">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#000]/60 mt-1">
                    {item.description}
                  </p>
                </div>

                <a
                  href={item.link}
                  className="text-[#81BA45] text-sm sm:text-base font-semibold mt-4"
                >
                  Learn More →
                </a>
              </div>

            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}