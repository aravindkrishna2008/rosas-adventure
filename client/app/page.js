"use client";
import Image from "next/image";
import Player from "./components/MainPage/Player";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

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

  const [mute, setMute] = useState(true);
  const [capturedImage, setCapturedImage] = useState(null);
  const canvasRef = useRef(null);

  const audioRef = useRef(null);

  const handlePlaySound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const [imageData, setImageData] = useState(null);
  const videoRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const capturePhoto = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      setImageData(URL.createObjectURL(blob));
      sendToServer(blob);
    }, "image/png");
  };

  const sendToServer = async (imageBlob) => {
    const formData = new FormData();
    formData.append("image", imageBlob, "captured_image.png");
    formData.append("action", "scan");

    try {
      const response = await fetch("http://127.0.0.1:5000/qrcode", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.action !== "unknown") {
        const player = result.player;
        setOtters([...otters, { name: player, otter: "otter1" }]);
      }
      // console.log("Server response:", result);
      // console.log(result.player);
    } catch (error) {
      console.error("Error sending image to server:", error);
    }
  };

  useEffect(() => {
    startCamera();
  }, []);

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
        <h2 className="text-3xl">Scan player cards to get started</h2>
      </motion.div>
      <motion.div
        className="relative gap-[57px] flex flex-row"
        variants={itemVariants}
      >
        <div className="flex flex-col items-center">
          <motion.button
            onClick={capturePhoto}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <video
              className={`h-[548px] w-[465px] object-cover rounded-xl`}
              ref={videoRef}
              autoPlay
              playsInline
              muted
            />
          </motion.button>
        </div>
        <div className="flex flex-col w-[649px] h-[100%] items-end justify-between">
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
