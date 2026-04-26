"use client";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const slides = [
  {
    id: 1,
    images: {
      top: ["/images/gallery-img1.png", "/images/gallery-img2.png", "/images/gallery-imageo.png"],
      bottom: "/images/gallery-img1.png",
    },
    title: "A Step Towards 'Saksham Nari, Sashakt Nari'",
    description:
      "Akhandjyoti Foundation, with AMHSSC and IOCL, is training 350 rural women in tailoring and apparel skills to boost employment and independence. Akhandjyoti Foundation, with AMHSSC and IOCL, is training 350 rural women in tailoring and apparel skills to boost employment and independence.",
    impacts: [
      "350+ women trained in apparel skills",
      "350+ women trained in apparel skills",
      "350+ women trained in apparel skills",
    ],
  },
  {
    id: 2,
    images: {
      top: ["/images/gallery-img2.png", "/images/gallery-imageo.png", "/images/gallery-img1.png"],
      bottom: "/images/gallery-img2.png",
    },
    title: "A Step Towards 'Saksham Nari, Sashakt Nari'",
    description:
      "Akhandjyoti Foundation, with AMHSSC and IOCL, is training 350 rural women in tailoring and apparel skills to boost employment and independence. Akhandjyoti Foundation, with AMHSSC and IOCL, is training 350 rural women in tailoring and apparel skills to boost employment and independence.",
    impacts: [
      "350+ women trained in apparel skills",
      "350+ women trained in apparel skills",
      "350+ women trained in apparel skills",
    ],
  },
  {
    id: 3,
    images: {
      top: ["/images/gallery-imageo.png", "/images/gallery-img1.png", "/images/gallery-img2.png"],
      bottom: "/images/gallery-imageo.png",
    },
    title: "A Step Towards 'Saksham Nari, Sashakt Nari'",
    description:
      "Akhandjyoti Foundation, with AMHSSC and IOCL, is training 350 rural women in tailoring and apparel skills to boost employment and independence. Akhandjyoti Foundation, with AMHSSC and IOCL, is training 350 rural women in tailoring and apparel skills to boost employment and independence.",
    impacts: [
      "350+ women trained in apparel skills",
      "350+ women trained in apparel skills",
      "350+ women trained in apparel skills",
    ],
  },
];

function GallerySlide({ slide }) {
  return (
    <div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2">
        <div className="overflow-hidden rounded-xl">
          <Image src={slide.images.top[0]} alt="logo image" width={300} height={300} className="w-full h-[250px] lg:h-[300px] object-cover mx-auto" />
        </div>
        <div className="overflow-hidden rounded-xl">
          <Image src={slide.images.top[1]} alt="logo image" width={300} height={300} className="w-full h-[250px] lg:h-[300px] object-cover mx-auto" />
        </div>
        <div className="overflow-hidden rounded-xl hidden lg:block">
          <Image src={slide.images.top[2]} alt="logo image" width={300} height={300} className="w-full h-[250px] lg:h-[300px] object-cover mx-auto" />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 grid-cols-1 gap-2 mt-4">
        <div className="overflow-hidden rounded-xl">
          <Image src={slide.images.bottom} alt="logo image" width={300} height={300} className="w-full h-[250px] lg:h-full object-cover mx-auto" />
        </div>
        <div className="col-span-1 lg:col-span-2 bg-[#81BA45]/30 rounded-[12px] border border-[#000]/20 py-8 px-6 space-y-4">
          <div>
            <h2 className="text-black text-2xl lg:text-3xl font-semibold">{slide.title}</h2>
            <p className="text-black text-sm lg:text-base mt-1">{slide.description}</p>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-[20px] h-[4px] bg-[#2D7A4F]"></span>
              <h4 className="text-[#000000] md:text-xl text-lg font-bold">Impact at a Glance</h4>
            </div>
            <div className="space-y-2 mt-2">
              {slide.impacts.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <Image src="/images/right-icon.png" alt="logo image" width={20} height={20} />
                  <p className="text-black text-base">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Gallery() {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4500,
    pauseOnHover: true,
    cssEase: "cubic-bezier(0.4, 0, 0.2, 1)",
    appendDots: (dots) => <ul>{dots}</ul>,
    customPaging: () => <div className="g-dot" />,
  };

  return (
    <>
      <style>{`
        .gallery-wrap {
          position: relative;
          padding-right: 28px;
        }

        /* vertical dot strip — right edge, vertically centred */
        .gallery-wrap .slick-dots {
          position: absolute !important;
          top: 50% !important;
          right: -14px !important;
          bottom: auto !important;
          left: auto !important;
          width: auto !important;
          transform: translateY(-50%) !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          gap: 6px !important;
          padding: 0 !important;
          margin: 0 !important;
          list-style: none !important;
        }

        .gallery-wrap .slick-dots li {
          width: auto !important;
          height: auto !important;
          margin: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        /* inactive dot */
        .g-dot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: #C4C4C4;
          transition: height 0.3s ease, background 0.3s ease;
        }

        /* active dot — tall green pill */
        .gallery-wrap .slick-dots li.slick-active .g-dot {
          background: #81BA45 !important;
          height: 28px !important;
          width: 7px !important;
          border-radius: 999px !important;
        }
      `}</style>

      <section className="bg-white lg:py-16 py-10">
        <div className="mx-5 xl:mx-10 2xl:mx-0">
          <div className="gallery-wrap">
            <Slider {...settings}>
              {slides.map((slide) => (
                <div key={slide.id}>
                  <GallerySlide slide={slide} />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>
    </>
  );
}
