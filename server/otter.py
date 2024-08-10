import random

# REFERS TO PLAYER

class Otter():
    def __init__(self, name):
        self.name = name
        self.progress = 0
        self.position = 1
        self.map = {1: {2 : 1},
                    2: {3: 2},
                    3: {4: 2, 5: 3},
                    4: {6: 4},
                    5: {6: 3, 7: 4},
                    6: {8: 7},
                    7: {8: 6, 9: 5},
                    8: {10: 8},
                    9: {10: 9}}
        self.cards_list = ["kelp", "rock", "squid", "turtle", "bone_worm",
                      "urchin", "jellyfish", "fishing_net", "human_interference", "oil_spill"]
        self.cards_weights = {"kelp" : 1,
                              "rock" : 2,
                              "squid" : 3,
                              "turtle" : 4,
                              "bone_worm" : 5,
                              "urchin" : -1,
                              "jellyfish" : -2,
                              "fishing_net" : -3,
                              "human_interference" : -4,
                              "oil_spill" : -5}
        self.t = ['mission', 'natural disaster', 'surprise']
        self.travel_points = 0
        self.objectivecompleted = True
        self.objective = ['no'] * 3
        self.otter_cards = ['ivy', 'ruby', 'kit', 'selka', 'gidget']
        self.tidal_trouble = 0
        self.skip_turn = False
        self.cards = []
        self.turn_number = 0
    
    def throwDebugError(self, name):
        raise NameError(name, "and its info is", self)

    def init_deck(self, cards):
        self.cards = cards
    
    def draw_card(self, card):
        self.cards.append(card)

    def generateObjective(self):
        if len(self.t) == 0 or self.objectivecompleted == False:
            self.objective = "NOPE GET [REDACTED]"
        curr_t = self.t[random.randint(0, len(self.t) - 1)]
        self.t.remove(curr_t)
        
        if curr_t == 'surprise':
            goal_hand = [0] * random.randint(1 + int(self.progress / 2), 3 + self.progress)
            for i in range(len(goal_hand)):
                goal_hand[i] = self.cards_list[random.randint(0, len(self.cards_list) - 1)]
            self.objective = [curr_t, goal_hand, int(len(goal_hand)) + 2, self.turn_number] # maybe fix score balacing
        else:
            goal_adv = random.randint(1, 3 + self.progress)
            self.objective = [curr_t, goal_adv, int((self.progress + 1) + 3 * int(curr_t == 'mission')/ 2), self.turn_number]
        return self.objective

    def CompleteObjective(self):
        self.objectivecompleted = True
        self.travel_points += self.objective[2]
        self.objective = ["no"] * 3

    # cards is all cards the user plays
    def checkObjective(self, cards):
        if self.objective[0] == 'surprise':
            for i in range(len(cards)):
                self.objective[1].remove(cards[i])
            if len(self.objective[1]) == 0:
                self.CompleteObjective(self)
        else:
            for i in range(len(cards)):
                self.objective[1] -= self.cards_weights[cards[i]]
                if self.objective[1] == 0:
                    self.CompleteObjective()
                elif self.objective[0] == 'natural disaster' and self.objective[1] < 0:
                   self.checkObjective()

    def endObjective(self):
        if self.objective[-1] != "no" and self.turn_number - self.objective[-1] >= 3:
            self.objectivecompleted = True
            self.objective = ["no"] * 3

    def MoveTo(self, target):
        pass
        if self.travel_points >= self.map[self.position][target]:
            self.travel_points -= self.map[self.position][target]
            self.position = target
            self.progress += 1
            self.objectivecompleted = True
            self.objective = ["no"] * 3

    ##############################################################
    ##                                 __                       ##
    ##    __         __   \  /        /     __   __   __        ##
    ##   |  |  |    /__\   \/        |     /__\ |  | |  \       ##
    ##   |__|  |    |  |   |         |     |  | |-<  |   |      ##
    ##   |     |__  |  |   |         \__   |  | |  | |__/       ##
    ##                                                          ##
    ##                                                          ##
    ##############################################################

    def PlayCard(self, card_to_play, discarded_cards, new_cards, otters, curr_i): # otter, cards discarded (if ivy or tidal trouble), cards gained (in any manner), list of other players (only for selka)
        try:
            card = new_cards[0]
        except:
            pass
        try:
            discarded_card = discarded_cards[0]
        except:
            pass
        try:
            if card_to_play == "ivy":
                self.PlayIvy(discarded_cards, new_cards)
            elif card_to_play == "ruby":
                self.PlayRuby(card)
            elif card_to_play == "kit":
                self.PlayKit(card)
            elif card_to_play == "selka":
                self.PlaySelka(otters, new_cards)
            elif card_to_play == "gidget":
                self.PlayGidget()
            elif card_to_play == "kelp":
                self.PlayKelp(card)
            elif card_to_play == "rock":
                self.PlayRock(otters, curr_i)
            elif card_to_play == "squid":
                self.PlaySquid(otters, curr_i)
            elif card_to_play == "turtle":
                self.PlayTurtle(new_cards)
            elif card_to_play == "bone_worm":
                self.PlayBoneWorm(otters, curr_i, card)
            elif card_to_play == "urchin":
                self.PlayUrchin(discarded_card)
            elif card_to_play == "jellyfish":
                self.PlayJellyfish()
            elif card_to_play == "fishing_net":
                self.PlayFishingNet(discarded_cards)
            elif card_to_play == "human_interference":
                self.PlayHumanInterference(discarded_card)
            elif card_to_play == "oil_spill":
                self.PlayOilSpill(discarded_card)
            self.cards.remove(card_to_play)
        except:
            pass

    def PlayIvy(self, discarded_cards, new_cards):
        for i in range(len(discarded_cards)):
            self.cards.remove(discarded_cards[i])
            self.cards.append(new_cards[i])
        # self.cards.remove("ivy")

    def PlayRuby(self, card):
        self.draw_card(card)
        # self.cards.remove("ruby")

    def PlayKit(self, card):
        self.draw_card(card)
        if card in self.otter_cards:
            self.travel_points += 3
        elif card in self.cards_list[:5]:
            self.travel_points += 1
        # self.cards.remove("kit")

    def PlaySelka(self, otters, cards):
        # this has to be scanned in order or it won't work
        j = 0
        for i in range(len(otters)):
            if otters[i].name != self.name:
                otters[i].cards.remove(cards[j])
                self.cards.append(cards[j])
                j += 1
        # self.cards.remove("selka")

    def PlayGidget(self):
        self.objectivecompleted = True
        try:
            self.travel_points += int((self.objective[2] + 1) / 2)
        except:
            print("you had no objective t.t")
            pass
        self.objective = ["no"] * 3
        # self.cards.remove("gidget")
    
    def PlayKelp(self, card):
        # draw 1 card
        self.cards.append(card)
    
    def PlayRock(self, otters, curr_i):
        # next player needs to play tidal trouble
        otters[(curr_i + 1) % len(otters)].tidal_trouble += 1
    
    def PlaySquid(self, otters, curr_i):
        # skip next players turn
        otters[(curr_i + 1) % len(otters)].skip_turn = True

    def PlayTurtle(self, cards):
        # draw 3 cards
        for card in cards:
            self.cards.append(card)

    def PlayBoneWorm(self, otters, curr_i, card):
        # next player needs to play tidal trouble and take one random card from them
        otters[(curr_i + 1) % len(otters)].tidal_trouble += 2
        otters[(curr_i + 1) % len(otters)].cards.remove(card)
        self.cards.append(card)

    def PlayUrchin(self, card):
        # discard 1 kelp card
        self.cards.remove(card)

    def PlayJellyfish(self):
        # skip your next turn
        self.skip_turn = True

    def PlayFishingNet(self, cards):
        # discard 3 kelp cards
        for card in cards:
            self.cards.remove(card)

    def PlayHumanInterference(self, card):
        # skip your next turn
        self.skip_turn = True
        self.cards.remove(card)

    def PlayOilSpill(self, card):
        # discard 1 otter card
        self.cards.remove(card)

if __name__ == '__main__':
    otter = Otter("otter")
    otter2 = Otter("otter2")
    otter3 = Otter("otter3")
    # otter.generateObjective()
    # otter2.init_deck(["urchin"])
    # otter3.init_deck(["turtle"])
    # otter.init_deck(["kelp", "rock", "squid", "turtle", "bone_worm",
    #                   "urchin", "jellyfish", "fishing_net", "human_interference", "oil_spill",
    #                   'ivy', 'ruby', 'kit', 'selka', 'gidget'])
    # print(otter.cards, otter2.cards, otter3.cards, otter.skip_turn, otter2.skip_turn, otter3.skip_turn)
    # otter.PlayCard('oil_spill', ["ivy"], [], [otter, otter2, otter3], 0)
    # print(otter.cards, otter2.cards, otter3.cards, otter.skip_turn, otter2.skip_turn, otter3.skip_turn)