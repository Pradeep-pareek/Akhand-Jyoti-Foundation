"use client";
import Image from "next/image";
export default function HeroSection() {
  return (
    <section className="lg:mx-5 xl:mx-10 2xl:mx-0 mt-2 pb-10">
      <div
        className="relative rounded-[18px] border border-black/10 bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: "url('/images/financials-hero-img.png')" }}
      >
        <div className="relative z-10 px-8 md:px-16 py-12 lg:py-20 lg:w-[80%]">
           <span className="bg-[#E8F5ED] inline-flex py-2 px-8  rounded-full items-center gap-2">
                      <Image
                        src="/images/making-impact-icon.png"
                        alt="logo image"
                        width={20}
                        height={20}
                      />
                      <p className="text-[#2D7A4F] text-base font-semibold">Transparency</p>
                    </span>
          <h1 className="text-3xl text-black md:text-5xl font-bold leading-tight mb-4 mt-2 lg:w-[80%]">
           Our Past Financials
          </h1>
          <p className="text-gray-700 text-sm md:text-base lg:text-lg mb-6 w-[60%]">
            Transparent reporting across all our entities — building trust through accountability and open governance.
          </p>
          <button className="bg-[#81BA45] text-white text-lg px-8 py-2 rounded-full hover:bg-[#4a8a2e] transition-colors cursor-pointer">
            Contact us
          </button>

        </div>
      </div>
    </section>
  );
}