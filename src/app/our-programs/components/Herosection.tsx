"use client";
import Image from "next/image";
export default function HeroSection() {
  return (
    <section className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 mt-2">

      <div
        className="relative rounded-[18px] border border-black/10 bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: "url('/images/our-programs-hero-img.png')" }}>
        <div className=" w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative z-10 px-8 md:px-16 py-12 lg:py-20 lg:w-[80%]">
          <span className="bg-[#E8F5ED] inline-flex py-2 px-8  rounded-full items-center gap-2">
            <Image
              src="/images/making-impact-icon.png"
              alt="logo image"
              width={20}
              height={20}
            />
            <p className="text-[#2D7A4F] text-base font-semibold">Making Impact</p>
          </span>
          <h1 className="text-3xl text-black md:text-5xl font-bold leading-tight mb-4 mt-2">
             <span className="text-[#81BA45]">Empowering Lives</span>Through Meaningful Programs
          </h1>
          <p className="text-gray-700 text-sm md:text-base lg:text-lg mb-6 lg:w-[80%]">
            Transforming communities with impactful initiatives focused on education, health, environment, and empowerment.
          </p>
          <button className="bg-[#5a9e3a] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#4a8a2e] transition-colors">
            Explore Our Impact
          </button>

        </div>
        </div>
      </div>
    </section>
  );
}