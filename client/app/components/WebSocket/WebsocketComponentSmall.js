import { useEffect, useRef, useState } from "react";

export default function WebcamStream({ width = 465, height = 548 }) {
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

    // Clean up
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const startStreaming = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
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

  return (
    <div>
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
    </div>
  );
}
