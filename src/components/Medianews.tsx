"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface NewsItem {
  id: number;
  image: string;
  title: string;
  description: string;
  link: string;
}

export default function NewsSection() {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetch("/api/medianews")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data.length > 0) {
          setNewsData(json.data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (newsData.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % newsData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [newsData.length]);

  if (newsData.length === 0) return null;

  const current = newsData[activeIndex];

  return (
    <div className="bg-white py-8 md:py-12 px-4 md:px-10 rounded-[16px] mt-10">
      <div className="grid lg:grid-cols-2 gap-6 md:gap-10 items-center">
        <div className="w-full aspect-[4/3] rounded-[18px] overflow-hidden border border-black/10">
          <Image
            src={current.image}
            alt={current.title}
            width={600}
            height={400}
            className="w-full h-full object-cover transition-all duration-700"
          />
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className="space-y-3 md:space-y-4">
            <h2 className="text-black text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-snug">
              {current.title}
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-black leading-relaxed">
              {current.description}
            </p>

            <div className="flex items-center justify-between">
              <Link
                href={current.link || "/contact-us"}
                className="bg-[#81BA45] text-white text-sm md:text-base px-8 py-2 rounded-full font-medium"
              >
                About Us
              </Link>
              <div className="flex items-center gap-2">
                {newsData.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      activeIndex === i ? "w-8 bg-[#81BA45]" : "w-2 bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
