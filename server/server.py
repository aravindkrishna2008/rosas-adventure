import asyncio
import websockets
import cv2
import numpy as np
from qrcode import scanFromQRCode

from game import Game
from otter import Otter

players = ()
current_websocket = None

async def handle_connection(websocket, path):
    global players, current_websocket

    # If there's an existing connection, close it
    if current_websocket is not None:
        try:
            await current_websocket.close()
        except:
            pass

    # Update the current websocket connection
    current_websocket = websocket

    game = Game([])
    try:
        # send all players to client
        playerString = 'ig '
        for player in players:
            playerString = playerString + player + ' alcatraz_island '
        await websocket.send(playerString)

        while True:
            message = await websocket.recv()
            
            if isinstance(message, str):
                print(f"Received text message: {message}")
                # Add more logic here to process the text message
                # await websocket.send(f"Server received your message: {message}")
            else:
                # Handle binary data (video frame)
                nparr = np.frombuffer(message, np.uint8)
                frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                rtvl, info, points = scanFromQRCode(frame)
                if rtvl:
                    print(rtvl)
                    rtvl_array = rtvl.split(' ')
                    action = rtvl_array[0]
                    if (action == 'p'):
                        print("ccccccccccc")
                        if rtvl_array[1] not in players:
                            players = players + (rtvl_array[1],)
                            print(players)
                            game.add_player(Otter(rtvl_array[1]))
                            await websocket.send('ic ' + rtvl_array[1])
                            # game.print_players()
                
                cv2.imshow('frame', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

    except websockets.exceptions.ConnectionClosed:
        print("Connection closed")
    finally:
        cv2.destroyAllWindows()

start_server = websockets.serve(handle_connection, "localhost", 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()