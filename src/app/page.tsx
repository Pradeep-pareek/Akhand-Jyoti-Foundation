import PartnersSlider from "@/components/PartnersSlider";
import Whatwedoslider from "@/components/Whatwedoslider";
import Testimonials from "@/components/Testimonials";
import Impactnumber from "@/components/Impactnumber";
import Image from "next/image";
import Link from "next/link";
import { IconHeartFilled } from '@tabler/icons-react';
import Medianews from "@/components/Medianews";
import { IconChevronsRight } from '@tabler/icons-react';
import HeroSection from "@/components/Herosection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <section className="bg-white lg:py-16 py-10">
        <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            <div className="space-y-1">
              <h2 className="text-center lg:text-4xl md:text-3xl text-xl font-bold text-black">What We Do</h2>
              <p className="text-center text-black text-sm md:text-base lg:text-lg lg:w-[60%] mx-auto">We create meaningful social impact through initiatives in education, women empowerment, skill development, and sustainable community transformation.</p>
            </div>
            <Whatwedoslider />
          </div>
        </div>
      </section>
      <section className=" lg:py-16 py-10 ">
        <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-1">
            <h2 className="text-center text-black lg:text-4xl md:text-3xl text-xl font-bold lg:w-[60%] mx-auto">Empowering Women Across Every Stage of Life</h2>
            <p className="text-center text-black text-sm md:text-base lg:text-lg lg:w-[60%] mx-auto">Supporting women at every phase of life through access to education, healthcare, skill development, and sustainable livelihood opportunities—enabling dignity, independence, and a brighter future.</p>
          </div>
          <div className="mt-6">
          <Image
            src="/images/empowering-women-img.svg"
              alt="logo image"
              width={700}
              height={700}
              className="mx-auto z-10 relative"
            />
          </div>
        </div>
      </section>
        <section className="bg-white lg:py-16 py-10">
        <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-1">
            <h2 className="text-center text-black lg:text-4xl md:text-3xl text-xl font-bold lg:w-[60%] mx-auto">Our Impact in Numbers</h2>
            <p className="text-center text-black text-sm md:text-base lg:text-lg lg:w-[60%] mx-auto">Every number tells a story of transformation. From empowering women and creating sustainable livelihoods to advancing education and community development, our impact reflects meaningful change across lives, families, and communities.</p>
          </div>
          <Impactnumber />
        </div>
      </section>
       <section className="lg:py-16 py-10">
        <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
               <div>
          <h2 className="text-center text-black lg:text-4xl md:text-3xl text-xl font-bold">Trusted Partners</h2>
          <p className="text-center text-black text-sm md:text-base lg:text-lg mt-3">Trusted partnerships, driving meaningful change across communities.</p>
        </div>
        <PartnersSlider />
        </div>
      </section>
      {/* <section className="lg:py-16 py-10 bg-[url('/images/experts-bg-img.png')] bg-cover bg-center bg-no-repeat">
        <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-1">
            <h2 className="text-center text-black lg:text-4xl md:text-3xl text-xl font-bold">Guided by Experts</h2>
            <p className="text-center text-black text-sm md:text-base lg:text-lg ">Guided by experts, driven by purpose, and committed to lasting community impact.</p>
          </div>
          <div className="grid md:gap-8 gap-5 pt-8 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1">
            <div className="bg-[#FFFFFF] border border-[#000]/10 py-8 lg:px-6 px-4 rounded-[16px] space-y-3">
              <div className="space-y-2">
                <Image
                  src="/images/Ellipse 8.png"
                  alt="logo image"
                  width={85}
                  height={85}
                  className="mx-auto"
                />
                <h5 className="text-[#81BA45] font-bold lg:text-xl text-lg text-center">David Verma</h5>
              </div>
              <div className="border-t border-t-[#E8F4C9] border-b border-b-[#E8F4C9]">
                <h4 className="text-[#000000] lg:text-lg text-base text-center font-semibold py-2">Education Specialist</h4>
              </div>
              <div>
                <p className="text-[#000000] text-center">Enhancing learning opportunities and building strong educational foundations for undeserved communities.</p>
              </div>
            </div>
            <div className="bg-[#FFFFFF] border border-[#000]/10 py-8 lg:px-6 px-4 rounded-[16px] space-y-3">
              <div className="space-y-2">
                <Image
                  src="/images/Ellipse 8.png"
                  alt="logo image"
                  width={85}
                  height={85}
                  className="mx-auto"
                />
                <h5 className="text-[#81BA45] font-bold lg:text-xl text-lg text-center">David Verma</h5>
              </div>
              <div className="border-t border-t-[#E8F4C9] border-b border-b-[#E8F4C9]">
                <h4 className="text-[#000000] lg:text-lg text-base text-center font-semibold py-2">Healthcare Advisor</h4>
              </div>
              <div>
                <p className="text-[#000000] text-center">Focused on improving access to quality healthcare and promoting overall community wellbeing.</p>
              </div>
            </div>
            <div className="bg-[#FFFFFF] border border-[#000]/10 py-8 lg:px-6 px-4 rounded-[16px] space-y-3">
              <div className="space-y-2">
                <Image
                  src="/images/Ellipse 8.png"
                  alt="logo image"
                  width={85}
                  height={85}
                  className="mx-auto"
                />
                <h5 className="text-[#81BA45] font-bold lg:text-xl text-lg text-center">David Verma</h5>
              </div>
              <div className="border-t border-t-[#E8F4C9] border-b border-b-[#E8F4C9]">
                <h4 className="text-[#000000] lg:text-lg text-base text-center font-semibold py-2">Social Work Expert</h4>
              </div>
              <div>
                <p className="text-[#000000] text-center">Empowering individuals and communities through inclusive and impactful social initiatives.</p>
              </div>
            </div>
          </div>
        </div>
      </section> */}
       <section>
        <Testimonials />
      </section>
        <section
        className="bg-cover bg-center lg:py-16 py-10"
        style={{ backgroundImage: "url('/images/green-rectangle-bg.png')" }}>
        <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-1">
            <h2 className="text-center text-white lg:text-4xl md:text-3xl text-xl font-bold lg:w-[60%] mx-auto">Our Media Coverage</h2>
            <p className="text-center text-white text-sm md:text-base lg:text-lg lg:w-[60%] mx-auto">Discover how Akhandjyoti Foundation’s work in women empowerment, education, and community development is being recognized across leading media platforms—sharing stories of impact, inspiration, and positive change across communities in India.</p>
          </div>
          <Medianews />
        </div>
      </section>

      

      

     

    

    
    </>
  );
}