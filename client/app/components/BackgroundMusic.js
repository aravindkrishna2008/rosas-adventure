// components/AudioPlayer.js
import { useEffect, useRef } from "react";

const AudioPlayer = ({ src }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current.volume = 1; // Set initial volume
  }, []);

  return (
    <audio ref={audioRef} loop autoPlay>
      <source src={src} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  );
};

export default AudioPlayer;
