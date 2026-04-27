"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

const testimonialsData = [
  {
    id: 1,
    text: "Being part of this journey has been amazing. I've seen real change in people's lives through their education and empowerment programs.",
    rating: 4,
    name: "Priya Verma",
    role: "Volunteer",
  },
  {
    id: 2,
    text: "Akhand Jyoti Foundation is doing incredible work at the grassroots level. Their dedication towards skill development and community growth is truly inspiring.",
    rating: 4.5,
    name: "Rahul Sharma",
    role: "Community Partner",
  },
  {
    id: 3,
    text: "The foundation's consistent efforts create long-term value for communities and the people who depend on them every day.",
    rating: 4.5,
    name: "Suresh Kumar",
    role: "Beneficiary",
  },
  {
    id: 4,
    text: "Supporting Akhand Jyoti Foundation has been one of the most fulfilling decisions. Their transparent use of donations and ground impact is remarkable.",
    rating: 5,
    name: "Anjali Mehta",
    role: "Donor",
  },
];

const AUTO_DELAY = 3500;

const mod = (n: number, m: number) => ((n % m) + m) % m;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const half = !filled && rating >= star - 0.5;
        return (
          <div key={star} className="text-yellow-400 text-2xl">
            {filled ? "★" : half ? "☆" : "☆"}
          </div>
        );
      })}
    </div>
  );
}


function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map(n => n[0]).join("");
  return (
    <div className="w-9 h-9 rounded-full bg-green-200 text-green-700 flex items-center justify-center font-bold text-sm">
      {initials}
    </div>
  );
}

function Card({ item }: any) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-md flex flex-col gap-3">
      <p className="text-sm text-gray-700 leading-relaxed">{item.text}</p>
      <StarRating rating={item.rating} />
      <div className="flex items-center gap-3 mt-1">
        <Avatar name={item.name} />
        <div>
          <p className="font-semibold text-sm text-black">{item.name}</p>
          <p className="text-xs text-gray-500">{item.role}</p>
        </div>
      </div>
    </div>
  );
}


export default function TestimonialsSlider() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<any>(null);

  const total = testimonialsData.length;

  const next = useCallback(() => {
    setCurrent((c) => mod(c + 1, total));
  }, [total]);

  useEffect(() => {
    timerRef.current = setInterval(next, AUTO_DELAY);
    return () => clearInterval(timerRef.current);
  }, [next]);

  const prevIndex = mod(current - 1, total);
  const nextIndex = mod(current + 1, total);

  return (
    <section className="bg-[#f0ebe4] py-16 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">

        <div className="w-full md:w-[40%] relative h-[420px] overflow-hidden">

          <div className="absolute top-0 w-full opacity-60 scale-95 blur-[1px]">
            <Card item={testimonialsData[prevIndex]} />
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 w-full z-10">
            <Card item={testimonialsData[current]} />
          </div>

          <div className="absolute bottom-0 w-full opacity-60 scale-95 blur-[1px]">
            <Card item={testimonialsData[nextIndex]} />
          </div>
        </div>
        <div className="w-full md:w-[60%]">
          <div className="space-y-2">
            <h2 className="text-start text-black lg:text-4xl md:text-3xl text-xl font-bold">Our Media Coverage</h2>
            <p className="text-start text-black text-sm md:text-base lg:text-lg">Explore how our work and impact have been recognized across various media platforms. From inspiring stories to meaningful achievements, discover how we are making a difference in communities nationwide.</p>
          </div>
          <StarRating rating={4.5} />
          <div className="flex items-center justify-between gap-4 mt-6">
            <button className="bg-[#81BA45] text-white px-6 py-2 rounded-full font-semibold cursor-pointer">
              ❤️ Donate Now
            </button>
            <div className="flex gap-2">
              {testimonialsData.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all duration-500 ${i === current
                      ? "w-8 bg-[#81BA45]"
                      : "w-3 bg-gray-300"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}