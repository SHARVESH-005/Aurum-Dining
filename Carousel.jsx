import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import food1 from "/assets/food1.jpg";
import food2 from "/assets/food2.jpg";
import food5 from "/assets/food5.avif";
import restaurant1 from "/assets/restaurant1.avif";

const images = [food1, food2, food5, restaurant1];

const Carousel = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-2xl shadow-lg mt-4">
      <AnimatePresence>
        <motion.img
          key={index}
          src={images[index]}
          alt={`Slide ${index}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full h-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${i === index ? "bg-white" : "bg-gray-400"} transition`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
