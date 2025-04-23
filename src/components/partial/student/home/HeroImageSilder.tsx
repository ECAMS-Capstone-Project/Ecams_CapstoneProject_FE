import Slider from "react-slick";

const HeroImageCarousel = () => {
  // Cấu hình của React Slick
  const settings = {
    dots: true, // Hiển thị dấu chấm điều hướng
    infinite: true, // Lặp lại vô hạn
    speed: 1000, // Tốc độ chuyển slide
    slidesToShow: 1, // Hiển thị 3 ảnh cùng lúc
    slidesToScroll: 1, // Cuộn 1 ảnh mỗi lần
    responsive: [
      {
        breakpoint: 1024, // Màn hình rộng trên 1024px
        settings: {
          slidesToShow: 1, // Hiển thị 2 ảnh trên màn hình nhỏ
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600, // Màn hình nhỏ hơn 600px
        settings: {
          slidesToShow: 1, // Hiển thị 1 ảnh trên màn hình rất nhỏ
          slidesToScroll: 1,
        },
      },
    ],
    autoplay: true,
    autoplaySpeed: 3000,
  };
  const images = [
    "https://res.cloudinary.com/ecams/image/upload/v1744988374/ECAMS_Project_Image_upowhl.png",
    "https://res.cloudinary.com/ecams/image/upload/v1744988751/FPT_Hackathon_2025_Chip_AI_Logistics_a278in.jpg",
    "https://res.cloudinary.com/ecams/image/upload/v1744990122/Concert_Photo_Group_Unsplash_imd4wl.jpg",
    "https://res.cloudinary.com/ecams/image/upload/v1744990743/FPT_Techday_2024_Future_Now_pz3yrk.webp",
  ];

  return (
    <div className="w-full h-full">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div className="w-full h-full" key={index}>
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full sm:h-[350px] md:h-[400px] lg:h-[500px] object-cover rounded-xl"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroImageCarousel;
