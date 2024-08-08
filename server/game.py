from otter import Otter

class Game():
    def __init__(self, players):
        self.players = players
        self.game_state = 0
        self.current_player = 0
        self.cards = [
            "ai",
            "ac",
            "as",
            "ar",
            "ag",
            "kw",
            "kc",
            "kr",
            "kg"
        ]
        
        for player in self.players:
            player.init_deck(self.cards)
            player.generateObjective(self.cards)
    
        
    def start_game(self):
        self.game_state = 1
        
    def check_end_game(self):
        # check if any player has reached progress == 7
        for player in self.players:
            if player.progress == 7:
                self.end_game()
                break
    
    def end_game(self):
        self.game_state = -1
    
    def add_player(self, player):
        self.players.append(player)
        
    def get_current_player(self):
        return self.players[self.current_player]
    
    def next_player(self):
        self.current_player = (self.current_player + 1) % len(self.players)
    
    def get_current_player(self):
        return self.players[self.current_player]
    
    def game_over(self):
        return self.game_state == -1
    
    def play_cards(self, cards):
        self.players[self.current_player].checkObjective(cards)
    
    def play_turn(self, cards):
        curr_player = self.get_current_player()
        self.play_cards(cards)
        self.next_player()

    def print_players(self):
        for player in self.players:
            print(player.name)

if __name__ == "__main__":
    game = Game([
        Otter("Alice"),
        Otter("Bob"),
    ])
    
    game.start_game()
    game.get_current_player().printObjective()
    game.play_turn(["ai", "ac", "kc"])
    game.get_current_player().printObjective()
    game.play_turn(["ai", "ac", "kc"])
    game.get_current_player().printObjective()
    game.play_turn(["kw"])
    game.get_current_player().printObjective()
    game.play_turn(["kw"])
    game.get_current_player().printObjective()
    game.play_turn(["as", "kc"])
    game.get_current_player().printObjective()
    game.play_turn(["as", "kc"])
    game.get_current_player().printObjective()
       
    