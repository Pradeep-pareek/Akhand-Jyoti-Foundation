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


  return (
    <header className="w-full max-w-[1320px] mx-auto md:px-6 lg:px-8">
      <div className="bg-[#fff] md:rounded-[18px] shadow-md top-0 z-50 lg:mt-2 py-2">
        <div className="flex items-center justify-between md:py-0 py-3 lg:px-10 px-5">

          <Link href="/" className="text-2xl font-bold text-[#f70d28] py-1">
            <Image
              src="/images/logo-img.png"
              alt="logo image"
              width={75}
              height={75}
            />
          </Link>
          <div className="hidden md:flex gap-6 items-center py-2">
            <nav className="flex space-x-4 items-center">

              {!isAdminRoute ? (
                <>
                  <Link
                    href="/"
                    className={`text-base font-medium ${pathname === "/" ? "text-[#81BA45]" : "text-[#000]"
                      }`}
                  >
                    Home
                  </Link>

                  <Link
                    href="/about-us"
                    className={`text-base font-medium ${pathname === "/about-us"
                        ? "text-[#81BA45]"
                        : "text-[#000]"
                      }`}
                  >
                    About Us
                  </Link>

                  <Link
                    href="/our-programs"
                    className={`text-base font-medium ${pathname === "/our-programs"
                        ? "text-[#81BA45]"
                        : "text-[#000]"
                      }`}
                  >
                    Our Programs
                  </Link>

                  <Link
                    href="/gallery"
                    className={`text-base font-medium ${pathname === "/gallery"
                        ? "text-[#81BA45]"
                        : "text-[#000]"
                      }`}
                  >
                    Gallery
                  </Link>

                  <Link
                    href="/contact-us"
                    className={`text-base font-medium ${pathname === "/contact-us"
                        ? "text-[#81BA45]"
                        : "text-[#000]"
                      }`}
                  >
                    Contact Us
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/admin/gallery"
                    className="text-[#fff] text-base font-medium"
                  >
                    Gallery Admin
                  </Link>

                  <Link
                    href="/admin/Impactnumbers"
                    className="text-[#fff] text-base font-medium"
                  >
                    Impact Numbers
                  </Link>
                  <Link
                    href="/admin/change-password"
                    className="text-[#fff] text-base font-medium"
                  >
                    Change Password
                  </Link>
                </>
              )}
            </nav>

            {!isAdminRoute ? (
              <button className="bg-[#81BA45] rounded-full px-6 py-2 text-[#fff] text-base font-normal cursor-pointer">
                <Link className="flex gap-1" href={"/donation"}>
                  <IconHeartFilled className="text-red-500 text-base" />
                  Donation
                </Link>
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white rounded-full px-6 py-2 text-base font-normal cursor-pointer"
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
            <button
              onClick={closeMenu}
              className="text-gray-700 hover:text-[#f70d28]"
            >
              <X size={24} />
            </button>
          </div>

          <div className="px-6 py-2 space-y-4">

            {!isAdminRoute ? (
              <>
                <Link href="/" className="block text-gray-700" onClick={closeMenu}>
                  Home
                </Link>

                <Link href="/about-us" className="block text-gray-700" onClick={closeMenu}>
                  About Us
                </Link>

                <Link href="/our-programs" className="block text-gray-700" onClick={closeMenu}>
                  Our Programs
                </Link>

                <Link href="/gallery" className="block text-gray-700" onClick={closeMenu}>
                  Gallery
                </Link>

                <Link href="/contact-us" className="block text-gray-700" onClick={closeMenu}>
                  Contact Us
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/admin/gallery"
                  className="block text-gray-700"
                  onClick={closeMenu}
                >
                  Gallery Admin
                </Link>

                <Link
                  href="/admin/Impactnumbers"
                  className="block text-gray-700"
                  onClick={closeMenu}
                >
                  Impact Numbers
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                  className="bg-red-500 text-white rounded-full px-6 py-2"
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