import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Stats = () => {
  const [obj, _setObj] = useState({
    currentType: "Rosa",
    goalAdvance: "idk",
    prog: 0,
    turnNumber: 0,
  });

  const [action, setAction] = useState({});

  const getAction = () => {
    fetch("http://127.0.0.1:5000/get_action")
      .then((response) => response.json())
      .then((data) => {
        setAction(data);
      });
  };

  useEffect(() => {
    getAction();
  }, []);

  async function generateObjective() {
    try {
      const response = await fetch("http://127.0.0.1:5000/generate_objective");
      const result = await response.json();
      currentType, goalAdvance, prog, (turnNumber = result);
      _setObj({
        currentType,
        goalAdvance,
        prog,
        turnNumber,
      });
    } catch (err) {}
  }

  return (
    <div className="flex mt-[23px] flex-col">
      <div className="flex flex-row gap-[42px] items-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#3765B6] cursor-pointer text-[20px] rounded-xl font-semibold w-[298px] py-[19px] px-[55px]"
        >
          Generate Objective
        </motion.button>
        <div className="flex flex-col text-[20px] leading-[110%] font-semibold">
          <p>{obj.prog} adv</p>
          <p>{obj.turnNumber} </p>
        </div>
      </div>
      <div className="h-[288px] w-[448px] bg-[#2557B4] mt-[23px] flex flex-col items-center justify-center rounded-xl">
        <div>
          <h1 className="text-[48px] font-semibold">{obj.currentType} Card</h1>
          <p className="text-[16px] w-[341px]">
            you can now draw a card form the opponent without knowing the
            opponent might respond to your card
          </p>
        </div>
      </div>
      <div className="bg-[#3765B6] mt-[23px] text-[20px] rounded-xl font-semibold w-[100%] py-[19px] px-[55px]">
        {action.action}
      </div>
    </div>
  );
};

export default Stats;
