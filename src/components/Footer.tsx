// components/Footer.js
import {
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandLinkedin,
} from "@tabler/icons-react";

export default function Footer() {
  return (
    <footer className="bg-[#222222] text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
         <div className="md:col-span-2">
          <h2 className="text-xl font-semibold">Footer Logo</h2>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo voluptates cumque maiores reprehenderit nemo, aspernatur, nisi sunt repudiandae quas, atque libero soluta fuga quos quidem repellendus consequatur optio blanditiis consectetur!</p>
         </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Company</h2>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-gray-400">About Us</a></li>
              <li><a href="#" className="hover:text-gray-400">Careers</a></li>
              <li><a href="#" className="hover:text-gray-400">Contact</a></li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Support</h2>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-gray-400">Help Center</a></li>
              <li><a href="#" className="hover:text-gray-400">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-gray-400">Terms of Service</a></li>
            </ul>
          </div>

          
          <div>
            <h2 className="text-xl font-semibold mb-4">Follow Us</h2>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition">
                <IconBrandFacebook size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <IconBrandTwitter size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <IconBrandInstagram size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <IconBrandLinkedin size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
