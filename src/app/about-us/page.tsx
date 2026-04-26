import HeroSection from "../about-us/components/Herosection";
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
            <section className="bg-white lg:py-16 py-10 mt-10">
                <div className="mx-5 xl:mx-10 2xl:mx-0">
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">

                        <div>
                            <Image
                                src="/images/about-us-img.png"
                                alt="logo image"
                                width={300}
                                height={300}
                                className="w-full mx-auto"
                            />
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-3">
                                <h2 className="text-black lg:text-4xl md:text-3xl text-xl font-bold leading-snug">
                                    Empowering Growth Through Skills & Training Across India.
                                </h2>
                                <div>
                                    <p className="text-black text-sm md:text-base lg:text-lg leading-relaxed">
                                        Our diverse range of services empowers clients to cultivate and enhance their skill sets while maintaining high standards of quality, transparency, authenticity, and productivity. With a team of experienced professionals, we specialize in skill development, social development, corporate training,
                                    </p>
                                    <p className="text-black text-sm md:text-base lg:text-lg leading-relaxed">
                                        assessments, ground connect activities, and self-employment models. Our expertise and experience allow us to deliver comprehensive solutions in these areas, catering to the unique needs and goals of our clients.
                                    </p>
                                </div>

                            </div>
                            <Link
                                href=""
                                className="inline-flex items-center gap-2 bg-[#81BA45] rounded-full px-6 py-2.5 text-white font-semibold">
                                <IconHeartFilled className="text-red-500" />
                                Join Our Mission
                            </Link>
                        </div>
                    </div>
                </div>
            </section >


            <section
                className="bg-cover bg-center lg:py-16 py-10"
                style={{ backgroundImage: "url('/images/green-rectangle-bg.png')" }}
            >
                <div className="mx-5 xl:mx-10 2xl:mx-0">

                    <div className="">
                        <p className="text-white text-lg font-semibold">Who We Are</p>
                        <h2 className="text-white lg:text-4xl md:text-3xl text-xl font-bold leading-snug md:w-[60%]">
                            Empowering Growth Through Skills & Training Across India.
                        </h2>
                    </div>
                    <div className="grid lg:grid-cols-2 grid-cols-1 mt-8 gap-8">
                        <div>
                            <Image
                                src="/images/who-we-are.png"
                                alt="logo image"
                                width={300}
                                height={300}
                                className="w-full mx-auto"
                            />
                        </div>
                        <div>
                            <p className="text-white text-sm md:text-base lg:text-lg leading-relaxed">Our diverse range of services empowers clients to cultivate and enhance their skill sets while maintaining high standards of quality, transparency, authenticity, and productivity. With a team of experienced professionals, we specialize in skill development, social development, corporate training,
                                assessments, ground connect activities, and self-employment models. Our expertise and experience allow us to deliver comprehensive solutions in these areas, catering to the unique needs and goals of our clients.</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12 mt-5">
                                <div className="flex items-center gap-2">
                                    <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                                        <Check className="text-black w-5 h-5" />
                                    </div>
                                    <p className="text-white text-base sm:text-lg font-medium">
                                        Skill Development
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                                        <Check className="text-black w-5 h-5" />
                                    </div>
                                    <p className="text-white text-base sm:text-lg font-medium">
                                        Sustainable Impact
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                                        <Check className="text-black w-5 h-5" />
                                    </div>
                                    <p className="text-white text-base sm:text-lg font-medium">
                                        Women Empowerment
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                                        <Check className="text-black w-5 h-5" />
                                    </div>
                                    <p className="text-white text-base sm:text-lg font-medium">
                                        Job Opportunities
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                                        <Check className="text-black w-5 h-5" />
                                    </div>
                                    <p className="text-white text-base sm:text-lg font-medium">
                                        Entrepreneurship Support
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                                        <Check className="text-black w-5 h-5" />
                                    </div>
                                    <p className="text-white text-base sm:text-lg font-medium">
                                        Community Growth
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>


            <section className="bg-white lg:py-16 py-10">
                <div className="mx-5 xl:mx-10 2xl:mx-0">
                    <div>
                        <h2 className="text-black lg:text-4xl md:text-3xl text-xl font-bold leading-snug text-center">
                            Missing and visson
                        </h2>
                        <p className="text-center text-black w-[60%] mx-auto text-sm md:text-base lg:text-lg">We are dedicated to empowering individuals and communities through skill development, innovation, and sustainable opportunities that create long-term impact.</p>
                    </div>
                    <div className="grid lg:grid-cols-2 gap-8 mt-10">
                        <div className="bg-white rounded-[12px] border border-[#000]/10 py-6 px-8 space-y-4">
                            <div className="bg-[#F3F5EE] rounded-full w-20 h-20 flex items-center justify-center shrink-0">
                                <Image
                                    src="/images/driving-purpose.png"
                                    alt="logo image"
                                    width={40}
                                    height={40}
                                />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-black text-3xl font-bold">Driving Purpose</h3>
                                <p className="text-black text-base">We empower youth and women with practical skills, training, and opportunities that enable self-reliance, entrepreneurship, and sustainable livelihoods.</p>
                            </div>

                        </div>
                        <div className="bg-white rounded-[12px] border border-[#000]/10 py-6 px-8 space-y-4">
                            <div className="bg-[#F3F5EE] rounded-full w-20 h-20 flex items-center justify-center shrink-0">
                                <Image
                                    src="/images/future-we-see.png"
                                    alt="logo image"
                                    width={40}
                                    height={40}
                                />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-black text-3xl font-bold">Future We See</h3>
                                <p className="text-black text-base">We envision a world where every individual has equal access to opportunities, enabling them to grow, succeed, and contribute to a stronger, self-reliant society.</p>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
            <section className="bg-[#F3F5EE] lg:py-16 py-10">
                <div className="mx-5 xl:mx-10 2xl:mx-0">
                    <div className="bg-[#81BA45]/30 rounded-[16px] pt-10 px-8 flex flex-col lg:flex-row items-start gap-8">
                        <div>
                            <Image
                                src="/images/saikat-mukherjee-image.png"
                                alt="logo image"
                                width={350}
                                height={340}
                            />
                        </div>
                        <div className="lg:w-[50%] bg-white rounded-[12px] px-6 py-6 space-y-2 chairman-details">
                            <p className="text-black text-base">
                                I am convinced that the most profound exercise of the heart is reaching down to lift others up, fostering connections that enrich both lives. True growth comes not from individual success, but from the ability to uplift those around us. When we empower others, we create a ripple effect of positivity, purpose, and lasting impact in society. This shared journey of growth strengthens communities and builds a future rooted in compassion and collective progress.
                            </p>
                            <div className="flex justify-between items-center ">
                                <div>
                                    <h4 className="text-black text-lg font-bold">Saikat Mukherjee</h4>
                                    <p className="text-base text-[#000]/60">( Chairman & Founder )</p>
                                </div>
                                <div>
                                    <Image
                                        src="/images/quote-icon.png"
                                        alt="logo image"
                                        width={50}
                                        height={50}
                                    />
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </section>
            <Offerings />
            <section
                className="bg-cover bg-center lg:py-16 py-10"
                style={{ backgroundImage: "url('/images/green-rectangle-bg.png')" }}>
                <div>
                    <div className="space-y-2">
                        <h2 className="text-white lg:text-4xl md:text-3xl text-xl font-bold leading-snug text-center">
                            Meet Our Board Members
                        </h2>
                        <p className="text-center text-white lg:w-[70%] mx-auto text-sm md:text-base lg:text-lg">Our board comprises experienced leaders and visionaries committed to driving sustainable social impact across education, skill development, and community empowerment in India.</p>
                    </div>
                </div>
            </section>
            <section className="bg-[#F5F5F5] lg:py-16 py-10">
                <div className="mx-5 xl:mx-10 2xl:mx-0">
                    <div>
                        <h4 className="text-[#74AA3A] text-center font-semibold text-base">Our Team</h4>
                        <h2 className="text-black lg:text-4xl md:text-3xl text-xl font-bold leading-snug text-center">
                            The people powering our mission
                        </h2>
                        <p className="text-center text-black lg:w-[70%] mx-auto text-sm md:text-base lg:text-lg">Behind every program and initiative is a passionate team of dedicated professionals working on the ground to create real, lasting change in the lives of communities across India.</p>
                    </div>

                    <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5 mt-10">
                        <div className="bg-[#FFFFFF] border border-[#DEDDDD] py-8 px-4 rounded-[12px] space-y-4">
                            <div className="h-[90px] w-[90px] rounded-full flex items-center justify-center bg-[#E1F5EE] mx-auto">
                                <Image
                                    src="/images/team-mem-img.png"
                                    alt="logo image"
                                    width={80}
                                    height={80}
                                    className="object-contain"
                                />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-center text-black">Rahul Mehta</h3>
                                <p className="text-center text-base text-black">Financial Officer</p>
                            </div>
                            <div className="flex justify-center">
                                <span className="text-[#1D9E75] bg-[#E1F5EE] px-4 py-1 rounded-full">Board Member</span>
                            </div>

                        </div>
                        <div className="bg-[#FFFFFF] border border-[#DEDDDD] py-8 px-4 rounded-[12px] space-y-4">
                            <div className="h-[90px] w-[90px] rounded-full flex items-center justify-center bg-[#E1F5EE] mx-auto">
                                <Image
                                    src="/images/team-mem-img.png"
                                    alt="logo image"
                                    width={80}
                                    height={80}
                                    className="object-contain"
                                />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-center text-black">Rahul Mehta</h3>
                                <p className="text-center text-base text-black">Financial Officer</p>
                            </div>
                            <div className="flex justify-center">
                                <span className="text-[#534AB7] bg-[#EEEDFE] px-4 py-1 rounded-full">Board Member</span>
                            </div>

                        </div>
                        <div className="bg-[#FFFFFF] border border-[#DEDDDD] py-8 px-4 rounded-[12px] space-y-4">
                            <div className="h-[90px] w-[90px] rounded-full flex items-center justify-center bg-[#E1F5EE] mx-auto">
                                <Image
                                    src="/images/team-mem-img.png"
                                    alt="logo image"
                                    width={80}
                                    height={80}
                                    className="object-contain"
                                />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-center text-black">Rahul Mehta</h3>
                                <p className="text-center text-base text-black">Financial Officer</p>
                            </div>
                            <div className="flex justify-center">
                                <span className="text-[#185FA5] bg-[#E6F1FB] px-4 py-1 rounded-full">Board Member</span>
                            </div>

                        </div>
                        <div className="bg-[#FFFFFF] border border-[#DEDDDD] py-8 px-4 rounded-[12px] space-y-4">
                            <div className="h-[90px] w-[90px] rounded-full flex items-center justify-center bg-[#E1F5EE] mx-auto">
                                <Image
                                    src="/images/team-mem-img.png"
                                    alt="logo image"
                                    width={80}
                                    height={80}
                                    className="object-contain"
                                />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-center text-black">Rahul Mehta</h3>
                                <p className="text-center text-base text-black">Financial Officer</p>
                            </div>
                            <div className="flex justify-center">
                                <span className="text-[#1D9E75] bg-[#E1F5EE] px-4 py-1 rounded-full">Board Member</span>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
            <Member />
        </>
    );
}
