import { motion } from "framer-motion";

export const HeroSection = () => {
  return (
    <section className="relative h-[450px] overflow-hidden mb-8 rounded-lg px-10">
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-r from-[#136CB9] to-[#399092] " />
        <div
          className="absolute inset-0 "
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')",
            backgroundPosition: "center",
            backgroundSize: "cover",
            opacity: 0.2,
          }}
        />
      </div>

      <div className="relative container mx-auto px-8 h-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center h-full"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            My Events
          </h1>
          <p className="text-xl text-gray-100 max-w-2xl">
            Discover and participate in exciting events happening at our
            university. Join, learn, and grow with your peers.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
