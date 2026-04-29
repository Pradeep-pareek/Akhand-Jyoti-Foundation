"use client";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

const slides = [
    { src: "/images/gallery-img1.png", alt: "Sports program with girls and coach" },
    { src: "/images/gallery-img2.png", alt: "Digital Champions closing ceremony" },
    { src: "/images/gallery-img1.png", alt: "Sports program with girls and coach" },
    { src: "/images/gallery-img2.png", alt: "Health awareness interactive session" },
    { src: "/images/gallery-img1.png", alt: "Sports program with girls and coach" },
    { src: "/images/gallery-img2.png", alt: "Award ceremony with foundation" },
    { src: "/images/gallery-img1.png", alt: "Sports program with girls and coach" },
];

const VISIBLE_COUNT = 7;
const CENTER_INDEX = 3; 

type SlideConfig = {
    offset: number;
    scale: number;
    zIndex: number;
    opacity: number;
    rotateY: number;
};

function getSlideConfig(relIndex: number): SlideConfig {
    const configs: SlideConfig[] = [
        { offset: -290, scale: 0.50, zIndex: 1, opacity: 0.35, rotateY: 50 },  // -3
        { offset: -195, scale: 0.63, zIndex: 2, opacity: 0.52, rotateY: 33 },  // -2
        { offset: -105, scale: 0.78, zIndex: 3, opacity: 0.72, rotateY: 18 },  // -1
        { offset: 0,    scale: 1.00, zIndex: 6, opacity: 1.00, rotateY: 0  },  //  0 center
        { offset: 105,  scale: 0.78, zIndex: 3, opacity: 0.72, rotateY: -18 }, // +1
        { offset: 195,  scale: 0.63, zIndex: 2, opacity: 0.52, rotateY: -33 }, // +2
        { offset: 290,  scale: 0.50, zIndex: 1, opacity: 0.35, rotateY: -50 }, // +3
    ];
    return configs[relIndex] ?? { offset: 0, scale: 0, zIndex: 0, opacity: 0, rotateY: 0 };
}

function getRelativeIndex(i: number, current: number, total: number): number {
    let rel = ((i - current + total) % total);
    if (rel > total / 2) rel -= total;
    return rel + CENTER_INDEX;
}

export default function ImageCarousel() {
    const [current, setCurrent] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const goNext = useCallback(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
    }, []);

    const goPrev = useCallback(() => {
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    }, []);

    const goTo = useCallback((index: number) => {
        setCurrent(index);
    }, []);

    useEffect(() => {
        if (isHovered) return;
        const timer = setInterval(goNext, 3000);
        return () => clearInterval(timer);
    }, [goNext, isHovered]);

    return (
        <section
            style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    height: "260px",
                    perspective: "1400px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {slides.map((slide, i) => {
                    const relIdx = getRelativeIndex(i, current, slides.length);
                    const isVisible = relIdx >= 0 && relIdx < VISIBLE_COUNT;
                    const config = getSlideConfig(relIdx);
                    const isCenter = relIdx === CENTER_INDEX;

                    return (
                        <div
                            key={i}
                            onClick={() => {
                                if (relIdx < CENTER_INDEX) goPrev();
                                else if (relIdx > CENTER_INDEX) goNext();
                            }}
                            style={{
                                position: "absolute",
                                width: "160px",
                                height: "215px",
                                borderRadius: "16px",
                                overflow: "hidden",
                                cursor: isCenter ? "default" : "pointer",
                                opacity: isVisible ? config.opacity : 0,
                                transform: isVisible
                                    ? `translateX(${config.offset}px) scale(${config.scale}) rotateY(${config.rotateY}deg)`
                                    : "translateX(0) scale(0) rotateY(0deg)",
                                zIndex: isVisible ? config.zIndex : 0,
                                transition:
                                    "transform 0.55s cubic-bezier(0.4,0,0.2,1), opacity 0.55s cubic-bezier(0.4,0,0.2,1)",
                                boxShadow: isCenter
                                    ? "0 12px 40px rgba(0,0,0,0.22)"
                                    : "0 2px 12px rgba(0,0,0,0.10)",
                                filter: isCenter ? "none" : "brightness(0.88)",
                                pointerEvents: isVisible ? "auto" : "none",
                            }}
                        >
                            <Image
                                src={slide.src}
                                alt={slide.alt}
                                fill
                                sizes="160px"
                                style={{ objectFit: "cover" }}
                                priority={isCenter}
                            />
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
