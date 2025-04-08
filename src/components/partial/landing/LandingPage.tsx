import { Marquee } from "@/components/magicui/marquee";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import ImageCarousel from "./ImageSilder";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { features } from "./Reason";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const GuestLandingPage = () => {
  const [key, setKey] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setKey((prevKey) => prevKey + 1); // Reset key để component re-render
    }, 6000); // Điều chỉnh thời gian lặp lại (tổng thời gian chạy của hiệu ứng)

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen scroll-smooth bg-gradient-to-b from-[#e0e7ff] to-[#f5f5f5] ">
      {/* Header Section */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between p-1">
          <div className="flex justify-center items-center gap-7">
            <img
              src="https://res.cloudinary.com/ecams/image/upload/v1739124259/ECAMS_Logo_ow82lc.png"
              alt="logo"
              className="w-20 h-16 pb-1"
            />
            <nav className="flex space-x-6">
              <a
                href="#about"
                className="text-gray-700 font-medium hover:text-[#136CB5] transition duration-300 scroll-smooth"
              >
                About
              </a>

              <a
                href="#why-choose-us"
                className="text-gray-700 font-medium hover:text-[#136CB5] transition"
              >
                Why ECAMS?
              </a>
              <a
                href="#testimonials"
                className="text-gray-700 font-medium hover:text-[#136CB5] transition"
              >
                Testimonials
              </a>
            </nav>
          </div>
          <div className="flex justify-center items-center gap-2">
            <Button
              variant={"custom"}
              className="px-5 shadow-lg hover:opacity-95 hover:scale-105 hover:shadow-xl transition duration-300"
              onClick={() => navigate("/login")}
            >
              Sign in
            </Button>
            <Button
              variant={"custom"}
              className="px-5 shadow-lg hover:opacity-95 hover:scale-105 hover:shadow-xl transition duration-300"
              onClick={() => navigate("/choose-register")}
            >
              Sign up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative text-black text-left py-20  flex items-center justify-center">
        <div className="w-1/2 px-12">
          {/* Wrapper có kích thước cố định để giữ chỗ */}
          <div className="h-[80px] flex items-center justify-start">
            <TypingAnimation
              key={key}
              className="text-6xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-[#136CB5] to-[#49BBBD] bg-clip-text text-transparent transition-opacity duration-300 "
              startOnView={true}
            >
              Welcome to ECAMS!
            </TypingAnimation>
          </div>

          <p className="mt-4 text-xl font-light">
            Join our vibrant community to explore events, connect with clubs,
            and create unforgettable memories.
          </p>
          <div className="mt-10 flex justify-start space-x-6 ">
            <button
              onClick={() => navigate("/choose-register")}
              className="bg-gradient-to-r from-[#136CB5] to-[#49BBBD] text-white hover:opacity-95 hover:scale-105 hover:shadow-xl px-8 py-4 rounded-lg shadow-lg font-semibold transition duration-300"
            >
              Get Started
            </button>
          </div>
        </div>
        <div className="hero-image w-1/2">
          <img
            src="https://res.cloudinary.com/ecams/image/upload/v1744098313/unsplash_ugaOk9LkmQY_bbvr93.png"
            alt=""
          />
        </div>
      </section>

      {/* Marquee Section */}

      {/* About Section */}
      <section id="about" className="py-16 bg-gray-50">
        <div className="container mx-auto text-center">
          <h3 className="text-4xl font-bold text-gray-800 mb-6">About ECAMS</h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ECAMS is dedicated to fostering connections and creating
            opportunities through events and clubs. Join us and be part of a
            thriving community where experiences and learning come together.
          </p>
        </div>
        <div className="flex justify-center items-center">
          <ImageCarousel />
        </div>
      </section>

      {/* Why choose us Section */}
      <section id="why-choose-us" className="py-16  text-center">
        <h2 className="text-4xl font-bold text-black mb-6">
          Why Choose ECAMS?
        </h2>
        {/* <div className="flex items-center p-6">
          <img
            src="https://res.cloudinary.com/ecams/image/upload/v1739170806/unsplash_ugaOk9LkmQY_l2jbgn.png"
            alt="Easy Connection"
            className="w-1/2 mr-4"
          />
          <div className="w-1/2">
            <h3 className="text-xl text-black font-semibold">
              📌 Easy Connection
            </h3>
            <p className="text-black mt-2">
              Find and connect with students & organizations easily.
            </p>
          </div>
        </div>
        <div className="flex items-center p-6 ">
          <div className="w-1/2">
            <h3 className="text-xl text-black font-semibold">
              ⚡ Instant Updates
            </h3>
            <p className="text-black mt-2">
              Stay updated on the latest news, events, and discussions.
            </p>
          </div>
          <img
            src="https://res.cloudinary.com/ecams/image/upload/v1739189258/unsplash_qfWMUXDcN18_wq7oep.png"
            alt="Instant Updates"
            className="w-1/2 mr-4 "
          />
        </div>
        <div className="flex items-center p-6">
          <img
            src="https://res.cloudinary.com/ecams/image/upload/v1739170806/unsplash_ugaOk9LkmQY_l2jbgn.png"
            alt="AI-Powered Features"
            className=" mr-4 w-1/2"
          />
          <div className="w-1/2">
            <h3 className="text-xl text-black font-semibold">
              🤖 AI-Powered Features
            </h3>
            <p className="text-black mt-2">
              Smart recommendations tailored to your interests.
            </p>
          </div>
        </div> */}
        <BentoGrid className="px-16 py-8">
          {features.map((feature, idx) => (
            <BentoCard key={idx} {...feature} />
          ))}
        </BentoGrid>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-gray-50">
        <div className="container mx-auto text-center">
          <h3 className="text-4xl font-bold text-gray-800 mb-6">
            What People Say
          </h3>
          <Marquee
            className="text-lg font-medium text-[#136CB5] [--duration: 20s]"
            pauseOnHover
          >
            <div className="flex space-x-6">
              {[1, 2, 3].map((testimonial) => (
                <figure
                  key={testimonial}
                  className="relative  w-[300px] md:w-[350px] lg:w-[400px] cursor-pointer overflow-hidden rounded-xl border p-4 
              border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05] 
              dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15] flex-shrink-0"
                >
                  <div className="flex flex-row items-center gap-2">
                    <img
                      className="rounded-full"
                      width="32"
                      height="32"
                      alt=""
                      src={`https://avatar.vercel.sh/${testimonial}`}
                    />
                    <div className="flex flex-col">
                      <figcaption className="text-sm font-medium dark:text-white">
                        User {testimonial}
                      </figcaption>
                      <p className="text-xs font-medium dark:text-white/40">
                        @user{testimonial}
                      </p>
                    </div>
                  </div>
                  <blockquote className="mt-2 text-sm text-gray-600 dark:text-white/80">
                    "ECAMS has been a life-changing experience. The events are
                    well-organized, and the clubs are incredibly welcoming!"
                  </blockquote>
                </figure>
              ))}
            </div>
          </Marquee>
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="cta" className="py-16  text-black text-center">
        <AnimatedGradientText>
          🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-gray-300" />{" "}
          <span
            className={
              "inline animate-gradient bg-gradient-to-r from-[#136CB5] via-[#6A5ACD] to-[#49BBBD] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent text-4xl text-bold"
            }
          >
            Ready to Transform Your Campus Experience?
          </span>
        </AnimatedGradientText>
        <p className="text-lg mb-8 mt-6">
          Join thousands of students who are already using ECAMS to stay
          connected and engaged!
        </p>
        <button
          onClick={() => navigate("/choose-register")}
          className="bg-gradient-to-r from-[#136CB5] to-[#49BBBD] text-white hover:opacity-95 hover:scale-105 hover:shadow-xl px-8 py-4 rounded-lg shadow-lg font-semibold transition duration-300"
        >
          Sign up now
        </button>
      </section>

      {/* Footer Section */}
      <footer className="bg-gradient-to-r from-[#136CB5] to-[#49BBBD] text-white py-12">
        <div className="container mx-auto text-center">
          <p className="text-lg font-medium">
            &copy; 2025 ECAMS. All rights reserved.
          </p>
          <div className="mt-6 flex justify-center space-x-6">
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="hover:underline">
              Terms of Service
            </a>
            <a href="#" className="hover:underline">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GuestLandingPage;
