from otter import Otter

class Game():
    def __init__(self, players):
        self.players = players
        self.game_state = 0
        self.current_player = 0  
        self.has_drawn = False
        self.card_pile = []
        
        self.discard_pile = []
        self.add_pile = []
                
    def start_game(self):
        self.game_state = 1
        
    def end_game(self):
        self.game_state = -1
    
    def add_player(self, player):
        self.players.append(player)
    
    def print_players(self):
        for player in self.players:
            print(player.name)
            
    def get_current_player(self):
        return self.players[self.current_player]
            
    def scan_cards(self, card):
        curr_player = self.get_current_player()
        print("card is " + card)
        if (curr_player.turn_number == 0):
            print("draw card")
            curr_player.draw_card(card)
            if (len(curr_player.cards) >= 2):
                self.next_player()
        else:
            self.card_pile.append(card)
            if (curr_player.skip_turn == True):
                curr_player.skip_turn = False
                self.next_player()
            elif (curr_player.tidal_trouble > 0 and (card == "jellyfish" or card=="urchin" or card == "fishing_net" or card == "human_interference" or card == "oil_spill")):
                curr_player.PlayCard(card, self.discard_pile, self.add_pile, self.players, self.current_player)
                curr_player.tidal_trouble -= 1
            elif (not self.has_drawn):
                self.tidle_trouble = 0
                curr_player.draw_card(card)
                self.has_drawn = True
            else:
                self.tidble_trouble = 0
                print("play card")
                curr_player.PlayCard(card, self.discard_pile, self.add_pile, self.players, self.current_player)
        print(self.get_current_player().name, self.generate_action())
        
                
    def generate_action(self):
        if (self.get_current_player().turn_number == 0):
            return {
                "action": "You now need to draw a card",
            }
        elif (self.get_current_player().tidal_trouble > 0):
            return {
                "action": "Tidal Trouble is what you have to play"
                }
        elif (self.has_drawn):
            return {
                "action": "Play any card you want"
            }
        else:
            return {
                "action": "You now need to draw a card",
            }

    def next_player(self):
        self.get_current_player().turn_number += 1
        self.has_drawn = False
        self.discard_pile = []
        self.add_pile = []
        
        self.current_player = (self.current_player + 1) % len(self.players)
        if (self.get_current_player().skip_turn):
            self.next_player()
        
        self.get_current_player().endObjective()
        
            
    def generate_objective(self): #don't we alr have a function for this'
        obj = self.get_current_player().generateObjective()
        return obj
        
    def add_discard(self, card):
        self.discard_pile.append(card)
    
    def add_add(self, card):
        self.add_pile.append(card)
    
    def get_game(self):
        current = self.get_current_player()
        obj = {
            "current_player": current.name,
            "objective": current.objective,   
        }

if __name__ == "__main__":
    game = Game([
        Otter("Alice"),
        Otter("Bob"),
    ])
    game.start_game()
    game.scan_cards("ivy")
    game.scan_cards("ivy")
