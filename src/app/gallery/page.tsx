import Herosection from "./components/Herosection";
import Gallery from "./components/Gallery";
import Image from "next/image";

export default function Home() {
    return (
        <>
            <Herosection />
            <Gallery />
            <section className="bg-[#F3F5EE] lg:py-16 py-10">
                <div className="mx-5 xl:mx-10 2xl:mx-0">
                    <div>
                        <h2 className="text-black lg:text-4xl md:text-3xl text-xl font-bold leading-snug text-center">
                            Be Part of the Change
                        </h2>
                        <p className="text-black text-sm md:text-base lg:text-lg text-center leading-relaxed lg:w-[60%] mx-auto">
                            Whether you want to volunteer, donate, or simply spread the word — every contribution brings us closer to a more equitable society.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-6 mt-8">
                        <div className="bg-[#FFFFFF] rounded-[10px] border-1 border-[#000]/10 py-6 px-4 space-y-2">
                            <div className="w-20 h-20 rounded-full justify-center bg-[#81BA45]/20 flex items-center mx-auto">
                                <Image
                                    src="/images/lives-touched-img.png"
                                    alt="logo image"
                                    width={50}
                                    height={50}
                                    className="mx-auto"
                                />
                            </div>
                            <div>
                                <h4 className="text-black md:text-2xl text-xl text-center font-bold">12,000+</h4>
                                <p className="text-[#000] text-center text-lg font-medium">Lives Touched</p>
                            </div>
                        </div>
                        <div className="bg-[#FFFFFF] rounded-[10px] border-1 border-[#000]/10 py-6 px-4 space-y-2">
                            <div className="w-20 h-20 rounded-full justify-center bg-[#81BA45]/20 flex items-center mx-auto">
                                <Image
                                    src="/images/programs-run-icon.png"
                                    alt="logo image"
                                    width={50}
                                    height={50}
                                    className="mx-auto"
                                />
                            </div>
                            <div>
                                <h4 className="text-black md:text-2xl text-xl text-center font-bold">80+</h4>
                                <p className="text-[#000] text-center text-lg font-medium">Programs Run</p>
                            </div>
                        </div>
                        <div className="bg-[#FFFFFF] rounded-[10px] border-1 border-[#000]/10 py-6 px-4 space-y-2">
                            <div className="w-20 h-20 rounded-full justify-center bg-[#81BA45]/20 flex items-center mx-auto">
                                <Image
                                    src="/images/districts-reached-icon.png"
                                    alt="logo image"
                                    width={50}
                                    height={50}
                                    className="mx-auto"
                                />
                            </div>
                            <div>
                                <h4 className="text-black md:text-2xl text-xl text-center font-bold">15</h4>
                                <p className="text-[#000] text-center text-lg font-medium">Districts Reached</p>
                            </div>
                        </div>
                        <div className="bg-[#FFFFFF] rounded-[10px] border-1 border-[#000]/10 py-6 px-4 space-y-2">
                            <div className="w-20 h-20 rounded-full justify-center bg-[#81BA45]/20 flex items-center mx-auto">
                                <Image
                                    src="/images/volunteers-icon.png"
                                    alt="logo image"
                                    width={50}
                                    height={50}
                                    className="mx-auto"
                                />
                            </div>
                            <div>
                                <h4 className="text-black md:text-2xl text-xl text-center font-bold">200+</h4>
                                <p className="text-[#000] text-center text-lg font-medium">Volunteers</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
