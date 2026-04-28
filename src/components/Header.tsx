"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { IconHeartFilled } from '@tabler/icons-react';
import Image from "next/image";
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);


  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  if (!hasMounted) return null;

  return (
    <header className="w-full max-w-[1320px] mx-auto   md:px-6 lg:px-8"  >
      <div className="bg-[#81BA45] md:rounded-[18px] sticky shadow-md top-0 z-50  ">
        <div className="flex items-center justify-between md:py-0 py-3 lg:px-10 px-5">
          <Link href="/" className="text-2xl font-bold text-[#f70d28] py-1">
            <Image
              src="/images/logo-image.png"
              alt="logo image"
              width={85}
              height={85}
              className=""
            />
          </Link>
          <div className="hidden md:flex gap-6 items-center py-2">
            <nav className="flex space-x-4 items-center">
              <Link href="/" className="text-[#fff] text-base font-medium">Home</Link>
              <Link href="/about-us" className="text-[#fff] text-base font-medium">About Us</Link>
              <Link href="/our-programs" className="text-[#fff] text-base font-medium">Our Programs</Link>
              <Link href="/gallery" className="text-[#fff] text-base font-medium">Gallery</Link>
              <Link href="/contact-us" className="text-[#fff] text-base font-medium">Contact Us</Link>
            </nav>
            <button className="bg-[#FFFFFF] rounded-full px-6 py-2 text-black text-base font-normal cursor-pointer">
              <Link className="flex gap-1" href={"/donation"}>
                <IconHeartFilled className="text-red-500 text-base" /> Donation
              </Link>
            </button>
          </div>
          <button className="md:hidden text-white" onClick={toggleMenu}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* ........ MObile verson.......  */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            onClick={closeMenu}
          />
        )}


        <aside
          className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >

          <div className="flex justify-end px-4 py-4">
            <button onClick={closeMenu} className="text-gray-700 hover:text-[#f70d28]">
              <X size={24} />
            </button>
          </div>

          <div className="px-6 py-2 space-y-4">

            <Link href="/" className="block text-gray-700 hover:text-blue-600" onClick={closeMenu}>Home</Link>
            <Link href="/about-us" className="block text-gray-700 hover:text-blue-600" onClick={closeMenu}>About Us</Link>
            <Link href="/our-programs" className="block text-gray-700 hover:text-blue-600" onClick={closeMenu}>Our Programs</Link>
            <Link href="/gallery" className="block text-gray-700 hover:text-blue-600" onClick={closeMenu}>Gallery</Link>
            <Link href="/contact-us" className="block text-gray-700 hover:text-blue-600" onClick={closeMenu}>Contact Us</Link>
            <button onClick={closeMenu} className="bg-[#81BA45] text-white rounded-full px-6 py-2 text-black text-base font-normal cursor-pointer">
              <Link className="flex gap-1" href={"/donation"}>
                <IconHeartFilled className="text-red-500 text-base" /> Donation
              </Link>
            </button>
          </div>
        </aside>
      </div>
    </header>
  );
};

export default Header;
