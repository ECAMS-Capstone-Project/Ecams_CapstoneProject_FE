import Slider from "react-slick";

const ImageCarousel = () => {
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
    autoplaySpeed: 1000,
  };

  return (
    <div className="carousel-container w-full max-w-screen-xl mt-8">
      <Slider {...settings}>
        <div className="w-full  flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/ecams/image/upload/v1744098014/Screenshot_2025-02-10_at_18.06.42_sieiwe.png"
            alt="Image 1"
            className="w-3/4 h-auto object-cover"
          />
        </div>
        <div className="w-full  flex justify-center items-center">
          <img
            src="https://res.cloudinary.com/ecams/image/upload/v1744098014/Screenshot_2025-02-10_at_18.09.07_gvntue.png"
            alt="Image 2"
            className="w-3/4 h-auto object-cover "
          />
        </div>
        <div className="w-full  flex justify-center items-center">
          <img
            src="https://res.cloudinary.com/ecams/image/upload/v1744098013/Screenshot_2025-02-10_at_18.09.30_zjgyw2.png"
            alt="Image 3"
            className="w-3/4 h-auto object-cover "
          />
        </div>
      </Slider>
    </div>
  );
};

export default ImageCarousel;
