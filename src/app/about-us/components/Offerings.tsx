"use client";
const offerings = [
    {
        number: "01",
        tag: "CONSULTATION",
        tagColor: "bg-blue-100 text-blue-600",
        accentColor: "bg-blue-500",
        dotColor: "bg-blue-500",
        title: "Strategy & project design",
        items: [
            "Project acquisition",
            "Proposal creation",
            "Partnerships & solutions",
            "Monitoring",
        ],
    },
    {
        number: "02",
        tag: "Execution",
        tagColor: "bg-green-100 text-green-600",
        accentColor: "bg-green-500",
        dotColor: "bg-green-500",
        title: "Delivery & implementation",
        items: [
            "Candidate mobilization",
            "CSR execution",
            "Assessment support",
            "Corporate training",
        ],
    },
    {
        number: "03",
        tag: "VAS",
        tagColor: "bg-purple-100 text-purple-600",
        accentColor: "bg-purple-500",
        dotColor: "bg-purple-500",
        title: "Value-added services",
        items: [
            "Social audit",
            "Capacity building",
            "Placement support",
            "Rural promotion",
        ],
    },
];

export default function ChairmanQuoteSection() {
    return (
        <section className="bg-[#FFFFFF] lg:py-16 py-10">
            <div className=" px-5 xl:px-10 2xl:px-0">
                <div className="mb-10 md:mb-14">
                    <h2 className="text-black lg:text-4xl md:text-3xl text-2xl font-bold leading-snug text-center mb-3">
                        Our Offerings
                    </h2>
                    <p className="text-center text-gray-600 w-full sm:w-[75%] md:w-[60%] mx-auto text-sm md:text-base lg:text-lg leading-relaxed">
                        We are dedicated to empowering individuals and communities through
                        skill development, innovation, and sustainable opportunities that
                        create long-term impact.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 md:gap-8">
                    {offerings.map((card) => (
                        <div
                            key={card.number}
                            className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col gap-5 relative overflow-hidden">
                            <div className={`absolute top-0 left-6 md:left-8 w-10 h-[3px] rounded-full ${card.accentColor}`} />
                            <div className="flex items-center justify-between pt-4">
                                <span
                                    className={`text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full ${card.tagColor}`}>
                                    {card.tag}
                                </span>
                                <span className="text-5xl md:text-6xl font-bold text-gray-100 leading-none select-none">
                                    {card.number}
                                </span>
                            </div>

                            <h3 className="text-gray-900 text-xl md:text-2xl font-bold leading-snug">
                                {card.title}
                            </h3>

                            <ul className="flex flex-col gap-2.5">
                                {card.items.map((item) => (
                                    <li key={item} className="flex items-center gap-3 text-gray-600 text-sm md:text-base">
                                        <span
                                            className={`w-2.5 h-2.5 rounded-full shrink-0 ${card.dotColor}`}
                                        />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
