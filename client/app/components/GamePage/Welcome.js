import Image from "next/image";
import TimeLine from "./Timeline";
import Player from "./Player";
import { motion } from "framer-motion";

const Welcome = ({ otters }) => {
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
  return (
    <motion.div
      style={{
        background: "rgba(255, 255, 255, 0.40)",
        backdropFilter: "blur(3.5px)",
      }}
      className="flex flex-col items-center w-[533px] rounded-xl h-[732px] justify-center"
    >
      <div className="flex flex-row gap-[51px] items-center">
        <Player name="Player 1" otter={otter} loc="Alcatraz Island" />
        <div className="h-[60%] bg-white w-[1px]"></div>
        <div className="flex flex-col gap-2">
          <h1 className="w-[222px] text-3xl leading-tight font-semibold">
            Welcome to Monterey Bay
          </h1>
          <p className="text-xl">Home of the otters</p>
        </div>
      </div>
      {progress.map((p, index) => (
        <TimeLine key={index} title={p.title} completed={p.completed} />
      ))}
    </motion.div>
  );
};

export default Welcome;
