import "ldrs/pinwheel";
import { pinwheel } from "ldrs";

pinwheel.register();

const LoadingAnimation = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <l-pinwheel
        size="35"
        stroke="3.5"
        speed="0.9"
        color="#136CB5"
      ></l-pinwheel>
    </div>
  );
};

export default LoadingAnimation;
