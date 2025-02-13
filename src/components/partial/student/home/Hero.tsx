export const Hero = () => {
  return (
    <section className="relative w-full h-auto min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[500px] flex items-center justify-center bg-black text-white  rounded-xl px-5">
      <img
        src="https://res.cloudinary.com/ecams/image/upload/v1739262936/unsplash_F2KRf_QfCqw_nxmkmz.png"
        alt="Hero Background"
        className="absolute inset-0 w-full h-full object-cover opacity-50  rounded-xl px-5"
      />
      <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-center z-10">
        MADE FOR THOSE <br /> WHO DO
      </h1>
    </section>
  );
};
