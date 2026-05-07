"use client";

import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const logos = [
  "/images/11 1.png",
  "/images/22 1.png",
  "/images/33 1.png",
  "/images/44 1.png",
  "/images/55 1.png",
  "/images/66 1.png",
  "/images/77 1.png",
  "/images/88 1.png",
  "/images/99 1.png",
  "/images/100 1.png",
  "/images/200 1.png",
  "/images/300 1.png",
  "/images/400 1.png",
  "/images/500 1.png",
];

export default function LogoSlider() {
  const settings = {
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    speed: 3000,
    cssEase: "linear",
    pauseOnHover: true,
    arrows: false,
    dots: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 4 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 2 },
      },
    ],
  };

  return (
    <div className="mt-10 overflow-hidden">
      <Slider {...settings}>
        {logos.map((src, index) => (
          <div key={index} className="px-4">
            <div className="h-[120px] flex items-center justify-center ">
              <Image
                src={src}
                alt={`partner logo ${index + 1}`}
                width={160}
                height={80}
                className="object-contain max-h-[80px] w-auto"
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}