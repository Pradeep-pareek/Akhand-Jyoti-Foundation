import HeroSection from "../about-us/components/Herosection";
// import Chairman from "./components/Offerings";
import Offerings from "./components/Offerings";
import Member from "./components/Member";
import { IconEyeDotted } from '@tabler/icons-react';
import { IconLicense } from '@tabler/icons-react';
import Link from "next/link";
import { IconHeartFilled } from "@tabler/icons-react";
import Image from "next/image";
import { Check } from "lucide-react";

export default function Home() {
    return (
        <>
            <HeroSection />
            <section className="bg-white lg:py-16 py-10 mt-4">
                <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
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
                                    Empowering Lives Through Skills, Opportunity & Inclusion.
                                </h2>
                                <div>
                                    <p className="text-black text-sm md:text-base lg:text-lg leading-relaxed">
                                        At Akhandjyoti Foundation, we empower women, youth, and underserved communities through skill development, education, entrepreneurship, and sustainable livelihood programs. By combining grassroots outreach with professional expertise, we create meaningful opportunities that foster self-reliance, dignity, and long-term community development across India.
                                    </p>
                                    <p className="text-black text-sm md:text-base lg:text-lg leading-relaxed mt-2">
                                        We believe in creating equal opportunities through education, skill development, and community support — helping individuals build a brighter and self-reliant future.
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
                <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="">
                        <p className="text-white text-lg font-semibold">Who We Are</p>
                        <h2 className="text-white lg:text-4xl md:text-3xl text-xl font-bold leading-snug md:w-[60%]">
                            Empowering Lives Through Skills, Opportunity & Sustainable Impact Across India
                        </h2>
                    </div>
                    <div className="grid lg:grid-cols-2 grid-cols-1 mt-8 gap-8">
                        <div>
                            <Image
                                src="/images/wo-we-are-image.png"
                                alt="logo image"
                                width={300}
                                height={300}
                                className="w-full mx-auto rounded-xl"
                            />
                        </div>
                        <div>
                            <p className="text-white text-sm md:text-base lg:text-lg leading-relaxed">Akhandjyoti Foundation is committed to creating meaningful change through women empowerment, skill development, education, and sustainable livelihood initiatives. With deep grassroots engagement and strategic partnerships, we help underserved communities gain access to opportunities that foster self-reliance, economic independence, and long-term social transformation. Our mission is to build stronger communities by empowering individuals with the skills, support, and confidence to create a better future.</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12 mt-5">
                                <div className="flex items-center gap-2">
                                    <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                                        <Check className="text-black w-5 h-5" />
                                    </div>
                                    <p className="text-white text-base sm:text-lg font-medium">
                                        Skill Development Programs
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                                        <Check className="text-black w-5 h-5" />
                                    </div>
                                    <p className="text-white text-base sm:text-lg font-medium">
                                        Women Empowerment Initiatives
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                                        <Check className="text-black w-5 h-5" />
                                    </div>
                                    <p className="text-white text-base sm:text-lg font-medium">
                                        Entrepreneurship & Livelihood Support
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                                        <Check className="text-black w-5 h-5" />
                                    </div>
                                    <p className="text-white text-base sm:text-lg font-medium">
                                        Sustainable Community Development
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                                        <Check className="text-black w-5 h-5" />
                                    </div>
                                    <p className="text-white text-base sm:text-lg font-medium">
                                        Education & Social Inclusion
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                                        <Check className="text-black w-5 h-5" />
                                    </div>
                                    <p className="text-white text-base sm:text-lg font-medium">
                                        Creating Employment Opportunities
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section className="bg-white lg:py-16 py-10">
                <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div>
                        <h2 className="text-black lg:text-4xl md:text-3xl text-2xl font-bold leading-snug text-center mb-2">
                            Mission and Vision
                        </h2>
                        <p className="text-center text-black md:w-[60%] mx-auto text-sm md:text-base lg:text-lg">Creating opportunities that empower women, strengthen communities, and build sustainable livelihoods through skill development, education, and inclusive social impact initiatives across India.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 grid-cols-1 gap-8 mt-10">
                        <div className="bg-[#fff] rounded-[12px] border border-[#000]/20 py-6 px-8 space-y-4 m-card-box relative">
                            <div className="bg-[#74aa3a] rounded-full w-20 h-20 flex items-center justify-center shrink-0">
                                <IconLicense size={40} stroke={2} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-black lg:text-2xl text-xl font-bold">Empowering Lives Through Opportunity</h3>
                                <p className="text-black text-base">Our mission is to empower women, youth, and underserved communities through skill development, education, entrepreneurship support, and sustainable livelihood programs that foster self-reliance, dignity, and long-term community growth.</p>
                            </div>
                        </div>
                        <div className="bg-[#fff] rounded-[12px] border border-[#000]/20 py-6 px-8 space-y-4 v-card-box relative">
                            <div className="bg-[#74aa3a] rounded-full w-18 h-18 flex items-center justify-center shrink-0">
                                <IconEyeDotted size={40} stroke={2} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-black lg:text-2xl text-xl font-bold">Building a More Inclusive Future</h3>
                                <p className="text-black text-base">We envision a future where every individual—especially women and marginalized communities—has equal access to education, skills, and opportunities to thrive, lead, and contribute to a stronger, self-reliant society.</p>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
            <section className="bg-[#F3F5EE] lg:py-16 py-10">
                <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-[#81BA45]/30 rounded-[16px] lg:pt-10 lg:pb-0 pb-6 px-8 flex flex-col lg:flex-row lg:items-start items-center">
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
                                At Akhandjyoti Foundation, we believe that real change begins when people are empowered with opportunities, support, and hope. Our mission is to uplift women, youth, and underserved communities through initiatives focused on education, skill development, social welfare, and sustainable growth. By fostering confidence, self-reliance, and inclusion, we aim to create stronger communities and a brighter future where every individual has the chance to grow with dignity and purpose.
                            </p>
                            <div className="flex justify-between items-center ">
                                <div>
                                    <h4 className="text-black text-lg font-bold">Saikat Mukherjee</h4>
                                    <p className="text-base text-[#000]/60">Chairman & Founder</p>
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
            <Member />
            <section className="bg-[#F5F5F5] lg:py-16 py-10">
                <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div>
                        <h4 className="text-[#74AA3A] text-center font-semibold text-lg">Our Team</h4>
                        <h2 className="text-black lg:text-4xl md:text-3xl text-xl font-bold leading-snug text-center">
                            The People Powering Our Mission
                        </h2>
                        <p className="text-center text-black lg:w-[70%] mx-auto text-sm md:text-base lg:text-lg">Behind every initiative is a passionate team of dedicated professionals, field experts, and changemakers working tirelessly to empower women, strengthen communities, and create lasting social impact through education, skill development, and sustainable livelihood programs across India.</p>
                    </div>
                    <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 mt-10">
                        <div className="bg-[#FFFFFF] border border-[#DEDDDD] py-8 px-4 rounded-[12px] space-y-4">
                            <div className="h-[110px] w-[110px] rounded-full flex items-center justify-center bg-[#E1F5EE] mx-auto">
                                <Image
                                    src="/images/team-member-111.png"
                                    alt="logo image"
                                    width={100}
                                    height={100}
                                    className="object-contain"
                                />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-center text-black">Shyama Geeta Pandey</h3>
                                <p className="text-center text-base text-black">Program Executive</p>
                            </div>
                            <div className="flex justify-center">
                                <span className="text-[#1D9E75] bg-[#E1F5EE] px-4 py-1 rounded-full">Board Member</span>
                            </div>
                        </div>
                        <div className="bg-[#FFFFFF] border border-[#DEDDDD] py-8 px-4 rounded-[12px] space-y-4">
                              <div className="h-[110px] w-[110px] rounded-full flex items-center justify-center bg-[#E1F5EE] mx-auto">
                                <Image
                                    src="/images/team-member-22.png"
                                    alt="logo image"
                                    width={100}
                                    height={100}
                                    className="object-contain"
                                />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-center text-black">Amit Kumr Goel</h3>
                                <p className="text-center text-base text-black">Social Impact Consultant</p>
                            </div>
                            <div className="flex justify-center">
                                <span className="text-[#534AB7] bg-[#EEEDFE] px-4 py-1 rounded-full">Board Member</span>
                            </div>

                        </div>
                        <div className="bg-[#FFFFFF] border border-[#DEDDDD] py-8 px-4 rounded-[12px] space-y-4">
                            <div className="h-[110px] w-[110px] rounded-full flex items-center justify-center bg-[#E1F5EE] mx-auto">
                                <Image
                                    src="/images/team-member-33.png"
                                    alt="logo image"
                                    width={100}
                                    height={100}
                                    className="object-contain"
                                />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-center text-black">Deepa Chaudhary </h3>
                                <p className="text-center text-base text-black">Operations Head</p>
                            </div>
                            <div className="flex justify-center">
                                <span className="text-[#185FA5] bg-[#E6F1FB] px-4 py-1 rounded-full">Board Member</span>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

        </>
    );
}
