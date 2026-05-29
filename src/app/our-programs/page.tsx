"use client";
import HeroSection from "./components/Herosection";
// import Chairman from "./components/Offerings";
import Program from "./components/Program";


import Link from "next/link";
import { IconHeartFilled } from "@tabler/icons-react";
import Image from "next/image";
import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ArtsSection, IoclSection, SensitizingSection, SlumSection } from "../admin/our-programs/page";
type SectionKey = "iocl_section" | "slum_section" | "arts_section" | "sensitizing_section";
type SectionData = IoclSection | SlumSection | ArtsSection | SensitizingSection;

export default function Home() {
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [loading, setLoading] = useState(true);

    const showToast = (message: string, type: "success" | "error") =>
        setToast({ message, type });

    const [sections, setSections] = useState<Record<string, SectionData> | null>(null);
    useEffect(() => {
        fetch("/api/our-programs")
            .then((r) => r.json())
            .then((json) => {
                if (json.success) setSections(json.sections);
                else showToast("Failed to load content", "error");
                console.log(json.sections);
            })
            .catch(() => showToast("Failed to load content", "error"))
            .finally(() => setLoading(false));
        console.log(sections);
    }, []);
    const iocl = sections?.iocl_section as IoclSection;
    const slum = sections?.slum_section as SlumSection;
    const arts = sections?.arts_section as ArtsSection;
    const sensitizing = sections?.sensitizing_section as SensitizingSection;
    if (loading) {
        return (
            <>
                <HeroSection />
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 size={36} className="animate-spin text-[#81BA45]" />
                        <p className="text-gray-500 font-medium">Loading Our Programs…</p>
                    </div>
                </div>
            </>
        );
    }
    return (
        <>
            <HeroSection />
            <Program sections={sections} />
            <section className="bg-white lg:py-16 py-10">
                <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
                        <div className="space-y-4">
                            <div className="space-y-3">
                                <div className="text-line-main">
                                    <span className="text-line"></span>
                                    <h4 className="text-[#81BA45] font-semibold">
                                        {iocl?.badge}
                                    </h4>                                </div>
                                <h2 className="text-black lg:text-4xl md:text-3xl text-xl font-bold leading-snug">
                                    {iocl?.heading}
                                </h2>
                                <p className="text-black text-sm md:text-base lg:text-lg leading-relaxed">
                                    {iocl?.description}
                                </p>

                                <div className="bg-[#E8F5ED] border border-[#2D7A4F] rounded-[12px] py-6 px-6 flex gap-4 items-center">
                                    <Image
                                        src={iocl?.outcome_icon || "/images/outcome-icon.png"}
                                        alt="logo image"
                                        width={80}
                                        height={80}
                                        className=""
                                    />
                                    <p className="text-[#2D7A4F] text-base"> <span className="font-bold">Outcome:</span> {iocl?.outcome_text}</p>
                                </div>


                            </div>
                            <Link href={iocl?.cta_href || "#"} className="inline-flex items-center bg-[#81BA45] rounded-full px-10 py-2.5 text-white font-semibold">
                                {iocl?.cta_label}
                            </Link>
                        </div>
                        <div>
                            <Image
                                src={iocl?.section_image || "/images/outcome-img.png"}
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
                <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 items-stretch">
                        <div className="flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="w-[30px] h-[2px] bg-white"></span>
                                    <p className="text-lg font-normal text-white">
                                        {slum?.badge}
                                    </p>
                                </div>
                                <div className="space-y-3 mt-3">
                                    <h2 className="text-white lg:text-4xl md:text-3xl text-2xl font-bold leading-snug">
                                        {slum?.heading}
                                    </h2>
                                    <p className="text-white text-sm md:text-base lg:text-lg leading-relaxed">
                                        {slum?.description}
                                    </p>
                                    <div className="space-y-4 mt-4">
                                        <div className="bg-[#D2FFE3] rounded-[12px] py-4 px-4">
                                            <h5 className="text-[#2D7A4F] text-lg font-semibold">
                                                {slum?.card1_title}</h5>
                                            <p className="text-black text-sm">
                                                {slum?.card1_text}
                                            </p>
                                        </div>
                                        <div className="bg-[#E8F5ED] rounded-[12px] py-4 px-4">
                                            <h5 className="text-[#2D7A4F] text-lg font-semibold">
                                                {slum?.card2_title}
                                            </h5>
                                            <p className="text-black text-sm">
                                                {slum?.card2_text}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="flex flex-col h-full">
                            <div className="relative w-full flex-1 min-h-[250px]">
                                <Image
                                    src={slum?.section_image || "/images/skills-industry-img.png"}
                                    alt="Slum Development"
                                    fill
                                    className="object-cover rounded-[12px]"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-2 mt-3">
                                <div className="bg-[#E8F5ED] rounded-[12px] py-6 px-4">
                                    <h4 className="text-[#2D7A4F] text-3xl font-bold text-center">
                                        {slum?.stat1_value}
                                    </h4>
                                    <p className="text-black text-center text-sm md:text-base">
                                        {slum?.stat1_label}
                                    </p>
                                </div>
                                <div className="bg-[#E8F5ED] rounded-[12px] py-6 px-4">
                                    <h4 className="text-[#2D7A4F] text-3xl font-bold text-center">
                                        {slum?.stat2_value}
                                    </h4>
                                    <p className="text-black text-center text-sm md:text-base">
                                        {slum?.stat2_label}
                                    </p>
                                </div>
                                <div className="bg-[#E8F5ED] rounded-[12px] py-6 px-4">
                                    <h4 className="text-[#2D7A4F] text-3xl font-bold text-center">
                                        {slum?.stat3_value}
                                    </h4>
                                    <p className="text-black text-center text-sm md:text-base">
                                        {slum?.stat3_label}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="bg-white lg:py-16 py-10">
                <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
                        <div>
                            <Image
                                src={arts?.section_image || "/images/arts-culture-img.png"}
                                alt="logo image"
                                width={300}
                                height={300}
                                className="w-full mx-auto"
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="w-[20px] h-[3px] bg-[#2D7A4F]"></span>
                                <p className="text-[#2D7A4F] font-semibold text-base">{arts?.badge}</p>
                            </div>
                            <div className="space-y-2 mt-2">
                                <h2 className="text-black lg:text-4xl md:text-3xl text-xl font-bold leading-snug">
                                    {arts?.heading}
                                </h2>
                                <div>
                                    <p className="text-black text-sm md:text-base lg:text-lg leading-relaxed">
                                        {arts?.description1}
                                    </p>
                                    <p className="text-black text-sm md:text-base lg:text-lg leading-relaxed">
                                        {arts?.description2}
                                    </p>
                                </div>

                            </div>
                            <div className="flex flex-wrap gap-3 sm:gap-4 mt-3">
                                {arts?.tags?.map((tag, index) => (
                                    <div
                                        key={index}
                                        className="bg-white border border-[#2D7A4F] rounded-full px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-2"
                                    >
                                        <span>{tag.emoji}</span>
                                        <p className="text-[#1A4A2E] text-sm sm:text-base lg:text-lg">
                                            {tag.label}
                                        </p>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
