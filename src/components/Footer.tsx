"use client"
import {
  IconChevronsRight,
  IconHeartFilled,
  IconBrandWhatsapp,
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandLinkedin,
  IconPhone,
  IconMail,
  IconMapPin,
} from "@tabler/icons-react";
import Image from "next/image";
// import { IconMapPin } from '@tabler/icons-react';
import { IconPhoneCall } from '@tabler/icons-react';
import { usePathname } from "next/navigation";
import Link from "next/link";
import { IconBrandX } from '@tabler/icons-react';

export default function Footer() {
  const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about-us" },
  { name: "Our Programs", href: "our-programs" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact Us", href: "/contact-us" },
];
  const pathname = usePathname();
// < size={26} color="white" />

  
  const socialLinks = [
    { Icon: IconBrandX, label: "X", href: "https://x.com/Akhandjyoti_1" },
    { Icon: IconBrandInstagram, label: "Instagram", href: "https://www.instagram.com/akhandjyoti_foundation?utm_source=qr&igsh=YXZiOXdxdnVrejl6" },
    { Icon: IconBrandFacebook, label: "Facebook", href: "https://www.facebook.com/share/1B9tdjKp7e/" },
    { Icon: IconBrandLinkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/akhandjyoti-foundation/" },
  ];

  const touchIcons = [
    { Icon: IconPhone, label: "Phone", href: "tel:+911234567890" },
    { Icon: IconMail, label: "Email", href: "mailto:info@ajf.org" },
    { Icon: IconMapPin, label: "Location", href: "#" },
  ];
  const isReceiptRoute = pathname.startsWith("/receipt/");
  if (isReceiptRoute) {
    return null;
  }
  return (
    <section className="relative lg:pt-16 pt-10 bg-white">
      <div className="relative z-10 mx-5 xl:mx-10 2xl:mx-auto 2xl:max-w-6xl">
        <div className="bg-[#81BA45] rounded-[18px] py-10 px-8 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 overflow-hidden">
          <div className="space-y-5 relative z-10">
            <div className="space-y-2">
              <h2 className="text-white text-xl md:text-3xl lg:text-4xl font-bold uppercase tracking-wide">
                Want to Know More?
              </h2>
              <p className="text-[#fff] text-sm md:text-base  max-w-lg leading-relaxed">
                Discover how AkhandJyoti Foundation is empowering women, strengthening communities, and creating sustainable social impact—and learn how you can become a part of this journey of change.
              </p>
            </div>
             <Link className="flex gap-1" href={"/contact-us"}>
            <button className="bg-white text-gray-900 py-2.5 px-7 rounded-full text-base font-semibold inline-flex items-center gap-1 hover:bg-gray-100 transition-colors cursor-pointer">
              Contact us <IconChevronsRight size={20} stroke={2.5} />
            </button>
            </Link>
          </div>

          <div className="relative z-10 shrink-0">
             <Link className="flex gap-1" href={"/donation"}>
            <button className="bg-white text-gray-900 py-2.5 px-7 rounded-full text-base font-semibold inline-flex items-center gap-2 hover:bg-gray-100 transition-colors cursor-pointer">
                <IconHeartFilled className="text-red-500 text-base" />
                Donate Now
            </button>
            </Link>
          </div>
        </div>
      </div>

      <footer className="bg-[#2E5D34] text-white -mt-10 pt-4">
        <div className="max-w-6xl mx-auto px-6 md:px-8 pt-16 pb-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10">
            <div className="md:col-span-1 space-y-4">
              <div className="">
                <Image
                  src="/images/footer-logo.png"
                  alt="logo image"
                  width={150}
                  height={150}
                  className=""
                />
              </div>
              <p className="text-[#fff] text-base leading-relaxed">
                We are a dedicated non-profit organization working towards skill development, education, Sports and community empowerment across India.
              </p>

              <div className="flex gap-2.5 pt-1">
                {socialLinks.map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    className="w-10 h-10 rounded-full bg-[#81BA45] flex items-center justify-center hover:bg-[#6fa336] transition-colors"
                  >
                    <Icon size={26} color="white" />
                  </a>
                ))}
              </div>
            </div>

            <div className="lg:flex justify-center">
              <div>
                <h3 className="text-white font-bold text-lg mb-5 tracking-wide ">
                  Quick Links
                </h3>
             <ul className="space-y-2 text-start">
  {quickLinks.map((link) => (
    <li key={link.name}>
      <Link
        href={link.href}
        className="text-white text-base hover:text-[#81BA45] transition-colors"
      >
        {link.name}
      </Link>
    </li>
  ))}
</ul>
              </div>
            </div>


            <div>
              <h3 className="text-white font-bold text-lg mb-5 tracking-wide">
                Get In Touch
              </h3>
              <div className="space-y-4">
                <div className="flex gap-2 items-center">
                  <span><IconMapPin stroke={2} /></span>
                  <a href="#"
                    className="text-white text-base hover:text-[#81BA45] transition-colors"
                  >
                    C-4B/307-A-GF. Pocket 13. Janakpuri. NEW DELHI South West New Delhi – 110058
                  </a>
                </div>

                <div className="flex gap-2 items-center">
                  <IconMail stroke={2} />
                  <a href="mailto:info@akhandjyotifoundation.org"
                    className="text-white text-base hover:text-[#81BA45] transition-colors"
                  >
                    info@akhandjyotifoundation.org
                  </a>
                </div>

                <div className="flex gap-2 items-center">
                  <IconPhoneCall stroke={2} />
                  <a href="tel:+918800452255"
                    className="text-white text-base hover:text-[#81BA45] transition-colors"
                  >
                    8800452255
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#fff]/40 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-[13px] text-[#fff]/60">
            <span>
              © {new Date().getFullYear()} AkhandJyoti Foundation. All Rights Reserved.
            </span>
            <div className="flex gap-5">
              <a href="/privacy-policy" className="hover:text-gray-300 transition-colors">
                Privacy Policy
              </a>
              <a href="/terms-and-conditions" className="hover:text-gray-300 transition-colors">
                Terms &amp; Conditions
              </a>
               <a href="/refund-policy" className="hover:text-gray-300 transition-colors">
                Refund Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
}
