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
// import { IconMail } from '@tabler/icons-react';

export default function Footer() {
  const quickLinks = ["Home", "About Us", "What We Do", "Programs", "Contact Us"];

  const socialLinks = [
    { Icon: IconBrandWhatsapp, label: "WhatsApp", href: "#" },
    { Icon: IconBrandInstagram, label: "Instagram", href: "#" },
    { Icon: IconBrandFacebook, label: "Facebook", href: "#" },
    { Icon: IconBrandLinkedin, label: "LinkedIn", href: "#" },
  ];

  const touchIcons = [
    { Icon: IconPhone, label: "Phone", href: "tel:+911234567890" },
    { Icon: IconMail, label: "Email", href: "mailto:info@ajf.org" },
    { Icon: IconMapPin, label: "Location", href: "#" },
  ];

  return (
    <section className="relative lg:pt-16 pt-10 bg-white">
      <div className="relative z-10 mx-5 xl:mx-10 2xl:mx-auto 2xl:max-w-6xl">
        <div className="bg-[#81BA45] rounded-[18px] py-10 px-8 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 overflow-hidden">
          <div className="space-y-5 relative z-10">
            <div className="space-y-2">
              <h2 className="text-white text-xl md:text-3xl lg:text-4xl font-bold uppercase tracking-wide">
                Want to Know More?
              </h2>
              <p className="text-[#fff] text-sm md:text-base lg:text-lg max-w-lg leading-relaxed">
                Discover how our initiatives are creating real impact and how
                you can be a part of this journey.
              </p>
            </div>
            <button className="bg-white text-gray-900 py-2.5 px-7 rounded-full text-base font-semibold inline-flex items-center gap-1 hover:bg-gray-100 transition-colors cursor-pointer">
              Contact us <IconChevronsRight size={20} stroke={2.5} />
            </button>
          </div>

          <div className="relative z-10 shrink-0">
            <button className="bg-white text-gray-900 py-2.5 px-7 rounded-full text-base font-semibold inline-flex items-center gap-2 hover:bg-gray-100 transition-colors cursor-pointer">
              <IconHeartFilled size={18} className="text-red-500" />
              Donate Now
            </button>
          </div>
        </div>
      </div>

      <footer className="bg-[#182C30] text-white -mt-10 pt-4">
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
                We are a dedicated non-profit organization working towards skill development, education, and community empowerment across India.
              </p>

              <div className="flex gap-2.5 pt-1">
                {socialLinks.map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
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
                    <li key={link}>
                      <a
                        href="#"
                        className="text-gray-400 text-center text-base hover:text-[#81BA45] transition-colors"
                      >
                        {link}
                      </a>
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
                    className="text-gray-400 text-base hover:text-[#81BA45] transition-colors"
                  >
                    C-4B/307-A-GF. Pocket 13. Janakpuri. NEW DELHI South West New Delhi – 110058
                  </a>
                </div>

                <div className="flex gap-2 items-center">
                  <IconMail stroke={2} />
                  <a href="#"
                    className="text-gray-400 text-base hover:text-[#81BA45] transition-colors"
                  >
                    akhandjyotifoundation@gmail.com
                  </a>
                </div>

                <div className="flex gap-2 items-center">
                  <IconPhoneCall stroke={2} />
                  <a href="#"
                    className="text-gray-400 text-base hover:text-[#81BA45] transition-colors"
                  >
                    8800452255
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#333] py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-[13px] text-gray-500">
            <span>
              © {new Date().getFullYear()} Akhand Jyoti Foundation. All Rights Reserved.
            </span>
            <div className="flex gap-5">
              <a href="#" className="hover:text-gray-300 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gray-300 transition-colors">
                Terms &amp; Conditions
              </a>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
}
