from flask import Flask, request, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

from qrcode import scanFromQRCode
import cv2
import numpy as np

from game import Game
from otter import Otter

game = Game([])

game.add_player(Otter("rosa"))
game.add_player(Otter("steve"))


location_map = {
    0: ""
}


# accept an image and return the decoded QR code
@app.route("/qrcode", methods=["POST"])
def qrcode():
    # get the image from the request
    print("received image")
    image = request.files["image"]
    action_type = request.form["action"]
    nparr = np.frombuffer(image.read(), np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # decode the QR code
    rtvl, info, points = scanFromQRCode(frame)
    if rtvl:
        rtvl_array = rtvl.split(" ")
        action = rtvl_array[0]
        print("action is " + action)
        if action == "p":
            print("add player")
            game.add_player(Otter(rtvl_array[1]))
            return jsonify({"action": "p", "player": rtvl_array[1]})
        else:
            if (action_type == "discard"):
                print("discard")
                game.add_discard(rtvl_array[0])
            if (action_type == "add"):
                print("add")
                game.add_add(rtvl_array[0])
            else:  
                print(rtvl_array[0] + " is the card")
                game.scan_cards(rtvl_array[0])

    return jsonify({"action": "unknown"})


@app.route('/get_current_player', methods=["GET"])  
def get_current_player():
    return jsonify({"player": game.get_current_player().name})

@app.route('/get_players', methods=["GET"])
def get_players():
    players = []
    for player in game.players:
        players.append( {
            "name": player.name,
            "loc": player.progress,
            "otter": "otter1",
            "tp": player.travel_points,
        }
        )
    return jsonify({"players": players, "current_player": game.current_player})

@app.route('/get_objective', methods=["GET"])
def get_objective():
    return jsonify({"objective": game.get_current_player().objective})

@app.route('/generate_objective', methods=["GET"])
def generate_objective():
    game.get_current_player().generate_objective()
    return jsonify({"objective": game.get_current_player().objective})

@app.route('/get_action', methods=["GET"])
def get_action():
    return jsonify(game.generate_action())


@app.route('/get_curr_loc', methods=["GET"])
def get_curr_loc():
    return jsonify({"loc": int(game.get_current_player().progress)})

@app.route("/startgame", methods=["POST"])
def start_game():
    game.start_game()
    return jsonify({"action": "startgame"})

@app.route("/endturn", methods=["POST"])
def end_turn():
    game.next_player()
    return jsonify({"action": "endturn"})

if __name__ == "__main__":
    app.run(port=5000)

