"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import CountUp from "react-countup";

const statsData = [
    { id: 1, value: 635, label: "SKILL DEVELOPMENT" },
    { id: 2, value: 19727, label: "SKILL ASSESSMENT" },
    { id: 3, value: 5060, label: "EDUCATION" },
    { id: 4, value: 10850, label: "HEALTH & WELLBEING" },
    { id: 5, value: 1200, label: "WOMEN ENTREPRENEURSHIP" },
    { id: 6, value: 4940, label: "COMMUNITY DEVELOPMENT" },
    { id: 7, value: 42412, label: "COMMUNITY MEMBERS" },
];

export default function StatsSection() {
    const [startCount, setStartCount] = useState(false);
    const sectionRef = useRef(null);

    // 👇 Detect scroll (Intersection Observer)
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setStartCount(true);
                }
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={sectionRef} className="mt-10">

            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 md:gap-8 gap-5">
                {statsData.slice(0, 4).map((item) => (
                    <Card key={item.id} item={item} startCount={startCount} />
                ))}
            </div>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 md:gap-8 gap-5 mt-8">
                {statsData.slice(4).map((item) => (
                    <Card key={item.id} item={item} startCount={startCount} />
                ))}
            </div>

        </div>
    );
}

function Card({ item, startCount }: any) {
    return (
        <div className="bg-white border border-[#000]/10 rounded-[16px] py-6 px-4">
            <div className="flex flex-col items-center">
                <div className="bg-[#81BA45]/20 rounded-full p-3 flex items-center justify-center">
                    <Image
                        src="/images/skill-development.png"
                        alt="logo image"
                        width={45}
                        height={45}
                        className="z-10 relative"
                    />
                </div>
                <h3 className="text-center text-[#000] font-bold text-2xl mt-4">
                    {startCount && (
                        <CountUp end={item.value} duration={2} suffix="+" />
                    )}
                </h3>
                <p className="text-center text-base text-[#000]/70">
                    {item.label}
                </p>

            </div>
        </div>
    );
}