"use client";
import Link from "next/link";
export default function HeroSection() {
  return (
    <section className=" mt-2 w-full  mx-auto px-4 sm:px-6 lg:px-8">
      <div
        className="relative rounded-[18px] lg:min-h-[500px] border border-black/10 bg-cover bg-center overflow-hidden lg:py-16 py-10"
        style={{ backgroundImage: "url('/images/about-hero-bg.png')" }}>
        <div className="relative z-10 px-8 md:px-16  lg:w-[80%]">
          <div>
            <h1 className="text-3xl text-black md:text-5xl font-bold leading-tight ">
              Empowering Lives. Strengthening Communities. Creating Lasting Change.
            </h1>
            <p className="text-gray-700 text-sm md:text-base lg:text-lg mb-4 lg:w-[80%]">
              With a strong grassroots presence and strategic partnerships, AkhandJyoti Foundation works across women empowerment, skill development, education, and community development to build self-reliant communities and a more inclusive future.
            </p>
          </div>

           <Link className="flex gap-1" href={"/contact-us"}>
            <button className="bg-[#81ba45] text-white text-base font-semibold px-6 py-2.5 rounded-full hover:bg-[#4a8a2e]  transition-colors cursor-pointer">
              Become a Volunteer
            </button>
            </Link>
        </div>
      </div>
    </section>
  );
}