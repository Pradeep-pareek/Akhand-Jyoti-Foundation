"use client";

import Image from "next/image";

const boardMembers = [
  {
    name: "Dr. Neha Sharma",
    role: "Founder & Chairman",
    image: "/images/member-img.png",
  },
  {
    name: "Rahul Mehta",
    role: "Vice Chairperson",
    image: "/images/member-img.png",
  },
  {
    name: "Dr. Bhumi Singh",
    role: "Board Secretary",
    image: "/images/member-img.png",
  },
];

export default function BoardMembers() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-[#6aaa4e] [background-image:repeating-linear-gradient(90deg,rgba(255,255,255,0.12)_0px,rgba(255,255,255,0.12)_1.5px,transparent_1.5px,transparent_44px)] px-5 py-12">
      <div className="flex flex-wrap justify-center gap-6">
        {boardMembers.map((member) => (
          <div
            key={member.name}
            className="bg-white rounded-[18px] shadow-2xl w-60 flex flex-col items-center pb-6"
          >
            {/* Photo */}
            <div className="relative w-full h-[230px]">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="z-40 object-top"
              />
              {/* Polaroid inner frame */}
              <div className="absolute inset-[10px] bg-green-500 rounded-sm pointer-events-none" />
            </div>

            {/* Divider */}
            <div className="w-4/5 h-px bg-gray-200 my-3" />

            {/* Name */}
            <p className="font-playfair text-[17px] font-bold text-gray-900 text-center leading-snug mb-1">
              {member.name}
            </p>

            {/* Role */}
            <p className="text-[13px] font-medium text-gray-400 text-center">
              {member.role}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}