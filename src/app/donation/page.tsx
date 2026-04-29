import Form from "./components/Form";
import Image from "next/image";

export default function Home() {
    return (
        <>
            {/*
              ════════════════════════════════════════════════════
              LAYOUT STRATEGY
              ════════════════════════════════════════════════════
              The entire page uses ONE outer two-column grid.

              Left column  → Hero text  +  Support section stacked vertically
              Right column → Form, sticky (follows scroll)

              The hero background image is applied ONLY to the hero text div
              (left top), NOT the whole page. The form card sits on a plain
              white/transparent right column — exactly matching the Figma.

              Why sticky works now:
              • The outer grid wraps ALL content (hero + support section on left).
              • Left column is very tall → right column has room to scroll through.
              • items-start + self-start prevent grid-stretch from killing sticky.
              ════════════════════════════════════════════════════
            */}
            <div className="justify-center flex">
                <div className="lg:mx-5 xl:mx-10 2xl:mx-0 mt-2 pb-10 max-w-[1200px]">
                    <div className="grid lg:grid-cols-2 gap-4 items-start">

                        {/* ══ LEFT COLUMN ══ */}
                        <div className="flex flex-col pt-4">

                            {/* Hero — background image only on this block */}
                            <div
                                className="rounded-tl-[18px] rounded-[18px] border border-black/10 bg-cover bg-center px-6 lg:px-10 pt-10 lg:pt-14 pb-10 lg:pb-14"
                                style={{ backgroundImage: "url('/images/donation-hero-img.png')" }}>
                                <span className="bg-[#E8F5ED] inline-flex py-1.5 px-5 rounded-full items-center gap-2 mb-4">
                                    <Image
                                        src="/images/making-impact-icon.png"
                                        alt="impact icon"
                                        width={18}
                                        height={18}
                                    />
                                    <p className="text-[#2D7A4F] text-sm font-semibold">80G Tax Benefits Available</p>
                                </span>

                                <h1 className="text-3xl text-black md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                                    Lighting Lives, One Step{" "}
                                    <span className="text-[#81BA45]">at a Time</span>
                                </h1>

                                <p className="text-gray-700 text-sm md:text-base lg:text-lg mb-6 max-w-[85%]">
                                    Join AkhandJyoti Foundation in creating inclusive, impactful
                                    and sustainable futures for girls and communities across India
                                    — through health, education, and empowerment.
                                </p>

                                <button className="bg-[#81BA45] text-white text-base px-8 py-2.5 rounded-full hover:bg-[#4a8a2e] transition-colors cursor-pointer">
                                    Contact us
                                </button>
                            </div>

                            {/* Support section — white background, below hero */}
                            <div className="bg-white py-10 lg:py-14 px-6 lg:px-10">
                                <h2 className="text-black lg:text-4xl md:text-3xl text-2xl font-bold leading-snug mb-4">
                                    Your Support Can Build{" "}
                                    <span className="text-[#81BA45]">a Brighter Future</span>
                                </h2>
                                <p className="text-black text-sm md:text-base lg:text-lg leading-relaxed mb-3">
                                    In India, millions still lack access to basic healthcare, education, and growth
                                    opportunities. With over 23 million girls dropping out of school due to menstruation
                                    challenges and 61% at risk of cervical cancer due to low awareness, urgent action is needed.
                                </p>
                                <p className="text-black text-sm md:text-base lg:text-lg leading-relaxed">
                                    AkhandJyoti Foundation addresses this through community-driven initiatives in health
                                    awareness, digital education, and women's empowerment—creating lasting impact, one
                                    community at a time.
                                </p>

                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    <div className="bg-white rounded-[12px] py-5 px-4 border border-black/20">
                                        <Image src="/images/health-care-love-svgrepo.png" alt="Health Care" width={50} height={50} className="mx-auto" />
                                        <div className="mt-2">
                                            <h3 className="text-black text-center text-lg font-semibold">Health Care</h3>
                                            <p className="text-black text-center text-sm mt-1">Educating communities about sanitation, menstrual hygiene, and disease prevention to build healthier lives.</p>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-[12px] py-5 px-4 border border-black/20">
                                        <Image src="/images/women-icon-image.png" alt="Women Power" width={50} height={50} className="mx-auto" />
                                        <div className="mt-2">
                                            <h3 className="text-black text-center text-lg font-semibold">Women Power</h3>
                                            <p className="text-black text-center text-sm mt-1">Empowering women through education, awareness, and skill development for a confident future.</p>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-[12px] py-5 px-4 border border-black/20">
                                        <Image src="/images/education-icon-img.png" alt="Education" width={50} height={50} className="mx-auto" />
                                        <div className="mt-2">
                                            <h3 className="text-black text-center text-lg font-semibold">Education</h3>
                                            <p className="text-black text-center text-sm mt-1">Providing access to quality education, digital learning, and resources for underprivileged children.</p>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-[12px] py-5 px-4 border border-black/20">
                                        <Image src="/images/community-svgrepo-img.png" alt="Community" width={50} height={50} className="mx-auto" />
                                        <div className="mt-2">
                                            <h3 className="text-black text-center text-lg font-semibold">Community</h3>
                                            <p className="text-black text-center text-sm mt-1">Creating sustainable solutions to uplift communities through collective action and support.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        {/* ══ END LEFT COLUMN ══ */}


                        {/* ══ RIGHT COLUMN — Sticky Form ══
                        sticky top-[80px] : offset from top = approx navbar height.
                                            Adjust this value to match your navbar height.
                        self-start        : REQUIRED — stops grid stretching this column
                                            to match left column height (which would
                                            make the column exactly as tall as the form,
                                            leaving zero scroll room → sticky breaks).
                    -->*/}
                        <div className="sticky top-[80px] self-start">
                            <Form />
                        </div>

                    </div>
                </div>
            </div>

        </>
    );
}
