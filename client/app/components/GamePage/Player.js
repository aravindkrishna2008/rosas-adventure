import Image from "next/image";
import { motion } from "framer-motion";

const Player = ({ name, loc, otter }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex flex-col text-center gap-2"
    >
      <Image
        src={"/otters/" + otter + ".png"}
        width={1000}
        height={1000}
        className="w-[100px] h-[100px] object-cover rounded-full border-[6px] border-[#2963CD]"
      />
      <h2 className="text-xl text-white leading-3">{name}</h2>
      <h3
        style={{
          color: "rgba(255, 255, 255, 0.80)",
        }}
        className="text-base font-light whitespace-nowrap"
      >
        {loc}
      </h3>
    </motion.div>
  );
};

export default Player;
