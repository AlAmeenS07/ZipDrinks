import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import Footer from "../../Components/Footer";

export default function Contact() {
  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Contact Us
        </h1>

        <p className="text-gray-600 mb-8">
          We’re here to help! Reach out to us using the details below for any
          questions, feedback, or support.
        </p>

        <div className="space-y-6 text-left">

          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-full">
              <Mail className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800">Email</h3>
              <p className="text-gray-600">support@zipdrinks.com</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-full">
              <Phone className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800">Customer Care</h3>
              <p className="text-gray-600">+91 98765 43210</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-full">
              <MapPin className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800">Address</h3>
              <p className="text-gray-600">
                Zip Group, Business Gate, Ernakulam, Kerala – 682016
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 text-sm text-gray-400">
          © {new Date().getFullYear()} Zip Drinks. All rights reserved.
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
