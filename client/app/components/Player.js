import Image from "next/image";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Player = ({ otter, name, setOtters, otters }) => {
  const [clicked, setClicked] = useState(false);
  const audioRef = useRef(null);

  const handlePlaySound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <AnimatePresence>
      <audio ref={audioRef} src="/soundfx/pop.mp3"  />
      <motion.div
        layout
        className="flex flex-row duration-300 transition-all gap-2"
        initial={{ scale: 1, opacity: 1 }}
        exit={{
          scale: 0,
          opacity: 0,
          transition: {
            duration: 0.2,
            ease: "easeInOut",
          },
        }}
      >
        <motion.div
          layout
          whileHover={{ scale: 1.05 }}
          initial={{ width: "629px" }}
          animate={{ width: clicked ? "579px" : "629px" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{
            background: "rgba(255, 255, 255, 0.40)",
            backdropFilter: "blur(3.5px)",
          }}
          className="py-[5px] px-[26px] rounded-xl flex flex-row items-center justify-between"
          onClick={() => setClicked(!clicked)}
        >
          <div className="flex flex-row items-center gap-[22px]">
            <Image
              src={"/otters/" + otter + ".png"}
              width={1000}
              height={1000}
              className="w-[77px] h-[77px] object-cover rounded-full border-[6px] border-[#2963CD]"
            />
            <h1 className="text-3xl">{name}</h1>
          </div>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.8 }}>
            <Image
              src="/icons/edit.svg"
              width={1000}
              height={1000}
              className="w-[24px] h-[24px] cursor-pointer"
            />
          </motion.button>
        </motion.div>
        <AnimatePresence>
          {clicked && (
            <motion.button
              layout
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "50px", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                background: "rgba(255, 255, 255, 0.40)",
                backdropFilter: "blur(3.5px)",
              }}
              className="flex items-center justify-center rounded-xl overflow-hidden"
              onClick={() => {
                setClicked(!clicked);
                setOtters(otters.filter((o) => o.name !== name));
                handlePlaySound();
              }}
            >
              <Image
                src="/icons/remove_user.svg"
                className="w-[24px] h-[24px] cursor-pointer"
                height={1000}
                width={1000}
              />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default Player;
