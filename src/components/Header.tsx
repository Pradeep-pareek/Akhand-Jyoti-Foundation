"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { IconHeartFilled } from "@tabler/icons-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isAdminRoute = pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout");
    router.push("/admin/login");
    router.refresh();
  };

  const adminLinkClass = (href: string) =>
    `text-base font-medium transition-colors ${pathname === href ? "text-[#81BA45]" : "text-[#111] hover:text-[#81BA45]"
    }`;

  const adminMobileLinkClass = (href: string) =>
    `block font-medium transition-colors ${pathname === href ? "text-[#81BA45]" : "text-gray-700 hover:text-[#81BA45]"
    }`;

  const isReceiptRoute = pathname.startsWith("/receipt/");
  if (isReceiptRoute) return null;

  return (
    <header className="w-full mx-auto md:px-6 lg:px-8">
      <div className="bg-[#fff] md:rounded-[18px] shadow-md top-0 z-50 lg:mt-2 py-2">
        <div className="flex items-center justify-between md:py-0 py-3 lg:px-10 px-5">

          <Link href="/" className="text-2xl font-bold text-[#f70d28] py-1">
            <Image
              src="/images/logo-img.svg"
              alt="logo image"
              width={50}
              height={50}
            />
          </Link>

          <div className="hidden md:flex gap-6 items-center py-2">
            <nav className="flex space-x-4 items-center">

              {!isAdminRoute ? (
                <>
                  <Link href="/" className={`text-base font-medium ${pathname === "/" ? "text-[#81BA45]" : "text-[#000]"}`}>
                    Home
                  </Link>
                  <Link href="/about-us" className={`text-base font-medium ${pathname === "/about-us" ? "text-[#81BA45]" : "text-[#000]"}`}>
                    About Us
                  </Link>
                  <Link href="/our-programs" className={`text-base font-medium ${pathname === "/our-programs" ? "text-[#81BA45]" : "text-[#000]"}`}>
                    Our Programs
                  </Link>
                  <Link href="/gallery" className={`text-base font-medium ${pathname === "/gallery" ? "text-[#81BA45]" : "text-[#000]"}`}>
                    Gallery
                  </Link>
                  <Link href="/contact-us" className={`text-base font-medium ${pathname === "/contact-us" ? "text-[#81BA45]" : "text-[#000]"}`}>
                    Contact Us
                  </Link>
                  <Link href="/financials" className={`text-base font-medium ${pathname === "/financials" ? "text-[#81BA45]" : "text-[#000]"}`}>
                    Our Financials
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/admin/gallery" className={adminLinkClass("/admin/gallery")}>Gallery Admin</Link>
                  <Link href="/admin/financials" className={adminLinkClass("/admin/financials")}>Financials</Link>
                  <Link href="/admin/Impactnumbers" className={adminLinkClass("/admin/Impactnumbers")}>Impact Numbers</Link>
                  <Link href="/admin/our-programs" className={adminLinkClass("/admin/our-programs")}>Our Programs</Link>
                  <Link href="/admin/contact-us" className={adminLinkClass("/admin/contact-us")}>Contact Us</Link>
                  <Link href="/admin/medianews" className={adminLinkClass("/admin/medianews")}>Media News</Link>
                  <Link href="/admin/donations" className={adminLinkClass("/admin/donations")}>Donations</Link>
                  <Link href="/admin/change-password" className={adminLinkClass("/admin/change-password")}>Change Password</Link>
                </>
              )}
            </nav>

            {!isAdminRoute ? (
              <Link
                href="/donation"
                className="flex items-center gap-1 bg-[#81BA45] rounded-full px-6 py-2 text-white text-base font-normal"
              >
                <IconHeartFilled className="text-red-500 text-base" />
                Donation
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full px-6 py-2 text-base font-medium cursor-pointer transition-colors"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-black" onClick={toggleMenu}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            onClick={closeMenu}
          />
        )}

        {/* Mobile Sidebar */}
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
            {!isAdminRoute ? (
              <>
                <Link href="/" className="block text-gray-700" onClick={closeMenu}>Home</Link>
                <Link href="/about-us" className="block text-gray-700" onClick={closeMenu}>About Us</Link>
                <Link href="/our-programs" className="block text-gray-700" onClick={closeMenu}>Our Programs</Link>
                <Link href="/gallery" className="block text-gray-700" onClick={closeMenu}>Gallery</Link>
                <Link href="/contact-us" className="block text-gray-700" onClick={closeMenu}>Contact Us</Link>
                <Link href="/financials" className="block text-gray-700" onClick={closeMenu}>Our Financials</Link>
                <Link
                  href="/donation"
                  onClick={closeMenu}
                  className="inline-flex items-center gap-1 bg-[#81BA45] rounded-full px-6 py-2 text-white text-base font-normal"
                >
                  <IconHeartFilled className="text-red-500 text-base" />
                  Donation
                </Link>
              </>
            ) : (
              <>
                <Link href="/admin/gallery" className={adminMobileLinkClass("/admin/gallery")} onClick={closeMenu}>Gallery Admin</Link>
                <Link href="/admin/financials" className={adminMobileLinkClass("/admin/financials")} onClick={closeMenu}>Financials</Link>
                <Link href="/admin/Impactnumbers" className={adminMobileLinkClass("/admin/Impactnumbers")} onClick={closeMenu}>Impact Numbers</Link>
                <Link href="/admin/our-programs" className={adminMobileLinkClass("/admin/our-programs")} onClick={closeMenu}>Our Programs</Link>
                <Link href="/admin/contact-us" className={adminMobileLinkClass("/admin/contact-us")} onClick={closeMenu}>Contact Us</Link>
                <Link href="/admin/medianews" className={adminMobileLinkClass("/admin/medianews")} onClick={closeMenu}>Media News</Link>
                <Link href="/admin/donations" className={adminMobileLinkClass("/admin/donations")} onClick={closeMenu}>Donations</Link>
                <Link href="/admin/change-password" className={adminMobileLinkClass("/admin/change-password")} onClick={closeMenu}>Change Password</Link>
                <button
                  onClick={() => { handleLogout(); closeMenu(); }}
                  className="bg-red-500 hover:bg-red-600 text-white rounded-full px-6 py-2 font-medium transition-colors w-full text-left"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </aside>
      </div>
    </header>
  );
};

export default Header;
