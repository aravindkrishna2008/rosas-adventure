"use client";
import Image from "next/image";
import WebcamStream from "../components/WebSocket/WebSocketComponentLarge";
import Welcome from "../components/GamePage/Welcome";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

import PlayerCards from "../components/GamePage/PlayersCards";

export default function Home() {
  const wsRef = useRef(null);
  const [otters, _setOtters] = useState([]);
  const ottersRef = useRef(otters);
  const setOtters = (data) => {
    ottersRef.current = data;
    _setOtters(data);
  };

  useEffect(() => {
    wsRef.current = new WebSocket("ws://localhost:8765");

    wsRef.current.onopen = () => {
      console.log("Connected to WebSocket");
    };

    wsRef.current.onclose = () => {
      console.log("Disconnected from WebSocket");
    };

    wsRef.current.onmessage = (event) => {
      console.log(event.data);
      if (event.data.split(" ")[0] === "ig") {
        for (let i = 1; i < event.data.split(" ").length; i += 2) {
          if (event.data.split(" ")[i] === "") {
            continue;
          }
          const name = event.data.split(" ")[i];
          const loc = event.data.split(" ")[i + 1];
          setOtters([...ottersRef.current, { name, otter: "otter1", loc }]);
        }
      }
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }

      console.log("Disconnected from WebSocket");
    };
  }, []);

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

  const pages = [
    <WebcamStream />,
    <Welcome />,
    <PlayerCards otters={otters} />,
  ];
  const [page, setPage] = useState([0, 1]);

  const handleNextPage = () => {
    if (page[1] === pages.length - 1) {
      setPage([page[1], 0]);
      return;
    }
    setPage([page[1], page[1] + 1]);
  };

  const handlePrevPage = () => {
    if (page[0] === 0) {
      setPage([pages.length - 1, page[0]]);
      return;
    }
    setPage([page[0] - 1, page[0]]);
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
      className="bg-[#2963CD] h-[100vh] z-10 w-[100vw] gap-[52px] flex flex-row items-center justify-center px-16"
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
          className="absolute z-10 top-4 right-4 w-[24px] h-[24px] rounded-full bg-[#2963CD] flex items-center justify-center"
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
          className="absolute z-10 top-4 right-4 w-[24px] h-[px] rounded-full bg-[#2963CD] flex items-center justify-center"
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
      <motion.div
        className="relative gap-[57px] flex flex-row"
        variants={itemVariants}
      >
        {/* <WebcamStream width={100} />
        <Welcome /> */}
        {pages.map((p, index) => {
          if (index >= page[0] && index <= page[1]) {
            return p;
          }
        })}
      </motion.div>
      {page[1] != 2 ? (
        <Image
          src="/icons/chevron.svg"
          width={1000}
          height={1000}
          className="w-[24px] h-[24px] absolute right-4 cursor-pointer"
          onClick={handleNextPage}
        />
      ) : (
        <Image
          src="/icons/chevron.svg"
          width={1000}
          height={1000}
          className="w-[24px] h-[24px] absolute left-4 cursor-pointer rotate-180"
          onClick={handlePrevPage}
        />
      )}
    </motion.div>
  );
}
