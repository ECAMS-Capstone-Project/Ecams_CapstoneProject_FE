// import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section className="relative text-black text-left py-20 flex flex-col md:flex-row items-center justify-center">
      <div className="w-full md:w-1/2 px-6 md:px-12 text-center md:text-left">
        {/* Wrapper có kích thước cố định để giữ chỗ */}
        <div className=" flex-col items-center justify-start md:justify-start space-y-4">
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Thriving Above Event Expectations.
            </p>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight md:leading-snug">
              <span className="bg-gradient-to-r from-[#136CB5] to-[#49BBBD] bg-clip-text text-transparent">
                ECAMS
              </span>
              <span className="text-black">
                {" "}
                – Where Unforgettable Experiences Begin.
              </span>
            </h1>
          </div>
        </div>
      </div>

      {/* Ẩn ảnh khi màn hình nhỏ hơn 640px */}
      <div className="hero-image w-full md:w-1/2 hidden sm:block">
        <img
          src="https://res.cloudinary.com/ecams/image/upload/v1739170806/unsplash_ugaOk9LkmQY_l2jbgn.png"
          alt="Hero Image"
          className="w-full h-auto"
        />
      </div>
    </section>
  );
};
