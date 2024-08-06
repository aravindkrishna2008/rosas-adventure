import Player from "./Player";

const PlayerCards = () => {
  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.40)",
        backdropFilter: "blur(3.5px)",
      }}
      className="w-[533px] h-[242px] rounded-xl px-[31px] py-[20px] flex flex-col"
    >
      <h1 className="text-3xl font-semibold">Next:</h1>
      <div className="flex flex-row mt-[13px] gap-6">
        <Player name="Player 1" otter="otter1" loc="Alcatraz Island" />
        <Player name="Player 1" otter="otter1" loc="Alcatraz Island" />
        <Player name="Player 1" otter="otter1" loc="Alcatraz Island" />
        <Player name="Player 1" otter="otter1" loc="Alcatraz Island" />
      </div>
    </div>
  );
};

export default PlayerCards;
