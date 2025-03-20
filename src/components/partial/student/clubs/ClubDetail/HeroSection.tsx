import React, { useState } from "react";
import { ClubResponse } from "@/models/Club";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { JoinClubDialog } from "../../club-register/JoinClubDialog";

interface HeroSectionProps {
  club: ClubResponse;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ club }) => {
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);

  return (
    <>
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0 w-full h-full rounded-lg">
          <img
            src={club.logoUrl}
            alt={`${club.clubName} banner`}
            className="w-full h-full object-cover transform scale-105 filter blur-[2px] rounded-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 rounded-lg" />
        </div>

        <div className="relative container mx-auto px-10 h-full">
          <div className="flex flex-col md:flex-row items-center justify-between h-full py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-white max-w-2xl"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                {club.clubName}
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-8">
                Contact: {club.contactEmail}
              </p>
              <div className="flex gap-4">
                <Button
                  variant={"custom"}
                  className="text-white px-10 py-7 rounded-full font-semibold text-base hover:bg-opacity-90 transition"
                  onClick={() => setIsJoinDialogOpen(true)}
                >
                  Join Club
                </Button>
                {/* <Button
                  variant="outline"
                  className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-black transition"
                >
                  Learn More
                </Button> */}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 md:mt-0"
            >
              {/* Club statistics or additional info can be added here */}
            </motion.div>
          </div>
        </div>
      </section>

      <JoinClubDialog
        club={club}
        isOpen={isJoinDialogOpen}
        onClose={() => setIsJoinDialogOpen(false)}
      />
    </>
  );
};
