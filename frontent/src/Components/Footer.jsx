import { Package, Truck, Headphones, MapPin, Mail, Phone } from 'lucide-react';

const Footer = ()=>{
  return (
    <footer className="bg-black text-white">

      <div className="border-b border-neutral-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">

            <div className="flex flex-col items-center text-center">
              <div className="bg-neutral-800 rounded-full p-3 mb-3">
                <Package size={28} className="text-white" />
              </div>
              <h3 className="font-medium text-base">High Quality</h3>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-neutral-800 rounded-full p-3 mb-3">
                <Truck size={28} className="text-white" />
              </div>
              <h3 className="font-medium text-base">Free Delivery within 1 hr</h3>
            </div>

            <div className="flex flex-col items-center text-center sm:col-span-2 lg:col-span-1">
              <div className="bg-neutral-800 rounded-full p-3 mb-3">
                <Headphones size={28} className="text-white" />
              </div>
              <h3 className="font-medium text-base">24 / 7 Support</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">

          <div>
            <div className="flex items-center space-x-2 mb-4">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <h3 className="font-medium text-base">Made In India</h3>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Our store has a wide collection of Drinks and Beverages that you are looking, when thirsty!
            </p>
          </div>

          <div>
            <h3 className="font-medium text-base mb-4">Get In Touch</h3>
            <div className="space-y-3 text-sm text-neutral-400">
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="flex-shrink-0 mt-0.5" />
                <div>
                  <p>Zip Group, Business Gate,</p>
                  <p>Ernakulam, Kerala 600031</p>
                  <p>CA 90280</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="flex-shrink-0" />
                <p>Zip@gmail.com</p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} className="flex-shrink-0" />
                <p>+91 000-000-0000</p>
              </div>
            </div>
          </div>

          <div className="hidden lg:block"></div>
        </div>

        <div className="mt-8 sm:mt-12 pt-6 border-t border-neutral-800">
          <p className="text-sm text-neutral-400 text-center sm:text-left">
            Copyright: Zip
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;