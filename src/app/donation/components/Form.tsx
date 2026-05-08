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

    // Form fields
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        pan: "",
        city: "",
    });

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

        if (num >= MIN_AMOUNT && num <= MAX_AMOUNT) {
            setSelectedAmount(num);
        }
    };

    const handleCustomBlur = () => {
        if (!customInput || Number(customInput) < MIN_AMOUNT) {
            setIsCustom(false);
            setCustomInput("");
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="flex items-center justify-center p-3 sm:p-4 font-sans">
            <div
                className="w-full max-w-md shadow-xl pt-[4px] rounded-[24px] bg-gradient-to-r from-[#7BBE4A] via-[#a8d87a] to-[#5a9e2f]"
                style={{
                    boxShadow:
                        "0 8px 40px 0 rgba(80,160,60,0.10), 0 2px 8px 0 rgba(0,0,0,0.06)",
                }}>
                <div className="px-5 sm:px-6 pt-5 bg-[#F4F9F1] pb-6 rounded-[24px] flex flex-col gap-4">
                    <div className="">
                        <div className="mx-auto flex justify-center">
                            <div className="relative w-25 h-25">
                                <Image
                                    src="/images/donation-form-image.svg"
                                    alt="Donation illustration"
                                    fill
                                    className="object-contain drop-shadow-md mx-auto"
                                    priority
                                />
                            </div>
                        </div>
                        <h2 className="text-center text-[1.05rem] sm:text-[1.18rem] font-semibold text-[#1a3a10] leading-snug tracking-tight">
                            Help us build a brighter future
                        </h2>
                    </div>
                    <div className="flex flex-col gap-2">
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full rounded-xl border border-[#d6e8c8] bg-white px-4 py-3 text-sm outline-none focus:border-[#7BBE4A] focus:ring-2 focus:ring-[#7BBE4A]/20 text-black"
                        />
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full rounded-xl border border-[#d6e8c8] bg-white px-4 py-3 text-sm outline-none focus:border-[#7BBE4A] focus:ring-2 focus:ring-[#7BBE4A]/20 text-black"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full rounded-xl border border-[#d6e8c8] bg-white px-4 py-3 text-sm outline-none focus:border-[#7BBE4A] focus:ring-2 focus:ring-[#7BBE4A]/20 text-black"
                        />
                        <input
                            type="text"
                            name="pan"
                            placeholder="PAN Number"
                            value={formData.pan}
                            onChange={handleInputChange}
                            className="w-full uppercase rounded-xl border border-[#d6e8c8] bg-white px-4 py-3 text-sm outline-none focus:border-[#7BBE4A] focus:ring-2 focus:ring-[#7BBE4A]/20 text-black"
                        />
                        <input
                            type="text"
                            name="city"
                            placeholder="City"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full rounded-xl border border-[#d6e8c8] bg-white px-4 py-3 text-sm outline-none focus:border-[#7BBE4A] focus:ring-2 focus:ring-[#7BBE4A]/20 text-black"
                        />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <div className="relative h-10 flex items-center">
                            <div className="absolute inset-y-0 left-0 right-0 flex items-center">
                                <div className="w-full h-3 rounded-full bg-[#d9eed0]">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-[#7BBE4A] to-[#5a9e2f]"
                                        style={{
                                            width: `${sliderPercent}%`,
                                        }}
                                    />
                                </div>
                            </div>

                            <div
                                className="absolute flex items-center justify-center pointer-events-none"
                                style={{
                                    left: `calc(${sliderPercent}% - 14px)`,
                                    zIndex: 10,
                                }}
                            >
                                <span className="text-[22px]">❤️</span>
                            </div>

                            <input
                                type="range"
                                min={MIN_AMOUNT}
                                max={MAX_AMOUNT}
                                step={100}
                                value={selectedAmount}
                                onChange={handleSlider}
                                className="absolute w-full opacity-0 h-10 cursor-pointer z-20"
                            />
                        </div>

                        <div className="flex items-center gap-1 justify-between">
                            <span className="text-sm sm:text-lg font-bold text-[#1a3a10]">
                                {isCustom ? (
                                    <span className="flex items-center gap-1">
                                        ₹
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            inputMode="numeric"
                                            value={customInput}
                                            onChange={handleCustomChange}
                                            onBlur={handleCustomBlur}
                                            placeholder="Enter amount"
                                            className="w-28 sm:w-32 bg-transparent border-b-2 border-[#7BBE4A] focus:outline-none"
                                        />
                                    </span>
                                ) : (
                                    `₹${formatINR(selectedAmount)}`
                                )}
                            </span>

                            <button
                                onClick={handleCustomClick}
                                className={`
                  flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-[11px] sm:text-sm font-semibold
                  transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-blue-400/50
                  ${isCustom
                                        ? "bg-blue-500 text-white border-blue-500 shadow"
                                        : "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:border-blue-400"
                                    }`}>
                                Custom
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button className="flex-1 py-3 rounded-2xl font-bold text-white text-sm bg-gradient-to-br from-[#7BBE4A] to-[#5a9e2f] shadow-md hover:shadow-lg">
                            Donate Once
                        </button>

                        <button className="flex-1 py-3 rounded-2xl font-bold text-[#2d5a14] text-sm border-2 border-[#7BBE4A] bg-transparent hover:bg-[#eaf4df]">
                            Donate Monthly
                        </button>
                    </div>

                    {/* Disclaimer */}
                    <p className="text-center text-[0.68rem] sm:text-[0.72rem] text-[#7a9e6a] leading-relaxed px-1">
                        Your contribution not only creates impact but also
                        offers 50% tax benefits under Section 80G.
                    </p>
                </div>
            </div>
        </div>
    );
}