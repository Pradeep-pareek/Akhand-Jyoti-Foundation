import { IconArrowRight, IconMail, IconPhoneCall } from "@tabler/icons-react";

export default function Home() {
    return (
        <>
            <section className="bg-white md:py-10 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between gap-5">
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <h2 className="lg:text-4xl text-3xl font-semibold">Submit Your Press Release or Sponsored Content</h2>
                                <p className="text-base font-normal text-[#222222]/80">All submissions are tagged as “Press Release” or “Sponsored” and will be published exclusively in the Industry Announcements section of DailyTech.com. All content must be provided directly by the client. We do not create or edit content that could be mistaken as written by DailyTech staff. Additionally, we do not offer writing services for articles or press releases. Special requests to manage sponsored content differently from this policy will not be accommodated.</p>
                            </div>
                            <div className="space-y-4">
                            <div>
                                 <h3 className="lg:text2xl text-lg font-semibold">
                                     Phone number
                                 </h3>
                                 <p className="text-base font-normal flex gap-2 items-center"> <IconPhoneCall stroke={1.5} />
                                  + 1 888 HUBSPOT</p>
                            </div>
                            <div>
                                 <h3 className="lg:text2xl text-lg font-semibold">
                                   Mail address
                                 </h3>
                                 <p className="text-base font-normal flex gap-2 items-center"><IconMail stroke={1.5} />
                                  mailblog@gmaul.com</p>
                            </div>
                            </div>
                         
                        </div>
                        <div className="w-full">
                            <form action="" className="w-full">
                                <div className="space-y-6 border w-full bg-white border-[#222222]/10 rounded-lg px-6 py-6 lg:py-10">
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
                                            <input className="w-full px-4 py-2 border border-[#222222]/10 rounded-[8px] " type="mail" placeholder="Mail i'd" />
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
            </section>
        </>
    );
}
