import Form from "./Form";
import Image from "next/image";

export default function Home() {
    return (
        <>
            <div className="bg-white">
                <div className="w-full  mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="lg:grid lg:grid-cols-[1fr_390px] xl:grid-cols-[1fr_420px] lg:gap-0 lg:items-start mt-2">

                        <div>
                            <div className="relative z-10">
                                <div
                                    className="absolute inset-0 lg:right-[-390px] xl:right-[-420px] rounded-[18px] border border-black/10 bg-cover bg-center -z-10"
                                    style={{ backgroundImage: "url('/images/donation-hero-img.png')" }}
                                />
                                <div className="px-6 lg:px-10 pt-10 lg:pt-14 pb-10 lg:pb-14">
                                    <span className="bg-[#E8F5ED] inline-flex py-1.5 px-5 rounded-full items-center gap-2 mb-4">
                                        <Image src="/images/making-impact-icon.png" alt="impact icon" width={18} height={18} />
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

                                    <div className="lg:hidden w-full max-w-[440px] mx-auto mt-8">
                                        <Form />
                                    </div>
                                </div>
                            </div>

                            <div className="lg:py-16 py-10">
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
                                    <div className="rounded-[12px] py-5 px-4 border border-black/20">
                                        <Image src="/images/health-care-love-svgrepo.png" alt="Health Care" width={50} height={50} className="mx-auto" />
                                        <div className="mt-2">
                                            <h3 className="text-black text-center text-lg font-semibold">Health Care</h3>
                                            <p className="text-black text-center text-sm mt-1">Educating communities about sanitation, menstrual hygiene, and disease prevention to build healthier lives.</p>
                                        </div>
                                    </div>
                                    <div className="rounded-[12px] py-5 px-4 border border-black/20">
                                        <Image src="/images/women-icon-image.png" alt="Women Power" width={50} height={50} className="mx-auto" />
                                        <div className="mt-2">
                                            <h3 className="text-black text-center text-lg font-semibold">Women Power</h3>
                                            <p className="text-black text-center text-sm mt-1">Empowering women through education, awareness, and skill development for a confident future.</p>
                                        </div>
                                    </div>
                                    <div className="rounded-[12px] py-5 px-4 border border-black/20">
                                        <Image src="/images/education-icon-img.png" alt="Education" width={50} height={50} className="mx-auto" />
                                        <div className="mt-2">
                                            <h3 className="text-black text-center text-lg font-semibold">Education</h3>
                                            <p className="text-black text-center text-sm mt-1">Providing access to quality education, digital learning, and resources for underprivileged children.</p>
                                        </div>
                                    </div>
                                    <div className="rounded-[12px] py-5 px-4 border border-black/20">
                                        <Image src="/images/community-svgrepo-img.png" alt="Community" width={50} height={50} className="mx-auto" />
                                        <div className="mt-2">
                                            <h3 className="text-black text-center text-lg font-semibold">Community</h3>
                                            <p className="text-black text-center text-sm mt-1">Creating sustainable solutions to uplift communities through collective action and support.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>{/* end left col */}

                        {/* RIGHT COLUMN — sticky form, desktop only */}
                        <div className="hidden lg:block sticky top-6 self-start pt-4 px-4 z-19">
                            <Form />
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}