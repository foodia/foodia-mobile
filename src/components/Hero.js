import Image from "next/image";
import foodia from "../../public/img/foodia-hero.png";

const Hero = () => {
  return (
    <Image
      className="max-h-[500px] w-full rounded-lg"
      src={foodia}
      width={480}
      height={600}
      alt="Girl in a jacket"
    />
  );
};

export default Hero;
