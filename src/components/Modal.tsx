"use client";

import { IconArrowRight, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import Image from 'next/image'

export default function Modal() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setShow(true);
        }, 600000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {show && (
                <div className="fixed inset-0 bg-[#222222]/90 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="grid lg:grid-cols-3 grid-cols-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="bg-gradient-to-br from-[#F70D28] to-[#8789FF] pt-10 lg:px-6  rounded-tl-2xl rounded-bl-2xl lg:flex flex-col justify-between  hidden">
                            <div>
                                <h2 className="lg:text-3xl text-2xl font-semibold text-white">We’d Love to Hear from You</h2>
                                <p className="text-base leading-5 text-white font-normal">Have questions, feedback, or just want to say hello? We're always here to connect. Drop us a message and we'll get back to you as soon as possible.</p>
                            </div>
                            <div>
                                <Image
                                    src="/images/modal-image.webp"
                                    alt="Profile Picture"
                                    width={740}
                                    height={587}
                                />
                            </div>
                        </div>
                        <div className="col-span-2 ">
                            <div className="bg-white lg:py-10 py-6 lg:px-8 px-6 rounded-2xl lg:rounded-tr-2xl lg:rounded-br-2xl lg:rounded-tl-none lg:rounded-bl-none shadow-lg h-full">
                                <div className="flex justify-end">
                                    <button onClick={() => setShow(false)} className=" inline-block cursor-pointer bg-[#F70D28]/40 rounded-full p-1.5 ">
                                        <IconX className="text-white w-5 h-5 " stroke={2} />
                                    </button>
                                </div>
                                <div className="w-full">
                                    <form action="" className="w-full">
                                        <div className="space-y-6">
                                            <div>
                                                <h2 className="lg:text-4xl text-3xl font-semibold">Get in touch </h2>
                                                <p className="text-base font-normal text-[#222222]/80">You can reach us anytime</p>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="lg:flex gap-4 lg:space-y-0 space-y-4">
                                                    <input className="w-full px-4 py-2 border border-[#222222]/10 rounded-[8px]" type="text" placeholder="First name" />
                                                    <input className="w-full px-4 py-2 border border-[#222222]/10 rounded-[8px]" type="text" placeholder="Last name" />
                                                </div>
                                                <div>
                                                    <input className="w-full px-4 py-2 border border-[#222222]/10 rounded-[8px]" type="number" placeholder="Mobile number" name="" id="" />
                                                </div>
                                                <div>
                                                    <input className="w-full px-4 py-2 border border-[#222222]/10 rounded-[8px] " type="mail" placeholder="Mail address" />
                                                </div>
                                                <div>
                                                    <textarea className="w-full px-4 py-2 border border-[#222222]/10 rounded-[8px] max-h-[100px] min-h-[100px]" name="" placeholder="Your massage" id=""></textarea>
                                                </div>
                                                <div>
                                                    <button className="px-8 flex gap-2 py-2.5 bg-[#222222] text-white rounded-sm cursor-pointer">
                                                        Submit <IconArrowRight stroke={1.5} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}



// .......... With Annimation Momdal .......

// "use client";

// import { IconArrowRight, IconX } from "@tabler/icons-react";
// import { useEffect, useState } from "react";

// export default function Modal() {
//     const [show, setShow] = useState(false);

//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setShow(true);
//         }, 30000);

//         return () => clearTimeout(timer);
//     }, []);

//     return (
//         <div
//             className={`fixed inset-0 z-50 flex justify-center items-center bg-[#222222]/90 transition-opacity duration-500 ${
//                 show ? "opacity-100 visible" : "opacity-0 invisible"
//             }`}
//         >
//             <div
//                 className={`transform transition-all duration-500 ${
//                     show ? "scale-100 opacity-100" : "scale-90 opacity-0"
//                 } grid lg:grid-cols-3 grid-cols-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4`}
//             >
//                 <div className="bg-gradient-to-br from-[#F70D28] to-[#8789FF] pt-10 lg:px-6 rounded-tl-2xl rounded-bl-2xl lg:flex flex-col justify-between hidden">
//                     <div>
//                         <h2 className="lg:text-3xl text-2xl font-medium text-white">Get in touch</h2>
//                         <p className="text-base leading-5 text-white font-normal">
//                             Lorem Ipsum is simply dummy text of the printing and typesetting industry.
//                         </p>
//                     </div>
//                     <div>
//                         <img src="/images/modal-image.webp" alt="" />
//                     </div>
//                 </div>
//                 <div className="col-span-2">
//                     <div className="bg-white lg:py-10 py-6 lg:px-8 px-6 rounded-2xl lg:rounded-tr-2xl lg:rounded-br-2xl lg:rounded-tl-none lg:rounded-bl-none shadow-lg h-full">
//                         <div className="flex justify-end">
//                             <button
//                                 onClick={() => setShow(false)}
//                                 className="inline-block cursor-pointer bg-[#F70D28]/40 rounded-full p-1.5"
//                             >
//                                 <IconX className="text-white w-5 h-5" stroke={2} />
//                             </button>
//                         </div>
//                         <div className="w-full">
//                         <form action="" className="w-full">
//                                         <div className="space-y-6">
//                                             <div>
//                                                 <h2 className="lg:text-4xl text-3xl font-semibold">Get in touch </h2>
//                                                 <p className="text-base font-normal text-[#222222]/80">You can reach us anytime</p>
//                                             </div>
//                                             <div className="space-y-4">
//                                                 <div className="lg:flex gap-4 lg:space-y-0 space-y-4">
//                                                     <input className="w-full px-4 py-2 border border-[#222222]/10 rounded-[8px]" type="text" placeholder="First name" />
//                                                     <input className="w-full px-4 py-2 border border-[#222222]/10 rounded-[8px]" type="text" placeholder="Last name" />
//                                                 </div>
//                                                 <div>
//                                                     <input className="w-full px-4 py-2 border border-[#222222]/10 rounded-[8px]" type="number" placeholder="Mobile number" name="" id="" />
//                                                 </div>
//                                                 <div>
//                                                     <input className="w-full px-4 py-2 border border-[#222222]/10 rounded-[8px] " type="mail" placeholder="Mail i'd" />
//                                                 </div>
//                                                 <div>
//                                                     <textarea className="w-full px-4 py-2 border border-[#222222]/10 rounded-[8px] max-h-[100px] min-h-[100px]" name="" placeholder="Your massage" id=""></textarea>
//                                                 </div>
//                                                 <div>
//                                                     <button className="px-8 flex gap-2 py-2.5 bg-[#222222] text-white rounded-sm cursor-pointer">
//                                                         Submit <IconArrowRight stroke={1.5} />
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                     </form>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
