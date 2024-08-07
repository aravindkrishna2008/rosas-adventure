"use client";
import Image from "next/image";
import Player from "./components/MainPage/Player";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

import { useRouter } from "next/navigation";

import Link from "next/link";

export default function Home() {
  const [otters, _setOtters] = useState([]);
  const router = useRouter();
  const ottersRef = useRef(otters);
  const setOtters = (data) => {
    ottersRef.current = data;
    _setOtters(data);
  };
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

  const videoRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    // Set up WebSocket connection
    wsRef.current = new WebSocket("ws://localhost:8765");

    wsRef.current.onopen = () => {
      console.log("Connected to WebSocket");
      setIsConnected(true);
      startStreaming();
    };

    wsRef.current.onclose = () => {
      console.log("Disconnected from WebSocket");
      setIsConnected(false);
    };

    // Add onmessage handler
    wsRef.current.onmessage = (event) => {
      console.log(event.data);
      if (event.data.split(" ")[0] === "ic") {
        const name = event.data.split(" ")[1];
        const otter = event.data.split(" ")[2];
        setOtters([...ottersRef.current, { name, otter: "otter1" }]);
      }
      if (event.data.split(" ")[0] === "ig") {
        for (let i = 1; i < event.data.split(" ").length; i += 1) {
          if (event.data.split(" ")[i] === "") {
            continue;
          }
          const name = event.data.split(" ")[i];
          setOtters([...ottersRef.current, { name, otter: "otter1" }]);
        }
      }
    };

    // Clean up
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const startStreaming = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Set up canvas for capturing video frames
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const video = videoRef.current;

      const sendFrame = () => {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Convert frame to JPEG and send via WebSocket
          canvas.toBlob(
            (blob) => {
              if (wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.send(blob);
              }
            },
            "image/jpeg",
            0.8
          );
        }
        requestAnimationFrame(sendFrame);
      };

      video.onloadedmetadata = () => {
        sendFrame();
      };
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
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
          className="absolute z-10 top-4 right-4 w-[24px] h-[24px] rounded-full bg-[#2963CD] flex items-center justify-center"
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
        {isConnected ? (
          <video
            className={`h-[548px] w-[465px] object-cover rounded-xl`}
            ref={videoRef}
            autoPlay
            playsInline
            muted
          />
        ) : (
          <p>Connecting to server...</p>
        )}
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
            onClick={() => {
              router.push("/game");
            }}
          >
            Begin Adventure
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
