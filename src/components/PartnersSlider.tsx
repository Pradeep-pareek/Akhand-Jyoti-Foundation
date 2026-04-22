"use client";

import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const logos = [
  "/images/partners-logo.png",
  "/images/partners-logo.png",
  "/images/partners-logo.png",
  "/images/partners-logo.png",
  "/images/partners-logo.png",
  "/images/partners-logo.png",
];

export default function LogoSlider() {
  const settings = {
    infinite: true,
    slidesToShow: 4,
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
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div className="mt-10 overflow-hidden">
      <Slider {...settings}>
        {logos.map((src, index) => (
          <div key={index} className="px-3">
            <Image
              src={src}
              alt={`partner logo ${index + 1}`}
              width={200}
              height={200}
              className="object-contain cursor-pointer"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}