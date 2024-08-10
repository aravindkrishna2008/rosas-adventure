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

  const [currentOtter, _setCurrentOtter] = useState({
    name: "",
    otter: "",
    loc: "",
  });
  const currentOtterRef = useRef(currentOtter);
  const setCurrentOtter = (data) => {
    currentOtterRef.current = data;
    _setCurrentOtter(data);
  };

  const getPlayers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/get_players");
      const result = await response.json();
      setOtters(result.players);
      console.log(result.players[result.current_player].name);
      setCurrentOtter(result.players[result.current_player]);
    } catch (error) {
      console.error("Error getting players:", error);
    }
  };

  const [page, setPage] = useState([0, 1]);

  const [imageData, setImageData] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    if (streamRef.current) return; // If we already have a stream, don't create a new one
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const connectStreamToVideo = () => {
    if (streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
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
    } catch (error) {
      console.error("Error sending image to server:", error);
    }
  };

  useEffect(() => {
    startCamera();
    getPlayers();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    connectStreamToVideo();
  }, [page]);

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
    <motion.button
      key="video"
      onClick={async () => {
        capturePhoto();
        getPlayers();
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <video
        className={`h-[712px] w-[588px] object-cover rounded-xl`}
        ref={videoRef}
        autoPlay
        playsInline
        muted
      />
    </motion.button>,
    <Welcome key="welcome" currentOtter={currentOtterRef.current} />,
    <PlayerCards key="playerCards" otters={otters} />,
  ];

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
          <Image
            src="/icons/no_sound.svg"
            width={1000}
            height={1000}
            alt="Mute"
          />
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
          <Image
            src="/icons/sound.svg"
            width={1000}
            height={1000}
            alt="Unmute"
          />
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
        {pages.map((p, index) => {
          if (index >= page[0] && index <= page[1]) {
            return p;
          }
          return null;
        })}
      </motion.div>
      {page[1] != 2 ? (
        <Image
          src="/icons/chevron.svg"
          width={1000}
          height={1000}
          alt="Next"
          className="w-[24px] h-[24px] absolute right-4 cursor-pointer"
          onClick={handleNextPage}
        />
      ) : (
        <Image
          src="/icons/chevron.svg"
          width={1000}
          height={1000}
          alt="Previous"
          className="w-[24px] h-[24px] absolute left-4 cursor-pointer rotate-180"
          onClick={handlePrevPage}
        />
      )}
    </motion.div>
  );
}
