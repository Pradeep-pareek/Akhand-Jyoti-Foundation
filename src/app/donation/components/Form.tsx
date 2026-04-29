"use client";

import Image from "next/image";
import { useState, useRef } from "react";

const PRESET_AMOUNTS = [500, 1000, 2500, 5000, 10000];
const MIN_AMOUNT = 100;
const MAX_AMOUNT = 50000;

function formatINR(amount: number) {
    return new Intl.NumberFormat("en-IN").format(amount);
}

export default function DonationCard() {
    const [selectedAmount, setSelectedAmount] = useState(500);
    const [isCustom, setIsCustom] = useState(false);
    const [customInput, setCustomInput] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const sliderPercent = Math.round(
        ((selectedAmount - MIN_AMOUNT) / (MAX_AMOUNT - MIN_AMOUNT)) * 100
    );

    const handlePreset = (amount: number) => {
        setSelectedAmount(amount);
        setIsCustom(false);
        setCustomInput("");
    };

    const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        setSelectedAmount(val);
        setIsCustom(false);
        setCustomInput("");
    };

    const handleCustomClick = () => {
        setIsCustom(true);
        setTimeout(() => inputRef.current?.focus(), 50);
    };

    const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, "");
        setCustomInput(raw);
        const num = Number(raw);
        if (num >= MIN_AMOUNT && num <= MAX_AMOUNT) setSelectedAmount(num);
    };

    const handleCustomBlur = () => {
        if (!customInput || Number(customInput) < MIN_AMOUNT) {
            setIsCustom(false);
            setCustomInput("");
        }
    };

    return (
        <div className="flex items-center justify-end p-4 font-sans">
            {/*
                FIX: Removed `overflow-hidden` from this wrapper.
                `overflow: hidden` on ANY ancestor of a sticky element cancels
                the stickiness — the browser clips the scroll context, so
                `position: sticky` has nothing to stick within.
                The top gradient bar is now handled with a separate div instead.
            */}
            <div
                className="w-full max-w-md bg-[#F4F9F1] rounded-[24px] shadow-xl"
                style={{
                    boxShadow:
                        "0 8px 40px 0 rgba(80,160,60,0.10), 0 2px 8px 0 rgba(0,0,0,0.06)",
                }}
            >
                {/* Top gradient bar — replaces the one lost when overflow-hidden was removed */}
                <div className="h-1.5 w-full bg-gradient-to-r from-[#7BBE4A] via-[#a8d87a] to-[#5a9e2f] rounded-t-[24px]" />

                <div className="px-6 pt-6 pb-7 flex flex-col gap-5">

                    {/* Illustration */}
                    <div className="flex justify-center">
                        <div className="relative w-44 h-36 sm:w-52 sm:h-40">
                            <Image
                                src="/images/form-image.png"
                                alt="Donation illustration showing a diverse group of people"
                                fill
                                className="object-contain drop-shadow-md"
                                priority
                            />
                        </div>
                    </div>

                    {/* Heading */}
                    <h2 className="text-center text-[1.18rem] sm:text-[1.28rem] font-semibold text-[#1a3a10] leading-snug tracking-tight">
                        Help us build a brighter future
                    </h2>

                    {/* Preset Amount Buttons */}
                    <div className="grid grid-cols-4 gap-2">
                        {PRESET_AMOUNTS.slice(0, 4).map((amt) => (
                            <button
                                key={amt}
                                onClick={() => handlePreset(amt)}
                                className={`
                  py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                  border focus:outline-none focus:ring-2 focus:ring-[#7BBE4A]/60
                  ${!isCustom && selectedAmount === amt
                                        ? "bg-[#7BBE4A] text-white border-[#7BBE4A] shadow-md scale-[1.04]"
                                        : "bg-white text-[#2d5a14] border-[#d4e8c2] hover:border-[#7BBE4A] hover:bg-[#eaf4df]"
                                    }
                `}
                            >
                                ₹{formatINR(amt)}
                            </button>
                        ))}

                        <div className="col-span-4 grid grid-cols-2 gap-2">
                            {PRESET_AMOUNTS.slice(3).map((amt) => (
                                <button
                                    key={amt + "-row2"}
                                    onClick={() => handlePreset(amt)}
                                    className={`
                    py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                    border focus:outline-none focus:ring-2 focus:ring-[#7BBE4A]/60
                    ${!isCustom && selectedAmount === amt
                                            ? "bg-[#7BBE4A] text-white border-[#7BBE4A] shadow-md scale-[1.04]"
                                            : "bg-white text-[#2d5a14] border-[#d4e8c2] hover:border-[#7BBE4A] hover:bg-[#eaf4df]"
                                        }
                  `}
                                >
                                    ₹{formatINR(amt)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Slider */}
                    <div className="flex flex-col gap-3">
                        <div className="relative h-10 flex items-center">
                            <div className="absolute inset-y-0 left-0 right-0 flex items-center">
                                <div className="w-full h-3 rounded-full bg-[#d9eed0]">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-[#7BBE4A] to-[#5a9e2f] transition-all duration-150"
                                        style={{ width: `${sliderPercent}%` }}
                                    />
                                </div>
                            </div>

                            <div
                                className="absolute flex items-center justify-center pointer-events-none"
                                style={{
                                    left: `calc(${sliderPercent}% - 14px)`,
                                    zIndex: 10,
                                    transition: "left 0.15s",
                                }}
                            >
                                <span className="text-[22px] drop-shadow-sm select-none">❤️</span>
                            </div>

                            <input
                                type="range"
                                min={MIN_AMOUNT}
                                max={MAX_AMOUNT}
                                step={100}
                                value={selectedAmount}
                                onChange={handleSlider}
                                className="absolute w-full opacity-0 h-10 cursor-pointer z-20"
                                aria-label="Donation amount slider"
                            />
                        </div>

                        {/* Amount display + Custom button */}
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-1">
                                <span className="text-2xl font-bold text-[#1a3a10] tracking-tight">
                                    {isCustom ? (
                                        <span className="flex items-center gap-1">
                                            <span className="text-2xl font-bold text-[#1a3a10]">₹</span>
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                inputMode="numeric"
                                                value={customInput}
                                                onChange={handleCustomChange}
                                                onBlur={handleCustomBlur}
                                                placeholder="Enter amount"
                                                className="w-32 bg-transparent border-b-2 border-[#7BBE4A] focus:outline-none text-2xl font-bold text-[#1a3a10] placeholder:text-[#aac98a] placeholder:text-base"
                                            />
                                        </span>
                                    ) : (
                                        `₹${formatINR(selectedAmount)}`
                                    )}
                                </span>
                            </div>

                            <button
                                onClick={handleCustomClick}
                                className={`
                  flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold
                  transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-blue-400/50
                  ${isCustom
                                        ? "bg-blue-500 text-white border-blue-500 shadow"
                                        : "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:border-blue-400"
                                    }
                `}
                            >
                                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 2l3 3-8 8H3v-3L11 2z" />
                                </svg>
                                Custom
                            </button>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button className="flex-1 py-3.5 rounded-2xl font-bold text-white text-[1rem] bg-gradient-to-br from-[#7BBE4A] to-[#5a9e2f] shadow-md hover:shadow-lg hover:from-[#8dcf57] hover:to-[#4e8e29] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#7BBE4A]/60">
                            Donate Once
                        </button>
                        <button className="flex-1 py-3.5 rounded-2xl font-bold text-[#2d5a14] text-[1rem] border-2 border-[#7BBE4A] bg-transparent hover:bg-[#eaf4df] hover:border-[#5a9e2f] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#7BBE4A]/60">
                            Donate Monthly
                        </button>
                    </div>

                    {/* Disclaimer */}
                    <p className="text-center text-[0.72rem] text-[#7a9e6a] leading-relaxed px-1">
                        Your contribution not only creates impact but also offers 50% tax
                        benefits under Section 80G. Please note that we accept only
                        compliant donations—no cash or foreign contributions.
                    </p>
                </div>
            </div>
        </div>
    );
}
