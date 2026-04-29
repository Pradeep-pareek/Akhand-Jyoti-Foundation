"use client";

import Image from "next/image";

const boardMembers = [
  {
    name: "Dr. Neha Sharma",
    role: "Founder & Chairman",
    image: "/images/member-img.png",
  },
  {
    name: "Dr. Neha Sharma",
    role: "Founder & Chairman",
    image: "/images/member-img.png",
  },
  {
    name: "Dr. Neha Sharma",
    role: "Founder & Chairman",
    image: "/images/member-img.png",
  },
  {
    name: "Dr. Neha Sharma",
    role: "Founder & Chairman",
    image: "/images/member-img.png",
  },
];

export default function BoardMembers() {
  return (
    <section
      className="bg-cover bg-center lg:py-16 py-10"
      style={{ backgroundImage: "url('/images/green-rectangle-bg.png')" }}>
      <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-2">
          <h2 className="text-white lg:text-4xl md:text-3xl text-2xl font-bold leading-snug text-center mb-3">
            Meet Our Board Members
          </h2>
          <p className="text-center text-white lg:w-[70%] mx-auto text-sm md:text-base lg:text-lg">Our board comprises experienced leaders and visionaries committed to driving sustainable social impact across education, skill development, and community empowerment in India.</p>
        </div>

        <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 md:gap-8 gap-4  ">
          {boardMembers.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-[18px] shadow-2xl mt-16  flex flex-col items-center pb-6">
              <div className="relative w-full h-[230px] flex justify-center">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={200}
                  height={230}
                  className=" absolute z-[9] bottom-[10px]"
                />
                <div className="absolute inset-[10px] bg-[#81BA45] rounded-lg pointer-events-none" />
              </div>
              <div className="w-4/5 h-px bg-gray-200 my-3" />
              <p className="font-playfair text-[17px] font-bold text-gray-900 text-center leading-snug mb-1">
                {member.name}
              </p>
              <p className="text-[13px] font-medium text-gray-400 text-center">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>



    </section>
  );
}