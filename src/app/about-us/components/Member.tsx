"use client";

import Image from "next/image";

const boardMembers = [
  {
    name: "Saikat Mukherjee",
    role: "Founder & Chairman",
    image: "/images/saikat-mukherjee-image-01.png",
  },
  {
    name: "Varun Jalota",
    role: "Director",
    image: "/images/varun-jalota-image01.png",
  },
  {
    name: "Mousumi Mukherjee",
    role: "Director",
    image: "/images/mousumi-mukherjee-image-member.png",
  },
 
];

export default function BoardMembers() {
  return (
    <section
      className="bg-cover bg-center lg:py-16 py-10"
      style={{ backgroundImage: "url('/images/green-rectangle-bg.png')" }}>
      <div className="w-full max-w-[1020px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-2">
          <h2 className="text-white lg:text-4xl md:text-3xl text-2xl font-bold leading-snug text-center mb-3">
            Meet Our Board Members
          </h2>
          <p className="text-center text-white lg:w-[70%] mx-auto text-sm md:text-base lg:text-lg">Our board brings together experienced leaders, industry experts, and visionaries united by a shared commitment to women empowerment, skill development, education, and sustainable community development across India.</p>
        </div>

        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 md:gap-8 gap-4  ">
          {boardMembers.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-[18px] shadow-2xl mt-16  flex flex-col items-center ">
              <div className="">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={200}
                  height={230}
                  className="w-full h-full rounded-[18px] p-2"
                />
              </div>
              <div className="w-4/5 h-px bg-gray-200" />
              <p className="font-playfair text-[20px] font-bold text-gray-900 text-center leading-snug pt-2 mb-1">
                {member.name}
              </p>
              <p className="text-[16px] font-medium text-gray-400 text-center pb-4">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>



    </section>
  );
}