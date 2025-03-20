import React from "react";
import { ClubResponse } from "@/models/Club";
import { motion } from "framer-motion";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

interface ClubDetailLeftProps {
  club: ClubResponse;
}

export const ClubDetailLeft: React.FC<ClubDetailLeftProps> = ({ club }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="md:col-span-2 space-y-8"
    >
      <div className="description">
        <h2 className="text-3xl font-bold mb-6 flex items-center">
          <span className="mr-3">About the Club</span>
          <div className="h-1 flex-grow bg-gradient-to-r from-blue-500 to-[#49BBBD] rounded" />
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          {club.description}
        </p>
      </div>

      <div className="club-fields">
        <h3 className="text-2xl font-bold mb-4">Club Fields</h3>
        <div className="flex flex-wrap gap-3">
          {club.clubFields.map((field, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium"
            >
              {field.fieldName}
            </span>
          ))}
        </div>
      </div>

      <div className="activities">
        <h3 className="text-2xl font-bold mb-4">Club Purpose</h3>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div className="bg-[#E5F5F8] p-6 rounded-lg">
            <p className="text-[#0A4C66] text-base">{club.purpose}</p>
          </div>
        </div>
      </div>

      <div className="social-share">
        <h3 className="text-2xl font-bold mb-4">Share with Friends</h3>
        <div className="flex items-center space-x-4">
          <a
            href="#"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            <FaFacebook size={24} />
          </a>
          <a
            href="#"
            className="text-gray-600 hover:text-pink-600 transition-colors"
          >
            <FaInstagram size={24} />
          </a>
          <a
            href="#"
            className="text-gray-600 hover:text-blue-800 transition-colors"
          >
            <FaLinkedin size={24} />
          </a>
          <a
            href="#"
            className="text-gray-600 hover:text-blue-400 transition-colors"
          >
            <FaTwitter size={24} />
          </a>
        </div>
      </div>
    </motion.div>
  );
};
