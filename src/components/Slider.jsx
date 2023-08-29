import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

const Slider = ({ title, slides }) => {
  return (
    <div className="max-w-screen-lg mx-auto my-10">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <Carousel
        showArrows={true}
        showThumbs={false}
        showStatus={false}
        infiniteLoop={true}
        autoPlay={true}
        interval={5000} // Change interval time as desired
        transitionTime={500} // Change transition time as desired
        stopOnHover={false}
        className="relative"
      >
        {slides.map((slide, index) => (
          <div key={index} className="w-full h-[300px] sm:h-[400px] lg:h-[500px] relative">
            <img src={slide} alt="Movie Poster" className="object-contain w-full h-full" />
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default Slider;

