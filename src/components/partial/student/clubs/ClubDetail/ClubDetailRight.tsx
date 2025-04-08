import React from "react";
import { ClubResponse } from "@/models/Club";
import { motion } from "framer-motion";
import { format } from "date-fns";

interface ClubDetailRightProps {
  club: ClubResponse;
}

export const ClubDetailRight: React.FC<ClubDetailRightProps> = ({ club }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="sticky top-24">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-2xl font-bold mb-4">Club Information</h3>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm text-gray-500 uppercase">Club Owner</h4>
                <p className="text-gray-900 font-medium">
                  {club.clubOwnerName}
                </p>
              </div>

              <div>
                <h4 className="text-sm text-gray-500 uppercase">Members</h4>
                <p className="text-gray-900 font-medium">
                  {club.numOfMems} members
                </p>
              </div>

              <div>
                <h4 className="text-sm text-gray-500 uppercase">
                  Founding Date
                </h4>
                <p className="text-gray-900 font-medium">
                  {club.foundingDate && format(club.foundingDate, "dd/MM/yyyy")}
                </p>
              </div>

              <div>
                <h4 className="text-sm text-gray-500 uppercase">Contact</h4>
                <p className="text-gray-900 font-medium">{club.contactEmail}</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50 border-t">
            <h4 className="font-semibold mb-4">Club Logo</h4>
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img
                src={club.logoUrl}
                alt={club.clubName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
