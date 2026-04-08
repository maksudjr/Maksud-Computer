import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Monitor, ShieldCheck, Zap, Heart, Users, MapPin, Phone, Mail, Facebook } from 'lucide-react';
import { Logo } from './Logo';

interface AboutUsProps {
  onBack: () => void;
}

export const AboutUs: React.FC<AboutUsProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-8 transition-colors font-medium"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
        >
          <div className="bg-indigo-600 p-12 text-white text-center">
            <div className="w-32 h-32 bg-white rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden shadow-lg border-4 border-white/20">
              <Logo className="w-full h-full" />
            </div>
            <h1 className="text-4xl font-black mb-4">Maksud Computer's since 2020</h1>
            <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
              Professional digital tools and services in Jamalpur.
            </p>
          </div>

          <div className="p-12 space-y-16">
            {/* Mission Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  At Maksud Computer, we believe that professional digital tools should be accessible to everyone. Our mission is to provide a comprehensive suite of high-quality tools—from CV building to photo editing—that help our users achieve their goals with ease and confidence.
                </p>
                <div className="space-y-4">
                  {[
                    { icon: <ShieldCheck className="text-green-500" />, text: "Secure and private data handling" },
                    { icon: <Zap className="text-amber-500" />, text: "Fast and efficient processing" },
                    { icon: <Heart className="text-red-500" />, text: "User-centric design and support" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                      {item.icon}
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-indigo-50 rounded-3xl p-8 flex items-center justify-center">
                <Monitor size={200} className="text-indigo-200" />
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-gray-900 rounded-3xl p-12 text-white">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
                <p className="text-gray-400">Visit us or contact us for any professional digital services.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <MapPin size={24} className="text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-bold">Location</h3>
                    <p className="text-gray-400 text-sm">Narundi bazar, Jamalpur Sadar, Jamalpur</p>
                  </div>
                </div>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <Phone size={24} className="text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-bold">Phone</h3>
                    <p className="text-gray-400 text-sm">01622638268</p>
                  </div>
                </div>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <Mail size={24} className="text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-bold">Email</h3>
                    <p className="text-gray-400 text-sm">maksudjr2020@gmail.com</p>
                  </div>
                </div>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <Facebook size={24} className="text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-bold">Facebook</h3>
                    <p className="text-gray-400 text-sm">Maksud Computer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
