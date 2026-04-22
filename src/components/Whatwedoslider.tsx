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
    customPaging: function () {
      return <div className="whatwedo-dot" />;
    },
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="whatwedo-slider mt-10">
      <Slider {...settings}>
        {whatWeDoData.map((item, index) => (
          <div key={index} className="px-3 h-full">
            <div className="bg-white border border-[#000000]/10 rounded-[16px] py-5 px-4 space-y-4 card-what-we-do overflow-hidden flex flex-col h-full justify-between">
              <div>
                <Image
                  src={item.image}
                  alt={item.title}
                  width={500}
                  height={300}
                  className="w-full "
                />
              </div>
              <div className="flex flex-col flex-1 space-y-2">
                <div>
                  <h3 className="text-black lg:text-2xl text-xl font-bold">
                    {item.title}
                  </h3>
                  <p className="lg:text-base text-[#000]/60">
                    {item.description}
                  </p>
                </div>
                <a
                  href={item.link}
                  className="text-[#81BA45] text-base font-semibold mt-auto"
                >Learn More </a>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}