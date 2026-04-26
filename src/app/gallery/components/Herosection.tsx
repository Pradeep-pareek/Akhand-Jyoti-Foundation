"use client";
import Image from "next/image";
export default function HeroSection() {
  return (
    <section className="lg:mx-5 xl:mx-10 2xl:mx-0 mt-2 lg:pb-10">
      <div
        className="relative bg-[#81BA45]/30 rounded-[18px] border border-black/10 bg-cover bg-center">
        <div className="relative z-10  py-12 ">
          <div className="px-5">
            <h1 className="text-3xl text-black md:text-5xl text-center font-bold leading-tight lg:w-[80%] mx-auto ">
              Empowering <span className="text-[#81BA45]">Communities Through</span> Education & Action
            </h1>
            <p className="text-gray-700 text-sm md:text-base text-center lg:text-lg mb-3 lg:w-[80%] mx-auto">
              Transforming communities with impactful initiatives focused on education, health, environment, and empowerment.
            </p>
            <button className="bg-[#5a9e3a] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#4a8a2e] transition-colors flex justify-center mx-auto cursor-pointer">
              Explore Our Impact
            </button>
          </div>

          <Image
            src="/images/gallery-hero-img.png"
            alt="logo image"
            width={300}
            height={300}
            className="w-full mx-auto"
          />
        </div>
      </div>
    </section>
  );
}