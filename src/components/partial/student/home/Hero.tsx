import HeroImageCarousel from "./HeroImageSilder";

export const Hero = () => {
  return (
    <section className="relative w-full h-auto min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[500px] flex items-center justify-center bg-black text-white  rounded-xl">
      <HeroImageCarousel />
    </section>
  );
};
