import HeroSection from "./components/Herosection";
// import Chairman from "./components/Offerings";
import Offerings from "./components/Offerings";
import Member from "./components/Member";


import Link from "next/link";
import { IconHeartFilled } from "@tabler/icons-react";
import Image from "next/image";
import { Check } from "lucide-react";

export default function Home() {
    return (
        <>
            <HeroSection />
            <section className="bg-[#E6EBDB] lg:py-16 py-10 mt-10">
                <div className="mx-5 xl:mx-10 2xl:mx-0">
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
                        <div>
                            <Image
                                src="/images/sensitizing-society.png"
                                alt="logo image"
                                width={300}
                                height={300}
                                className="w-full mx-auto"
                            />
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-3">
                                <h2 className="text-black lg:text-4xl md:text-3xl text-xl font-bold leading-snug">
                                    Sensitizing Society on Menstrual Hygiene
                                </h2>
                                <div className="space-y-2">
                                    <p className="text-black text-sm md:text-base lg:text-lg leading-relaxed">
                                        Menstruation remains a sensitive and often stigmatized topic in the lives of adolescents. Many young girls and women continue to face social stigma, harassment, and exclusion during their menstrual cycles.
                                    </p>
                                    <p className="text-black text-sm md:text-base lg:text-lg leading-relaxed">
                                        Project Swecha is an initiative dedicated to breaking these barriers by empowering girls and women with accurate knowledge, access to essential resources, and support for maintaining proper menstrual health and hygiene.
                                    </p>
                                </div>
                            </div>
                            <Link
                                href=""
                                className="inline-flex items-center bg-[#81BA45] rounded-full px-10 py-2.5 text-white font-semibold">
                                Stand With Her
                            </Link>
                        </div>
                    </div>
                </div>
            </section >

            <section className="bg-white lg:py-16 py-10">
                <div className="mx-5 xl:mx-10 2xl:mx-0">
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
                        <div className="space-y-4">
                            <div className="space-y-3">
                                <div className="text-line-main">
                                    <span className="text-line"></span>
                                    <h4 className="text-[#81BA45] font-semibold">Skills & Industry</h4>
                                </div>
                                <h2 className="text-black lg:text-4xl md:text-3xl text-xl font-bold leading-snug">
                                    IOCL Panipat Collaboration — NIPUN Programme
                                </h2>
                                <p className="text-black text-sm md:text-base lg:text-lg leading-relaxed">
                                    Akhandjyoti Foundation collaborated with the Hydrocarbon Sector Skill Council at IOCL Panipat to deliver comprehensive vocational training. The NIPUN programme aimed to equip participants with the technical knowledge needed to excel in the hydrocarbon industry.
                                </p>

                                <div className="bg-[#E8F5ED] border border-[#2D7A4F] rounded-[12px] py-6 px-6 flex gap-4 items-center">
                                    <Image
                                        src="/images/outcome-icon.png"
                                        alt="logo image"
                                        width={80}
                                        height={80}
                                        className=""
                                    />
                                    <p className="text-[#2D7A4F] text-base"> <span className="font-bold">Outcome:</span>  A group of individuals were successfully trained and empowered to contribute effectively to the hydrocarbon sector — enhancing technical skills, safety measures, and professionalism.</p>
                                </div>


                            </div>
                            <Link
                                href=""
                                className="inline-flex items-center bg-[#81BA45] rounded-full px-10 py-2.5 text-white font-semibold">
                                Stand With Her
                            </Link>
                        </div>
                        <div>
                            <Image
                                src="/images/outcome-img.png"
                                alt="logo image"
                                width={300}
                                height={300}
                                className="w-full mx-auto"
                            />
                        </div>
                    </div>
                </div>
            </section>


            <section className="bg-cover bg-center lg:py-16 py-10"
                style={{ backgroundImage: "url('/images/green-rectangle-bg.png')" }}>
                <div className="mx-5 xl:mx-10 2xl:mx-0">
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 items-stretch">
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-[30px] h-[2px] bg-white"></span>
                <p className="text-lg font-normal text-white">
                  Skills & Industry
                </p>
              </div>
              <div className="space-y-3 mt-3">
                <h2 className="text-white lg:text-4xl md:text-3xl text-2xl font-bold leading-snug">
                  Slum Development Initiatives
                </h2>
                <p className="text-white text-sm md:text-base lg:text-lg leading-relaxed">
                  Akhandjyoti Foundation is committed to creating awareness and driving 
                  positive change in sanitation, hygiene, education, and overall community 
                  development. We have conducted dental hygiene campaigns in Kirti Nagar 
                  and menstrual hygiene awareness drives in Noida slums to empower 
                  communities with better health practices.
                </p>
                <div className="space-y-4 mt-4">
                  <div className="bg-[#D2FFE3] rounded-[12px] py-4 px-4">
                    <h5 className="text-[#2D7A4F] text-lg font-semibold">
                      Dental Hygiene Drive
                    </h5>
                    <p className="text-black text-sm">
                      Conducted in Kirti Nagar slum area — promoting oral health awareness 
                      and improving hygiene practices.
                    </p>
                  </div>
                  <div className="bg-[#E8F5ED] rounded-[12px] py-4 px-4">
                    <h5 className="text-[#2D7A4F] text-lg font-semibold">
                      Menstrual Hygiene Awareness
                    </h5>
                    <p className="text-black text-sm">
                      Organized in Noida slums — breaking stigma and educating women 
                      about hygiene and health.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

   
          <div className="flex flex-col h-full">
            <div className="relative w-full flex-1 min-h-[250px]">
              <Image
                src="/images/skills-industry-img.png"
                alt="Slum Development"
                fill
                className="object-cover rounded-[12px]"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3">  
              <div className="bg-[#E8F5ED] rounded-[12px] py-6 px-4">
                <h4 className="text-[#2D7A4F] text-3xl font-bold text-center">
                  3+
                </h4>
                <p className="text-black text-center text-sm md:text-base">
                  Slum Areas
                </p>
              </div>
              <div className="bg-[#E8F5ED] rounded-[12px] py-6 px-4">
                <h4 className="text-[#2D7A4F] text-3xl font-bold text-center">
                  500+
                </h4>
                <p className="text-black text-center text-sm md:text-base">
                  People Impacted
                </p>
              </div>
              <div className="bg-[#E8F5ED] rounded-[12px] py-6 px-4">
                <h4 className="text-[#2D7A4F] text-3xl font-bold text-center">
                  4
                </h4>
                <p className="text-black text-center text-sm md:text-base">
                  Campaigns
                </p>
              </div>
            </div>
          </div>
        </div>
                </div>
            </section>

            <section className="bg-white lg:py-16 py-10">
                <div className="mx-5 xl:mx-10 2xl:mx-0">
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
                        <div>
                            <Image
                                src="/images/arts-culture-img.png"
                                alt="logo image"
                                width={300}
                                height={300}
                                className="w-full mx-auto"
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="w-[20px] h-[3px] bg-[#2D7A4F]"></span>
                                <p className="text-[#2D7A4F] font-semibold text-base">Arts & Culture</p>
                            </div>
                            <div className="space-y-2 mt-2">
                                <h2 className="text-black lg:text-4xl md:text-3xl text-xl font-bold leading-snug">
                                    Govt Girls College Visit — Kiran Nadar Museum of Art
                                </h2>
                                <div>
                                    <p className="text-black text-sm md:text-base lg:text-lg leading-relaxed">
                                        Akhandjyoti Foundation arranged an enriching cultural visit for students of Govt Girls Inter College Noida to the Kiran Nadar Museum of Art, Noida. The initiative offered students an opportunity to explore diverse artworks and exhibitions.
                                    </p>
                                    <p className="text-black text-sm md:text-base lg:text-lg leading-relaxed">
                                        By facilitating this visit, Akhandjyoti Foundation aimed to inspire creativity, broaden horizons, and promote a deeper understanding and love for art among students.
                                    </p>
                                </div>

                            </div>
                            <div className="flex flex-wrap gap-3 sm:gap-4 mt-3">
                                <div className="bg-white border border-[#2D7A4F] rounded-full px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-2">
                                    <span>✨</span>
                                    <p className="text-[#1A4A2E] text-sm sm:text-base lg:text-lg">Creativity</p>
                                </div>

                                <div className="bg-white border border-[#2D7A4F] rounded-full px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-2">
                                    <span>📚</span>
                                    <p className="text-[#1A4A2E] text-sm sm:text-base lg:text-lg">Education</p>
                                </div>

                                <div className="bg-white border border-[#2D7A4F] rounded-full px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-2">
                                    <span>🌱</span>
                                    <p className="text-[#1A4A2E] text-sm sm:text-base lg:text-lg">Inspiration</p>
                                </div>

                                <div className="bg-white border border-[#2D7A4F] rounded-full px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-2">
                                    <span>🎨</span>
                                    <p className="text-[#1A4A2E] text-sm sm:text-base lg:text-lg">Cultural Exposure</p>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </section>

        </>
    );
}
