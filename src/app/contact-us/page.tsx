"use client";
import HeroSection from "./components/Herosection";
// import Chairman from "./components/Offerings";
import Offerings from "./components/Offerings";
import Member from "./components/Member";
import { IconMail } from '@tabler/icons-react';
import { IconMapPin } from '@tabler/icons-react';
import { IconPhoneCall } from '@tabler/icons-react';

import Link from "next/link";
import { IconHeartFilled } from "@tabler/icons-react";
import Image from "next/image";
import { Check } from "lucide-react";
import { useState } from "react";

export default function Home() {

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
    });
    const [loader, setLoader] = useState(false);
    const submitForm = async () => {
        setLoader(true);
        const response = await fetch("/api/contact-us", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        });

        const data = await response.json();

        if (data.success) {

            alert("Message sent successfully");

            setForm({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                message: "",
            });

        } else {
            alert(data.message);
        }
        setLoader(false);
    };
    return (
        <>
            <HeroSection />
            <section className="bg-white lg:py-16 py-10">
                <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-12 lg:gap-16">
                        <div>
                            <h2 className="text-black lg:text-4xl md:text-3xl text-xl font-bold leading-snug">Get in touch</h2>
                            <p className="text-black text-sm md:text-base lg:text-lg leading-relaxed">
                                We'd love to hear from you. Please fill out this form.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 mt-5">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[#000] font-medium text-base">First name</label>
                                    <input
                                        type="text"
                                        placeholder="First name"
                                        value={form.firstName}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                firstName: e.target.value
                                            })
                                        }
                                        className="bg-white border border-[#D0D5DD] text-[#000] rounded-xl px-4 py-2.5 text-base outline-none focus:border-[#81BA45] w-full"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[#000] font-medium text-base">Last name</label>
                                    <input
                                        type="text"
                                        value={form.lastName}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                lastName: e.target.value
                                            })
                                        }
                                        placeholder="Last name"
                                        className="bg-white border border-[#D0D5DD] text-[#000] rounded-xl px-4 py-2.5 text-base outline-none focus:border-[#81BA45] w-full"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 mb-4">
                                <label className="text-[#000] font-medium text-base">Email</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            email: e.target.value
                                        })
                                    }
                                    placeholder="you@company.com"
                                    className="bg-white border border-[#D0D5DD] text-[#000] rounded-xl px-4 py-2.5 text-base outline-none focus:border-[#81BA45] w-full"
                                />
                            </div>
                            <div className="flex flex-col gap-2 mb-4">
                                <label className="text-[#000] font-medium text-base">Phone number</label>
                                <div className="flex bg-white border border-[#D0D5DD] text-[#000]  rounded-xl overflow-hidden focus-within:border-[#81BA45]">
                                    <div className="flex items-center px-3 border-r border-rose-100">
                                        <select className="bg-transparent  text-base outline-none py-3">
                                            <option value="IN">IN +91</option>
                                            <option value="US">US +1</option>
                                            <option value="UK">UK +44</option>
                                        </select>
                                    </div>
                                    <input
                                        type="tel"
                                        value={form.phone}
                                        onChange={(e) => {
                                            if (isNaN(Number(e.target.value))) return;
                                            setForm({
                                                ...form,
                                                phone: e.target.value?.slice(0, 10)
                                            })
                                        }
                                        }
                                        placeholder="9999999999"
                                        className="flex-1 px-4 py-2.5  text-base outline-none bg-transparent"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 mb-2">
                                <label className="text-base font-medium text-[#000]">Message</label>
                                <textarea
                                    placeholder="Leave us a message..."
                                    value={form.message}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            message: e.target.value?.slice(0, 300)
                                        })
                                    }
                                    rows={4}
                                    className="bg-white text-[#000] border border-[#D0D5DD] rounded-xl px-4 py-2.5 text-base outline-none focus:border-[#81BA45] resize-none w-full"
                                />
                            </div>
                            <div className="flex items-center gap-3 mb-5">
                                <input
                                    type="checkbox"
                                    id="privacy"
                                    defaultChecked
                                    className="accent-[#81BA45] w-4 h-4 cursor-pointer"
                                />
                                <label htmlFor="privacy" className="text-base text-[#000]/70 cursor-pointer">
                                    You agree to our friendly privacy policy.
                                </label>
                            </div>
                            <button
                                disabled={loader}
                                onClick={submitForm}
                                className={`w-full bg-[#81BA45] ${loader ? 'cursor-not-allowed' : 'hover:bg-[#6a9d3a]'} text-white font-semibold rounded-xl py-3 cursor-pointer text-lg transition}`}
                            >
                                {loader ? "Sending..." : "Send Message"}
                            </button>
                        </div>
                        <div>
                            <h2 className="text-black lg:text-4xl md:text-3xl text-xl font-bold leading-snug">We’d love to hear from you</h2>
                            <p className="text-black text-sm md:text-base lg:text-lg leading-relaxed">
                                Need something cleared up? Here are our most frequently asked questions.
                            </p>
                            <div className="grid grid-cols-2 gap-8 lg:mt-8 mt-6">
                                <div className="flex flex-col gap-2">
                                    <div className="w-14 h-14 rounded-[12px] bg-[#FFF4EC] flex items-center justify-center text-xl">
                                        <IconMail className="text-[#FF2E27]" size={30} stroke={2} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#000] text-xl">Email</h3>
                                        <p className="text-[#000]/70 text-base">Our friendly team is here to help.</p>
                                    </div>
                                    <a
                                        href="mailto:akhandjyotifoundation@gmail.com"
                                        className="text-[#81BA45] text-base font-medium hover:underline break-all">
                                        akhandjyotifoundation@gmail.com
                                    </a>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="w-14 h-14 rounded-[12px] bg-[#E6F7F2] flex items-center justify-center text-xl">
                                        <IconPhoneCall className="text-[#6CEA96]" size={30} stroke={2} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#000] text-xl">Phone</h3>
                                        <p className="text-[#000]/70 text-base">Mon–Fri from 8am to 5pm.</p>
                                    </div>
                                    <a
                                        href="tel:+918800452255"
                                        className="text-[#81BA45] text-base font-medium hover:underline"
                                    >
                                        +91 8800452255
                                    </a>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="w-14 h-14 rounded-[12px] bg-[#F6F2FF] flex items-center justify-center text-xl">
                                        <IconMapPin className="text-[#9F70FC]" size={30} stroke={2} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#000] text-xl">Office</h3>
                                        <p className="text-[#000]/70 text-base">Come say hello at our office HQ.</p>
                                    </div>
                                    <a
                                        href="https://maps.google.com"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[#81BA45] text-base font-medium hover:underline"
                                    >
                                        C-25, MIQB Centre, Sector – 58 <br />
                                        Noida, Uttar Pradesh – 201301
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section className="bg-[#F3F5EE]">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden">
                        <div className="w-full min-h-[280px] md:min-h-[420px]">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.693719250574!2d77.3596834740932!3d28.60896378515312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce579e698623b%3A0xfc1f7dc8526f57e4!2sMiQB%20Executive%20Coworking%20Space!5e0!3m2!1sen!2sin!4v1777095668948!5m2!1sen!2sin"
                                className="w-full h-full py-10 min-h-[280px] md:min-h-[420px] border-0"
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>

                        <div className="flex items-end justify-center min-h-[260px] md:min-h-[420px]">
                            <img
                                src="/images/contact-person-img.png"
                                alt="Contact person"
                                className="max-h-[260px] pt-10 px-4 md:max-h-[420px] object-contain bg-[#81BA45]/50 "
                            />
                        </div>
                    </div>
                </div>
            </section>



        </>
    );
}
