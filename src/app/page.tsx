import HeroSection from "@/components/HeroSection";
import PartnersSlider from "@/components/PartnersSlider";
import Whatwedoslider from "@/components/Whatwedoslider";
import Testimonials from "@/components/Testimonials";
import Impactnumber from "@/components/Impactnumber";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <HeroSection />
      <section className="lg:py-16 py-10 bg-white lg:mt-16 mt-10">
        <div>
          <h2 className="text-center lg:text-4xl md:text-3xl text-xl font-bold">Trusted Partners</h2>
          <p className="text-center text-sm md:text-base lg:text-lg mt-3">Collaborating with organizations that share our vision for impactful and sustainable growth.</p>
        </div>
        <PartnersSlider />
      </section>

      <section className="lg:py-16 py-10 bg-[url('/images/experts-bg-img.png')] bg-cover bg-center bg-no-repeat">
        <div className="lg:mx-5 xl:mx-10 2xl:mx-0">
          <div className="space-y-1">
            <h2 className="text-center lg:text-4xl md:text-3xl text-xl font-bold">Guided by Experts</h2>
            <p className="text-center text-sm md:text-base lg:text-lg ">Our advisors bring deep industry knowledge to shape strategy and maximize impact.</p>
          </div>
          <div className="grid gap-8 pt-8 lg:grid-cols-3 md:grid-cols-2">
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
      </section>

      <section className="bg-white lg:py-16 py-10 empowering-women">
        <div className="lg:mx-5 xl:mx-10 2xl:mx-0">
          <div className="space-y-1">
            <h2 className="text-center lg:text-4xl md:text-3xl text-xl font-bold lg:w-[60%] mx-auto">Empowering Women Across Every Stage of Life</h2>
            <p className="text-center text-sm md:text-base lg:text-lg lg:w-[60%] mx-auto">Supporting women through every phase of life by ensuring access to health, education, care, and sustainable opportunities for a dignified future.</p>
          </div>
          <div className="mt-6">
            <Image
              src="/images/empowering-women.png"
              alt="logo image"
              width={700}
              height={700}
              className="mx-auto z-10 relative"
            />
          </div>
        </div>
      </section>

      <section className="bg-white lg:py-16 py-10">
        <div className="lg:mx-5 xl:mx-10 2xl:mx-0">
          <div>
            <div className="space-y-1">
              <h2 className="text-center lg:text-4xl md:text-3xl text-xl font-bold lg:w-[60%] mx-auto">What We Do</h2>
              <p className="text-center text-sm md:text-base lg:text-lg lg:w-[60%] mx-auto">We drive meaningful impact through initiatives focused on education, women empowerment, and sustainable community development.</p>
            </div>
            <Whatwedoslider />
          </div>
        </div>
      </section>

      <section>
        <Testimonials />
      </section>


      <section className="bg-white lg:py-16 py-10">
        <div className="lg:mx-5 xl:mx-10 2xl:mx-0">
          <div className="space-y-1">
            <h2 className="text-center lg:text-4xl md:text-3xl text-xl font-bold lg:w-[60%] mx-auto">Our Impact in Numbers</h2>
            <p className="text-center text-sm md:text-base lg:text-lg lg:w-[60%] mx-auto">Our diverse range of services empowers clients to cultivate and enhance their skill sets while maintaining high standards of quality, transparency, authenticity, and productivity.</p>
          </div>
           <Impactnumber/>
        </div>

      </section>



    </>
  );
}