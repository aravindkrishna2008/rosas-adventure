"use client";
import Image from "next/image";
import WebcamStream from "./components/WebsocketComponent";
import Player from "./components/Player";
import { motion } from "framer-motion";
import { useState, useRef } from "react";

import AudioPlayer from "./components/BackgroundMusic";

export default function Home() {
  const [otters, setOtters] = useState([
    { name: "Player 1", otter: "otter1" },
    { name: "Bella", otter: "otter1" },
    { name: "Luna", otter: "otter1" },
  ]);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const [mute, setMute] = useState(true);

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const audioRef = useRef(null);

  const handlePlaySound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <motion.div
      className="bg-[#2963CD] h-[100vh] z-10 w-[100vw] gap-[52px] flex flex-col items-center justify-center px-16"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <audio ref={audioRef} src="/music/bg.mp3" loop />
      {mute ? (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.8 }}
          onClick={() => {
            setMute(false);
            audioRef.current.play();
            handlePlaySound();
          }}
          className="absolute z-10 top-4 right-4 w-[40px] h-[40px] rounded-full bg-[#2963CD] flex items-center justify-center"
        >
          <Image src="/icons/no_sound.svg" width={1000} height={1000} />
        </motion.button>
      ) : (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.8 }}
          onClick={() => {
            setMute(true);
            audioRef.current.pause();
            handlePlaySound();
          }}
          className="absolute z-10 top-4 right-4 w-[40px] h-[40px] rounded-full bg-[#2963CD] flex items-center justify-center"
        >
          <Image src="/icons/sound.svg" width={1000} height={1000} />
        </motion.button>
      )}
      <Image
        src="/background/default.png"
        className="w-[100vw] h-[100vh] absolute top-0 left-0"
        alt="hero"
        width={1000}
        height={1000}
      />
      <motion.div className="relative text-center" variants={itemVariants}>
        <h1 className="text-6xl font-semibold">Rosa's Adventure</h1>
        <h2 className="text-3xl">scan player cards to get started</h2>
      </motion.div>
      <motion.div
        className="relative gap-[57px] flex flex-row"
        variants={itemVariants}
      >
        <WebcamStream />
        <div className="flex flex-col items-end justify-between">
          <div className="flex flex-col gap-4">
            {otters.map((otter, index) => (
              <Player
                key={index}
                name={otter.name}
                otter={otter.otter}
                setOtters={setOtters}
                otters={otters}
              />
            ))}
          </div>
          <motion.button
            style={{
              background: "rgba(255, 255, 255, 0.40)",
              backdropFilter: "blur(3.5px)",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="py-[14px] px-[32px] rounded-xl w-[40%] text-2xl hover:opacity-80 duration-200"
          >
            Begin Adventure
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
