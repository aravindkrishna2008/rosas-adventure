import asyncio
import websockets
import cv2
import numpy as np

async def receive_video(websocket, path):
    try:
        while True:
            frame_data = await websocket.recv()
            nparr = np.frombuffer(frame_data, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            # cv2.imshow('Received Frame', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

    except websockets.exceptions.ConnectionClosed:
        print("Connection closed")
    finally:
        cv2.destroyAllWindows()

start_server = websockets.serve(receive_video, "localhost", 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()