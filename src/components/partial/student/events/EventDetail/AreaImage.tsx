import { EventAreas } from "@/models/Area";
import Slider from "react-slick";

interface AreaImageProps {
  area: EventAreas[];
}

const AreaImageCarousel = ({ area }: AreaImageProps) => {
  // Cấu hình của React Slick
  const settings = {
    dots: area.length > 1, // Chỉ hiển thị dots nếu có nhiều hơn 1 area
    infinite: area.length > 1, // Nếu có 1 area thì không infinite
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    autoplay: area.length > 1, // Nếu có nhiều hơn 1 area thì autoplay
    autoplaySpeed: 1000,
  };

  return (
    <div className="carousel-container w-full max-w-screen-xl mt-4">
      <Slider {...settings}>
        {area.map((area) => (
          <div
            key={area.areaId}
            className="w-full flex flex-col items-center justify-center"
          >
            <img
              src={area.imageUrl}
              alt={`${area.name}`}
              className="w-full h-auto p-0.5 object-contain"
            />
            <p className="mt-2 text-center text-sm font-medium text-[#3b85c6] italic">
              {area.name}
            </p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default AreaImageCarousel;
