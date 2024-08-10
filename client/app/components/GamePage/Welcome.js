import Image from "next/image";
import TimeLine from "./Timeline";
import Player from "./Player";
import { motion } from "framer-motion";

import { useState } from "react";
import Stats from "./Stats";

const Welcome = ({ otters, currentOtter }) => {
  const otter = "otter1";
  const progress = [
    { title: "Explore the depths of Napa", completed: true },
    { title: "Visit the Golden Gate Bridge", completed: true },
    { title: "Visit the Golden Gate Bridge", completed: false },
    { title: "Visit the Golden Gate Bridge", completed: false },
    { title: "Visit the Golden Gate Bridge", completed: false },
    { title: "Visit the Golden Gate Bridge", completed: false },
    { title: "Visit the Golden Gate Bridge", completed: false },
  ];

  const [carasoulIndex, setCarasoulIndex] = useState(1);
  const carosoul = [
    <>
      {progress.map((p, index) => (
        <TimeLine key={index} title={p.title} completed={p.completed} />
      ))}
    </>,
    <Stats />,
  ];
  return (
    <motion.div
      style={{
        background: "rgba(255, 255, 255, 0.40)",
        backdropFilter: "blur(3.5px)",
      }}
      className="flex flex-col items-center w-[533px] rounded-xl h-[732px] justify-center"
    >
      <div className="flex flex-row gap-[51px] items-center">
        <Player name={currentOtter.name} otter={currentOtter.otter} loc={currentOtter.loc} />
        <div className="h-[60%] bg-white w-[1px]"></div>
        <div className="flex flex-col gap-2">
          <h1 className="w-[222px] text-3xl leading-tight font-semibold">
            Welcome to Monterey Bay
          </h1>
          <p className="text-xl">Home of the otters</p>
        </div>
      </div>
      {carosoul[carasoulIndex]}
      <div className="flex flex-row gap-2 mt-4">
        <div
          onClick={() => setCarasoulIndex(0)}
          className={`w-[10px] h-[10px] rounded-full bg-[#3765B6] cursor-pointer`}
        ></div>
        <div
          onClick={() => setCarasoulIndex(1)}
          className={`w-[10px] h-[10px] rounded-full bg-[#3765B6] cursor-pointer`}
        ></div>
      </div>
    </motion.div>
  );
};

export default Welcome;
