"use client";
import Image from "next/image";
export default function HeroSection() {
  return (
    <section className="lg:mx-5 xl:mx-10 2xl:mx-0 mt-2 pb-10">
      <div
        className="relative rounded-[18px] border border-black/10 bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: "url('/images/our-programs-hero-img.png')" }}
      >
        <div className="relative z-10 px-8 md:px-16 py-12 lg:py-20 lg:w-[80%]">
          <h1 className="text-3xl text-black md:text-5xl font-bold leading-tight mb-4 mt-2 lg:w-[80%]">
            <span className="text-[#81BA45]">Let’s Connect</span> and Be the Change Together
          </h1>
          <p className="text-gray-700 text-sm md:text-base lg:text-lg mb-6 lg:w-[70%]">
            Together, we can create meaningful change. Reach out to us to support our mission, share your ideas, or become a part of something bigger that truly impacts lives.
          </p>
          <button className="bg-[#81BA45] text-white text-lg px-8 py-2 rounded-full hover:bg-[#4a8a2e] transition-colors cursor-pointer">
            Join the Mission
          </button>

        </div>
      </div>
    </section>
  );
}