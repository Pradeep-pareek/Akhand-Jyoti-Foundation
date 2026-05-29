"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArtsSection, IoclSection, SensitizingSection, SlumSection } from "@/app/admin/our-programs/page";
type Props = {
    sections?: Record<string, SectionData> | null;
};
type SectionData = IoclSection | SlumSection | ArtsSection | SensitizingSection;

export function Program({ sections }: Props) {
    const sensitizing = sections?.sensitizing_section as SensitizingSection;

    const images =
        sensitizing?.images?.length
            ? sensitizing.images
            : [
                "/images/sensitizing-society.png",
                "/images/skills-industry-img.png",
                "/images/arts-culture-img.png",
            ];

    const [currentImage, setCurrentImage] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);

            setTimeout(() => {
                setCurrentImage((prev) => (prev + 1) % images.length);
                setFade(true);
            }, 500);
        }, 10000);

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <section className="bg-[#E6EBDB] lg:py-16 py-10 mt-10">
            <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 items-center">
                    <div className="w-full flex items-center justify-center">
                        <div className="relative w-full max-w-[600px] h-[250px] md:h-[350px] lg:h-[400px] overflow-hidden rounded-lg">
                            <Image
                                src={images[currentImage]}
                                alt="society image"
                                fill
                                className={`object-cover transition-opacity duration-500 ${fade ? "opacity-100" : "opacity-0"
                                    }`}
                                priority
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-black lg:text-4xl md:text-3xl text-xl font-bold">
                            {sensitizing?.heading}
                        </h2>
                        <div className="space-y-1">
                            <p className="text-black">
                                {sensitizing?.description1}
                            </p>
                            <p className="text-black">
                                {sensitizing?.description2}
                            </p>
                        </div>
                        <Link
                            href={sensitizing?.cta_href || "#"}
                            className="inline-flex items-center bg-[#81BA45] rounded-full px-10 py-2.5 text-white font-semibold">
                            {sensitizing?.cta_label}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Program;