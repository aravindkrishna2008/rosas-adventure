import random

class Otter():
    def __init__(self, name):
        self.name = name
        
        self.progress = 0
        
        self.objectives1completed = False
        self.objectives2completed = False
        self.objectives3completed = False
        
        self.objective1 = []
        self.objective2 = []
        self.objective3 = []
        self.cards = []
    
    def init_deck(self, cards):
        self.cards = cards
    
    def generateObjective(self):
        random.seed(7)
        self.objective1 = random.sample(self.cards, 1 )
        self.objective2 = random.sample(self.cards, 2)
        self.objective3 = random.sample(self.cards, 3)
        
    def checkObjective(self, cards):
        if (self.objectives1completed == False):
            self.objectives1completed = all(card in cards for card in self.objective1)
        if (self.objectives2completed == False):
            self.objectives2completed = all(card in cards for card in self.objective2)
        if (self.objectives3completed == False):
            self.objectives3completed = all(card in cards for card in self.objective3)
        if (self.objectives1completed and self.objectives2completed and self.objectives3completed):
            self.progress += 1
            self.generateObjective()
            self.objectives2completed = False
            self.objectives3completed = False
            self.objectives1completed = False
    
    def printObjective(self):
        print(f'{self.name} {self.progress} {self.objective1} {self.objective2} {self.objective3}')
    
    def __str__(self):
        string = f'{self.name} {self.progress} '
        for card in self.objective1:
            string += f'{card} '
        for card in self.objective2:
            string += f'{card} '
        for card in self.objective3:
            string += f'{card} '