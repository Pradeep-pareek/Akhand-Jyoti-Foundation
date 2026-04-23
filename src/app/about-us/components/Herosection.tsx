"use client";

export default function HeroSection() {
  return (
    <section className="lg:mx-5 xl:mx-10 2xl:mx-0 mt-2">
 
      <div
        className="relative rounded-[18px] border border-black/10 bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: "url('/images/about-hero-bg.png')" }}
      >
        <div className="relative z-10 px-8 md:px-16 py-12 lg:py-20 lg:w-[80%]">
          <h1 className="text-3xl text-black md:text-5xl font-bold leading-tight mb-4">
            Building Sustainable Impact Through Empowerment
          </h1>

          <p className="text-gray-700 text-sm md:text-base lg:text-lg mb-6 lg:w-[80%]">
            With a strong national presence and strategic collaborations, we go beyond training—creating pathways to employment, entrepreneurship, and economic independence for underserved communities.
          </p>

          <button className="bg-[#5a9e3a] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#4a8a2e] transition-colors">
            Become a Volunteer
          </button>

        </div>
      </div>
    </section>
  );
}