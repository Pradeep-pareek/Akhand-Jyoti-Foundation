import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from 'next/image'
import Link from "next/link";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import NextTopLoader from "nextjs-toploader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AkhandJyoti Foundation",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#F3F5EE]`}>
        <NextTopLoader
          color="#81BA45"
          initialPosition={0.08}
          crawlSpeed={200}
          height={5}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #81BA45,0 0 5px #81BA45"
        />
        <Header />
        {children}
        <Footer />
        {/* <Modal /> */}
        {/* <div className="fixed md:bottom-8 bottom-4 right-6">
          <Link href={"https://wa.me/919079813762"}>
          <Image
            src="/images/whatsaap-icon.png"  
            alt="Whatsaap"
            width={50}               
            height={50}   
            className=" cursor-pointer"          
          />
          </Link>
        </div> */}
      </body>
    </html>
  );
}
