import Player from "./Player";

const PlayerCards = ({ otters }) => {
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
        {otters.map((otter, index) => (
          <Player
            key={index}
            name={otter.name}
            otter={otter.otter}
            loc={otter.loc}
          />
        ))}
      </div>
    </div>
  );
};

export default PlayerCards;
