import { State } from "../../../scripts/engine/state.js";
import { PokeApi } from "../../../scripts/services/api.js";
import { Card } from "../../shared/card/card.js";

export const Cards = {
  self: document.querySelector("section.cards"),  
  area: {
    parent: null,
    target: null,
    presented: null,
    hand: null,
  },
  presentedCards: [],
  search: {
    input: document.querySelector("section.cards .search_area input"),
    result: []
  },
  load: async () => {},
  update: async () => {}
};

Cards.load = async () => {
  Cards.area.presented = Cards.self.querySelector(".cards_area");
  Cards.area.presented.addEventListener('dragover', dragOver);
  Cards.area.presented.addEventListener('drop', drop);

  Cards.area.hand = Cards.self.querySelector(".hand_cards_area");
  Cards.area.hand.addEventListener('dragover', dragOver);
  Cards.area.hand.addEventListener('drop', drop);

  Cards.search.input.addEventListener("input", searchCard)

  await Cards.update();
};

Cards.update = async () => {
  // if (!State.user.uid) return;

  Cards.presentedCards = State.user.cards.all.filter(card => !State.user.cards.hand.some(handCard => handCard.id === card.id));
  
  if (!Cards.area.presented) return;
  if (!Cards.area.hand) return;

  Cards.area.presented.innerHTML = "";

  const showCards = Cards.search.result.length > 0 ? Cards.search.result : Cards.presentedCards;
  for (const card of showCards) {
    let cardData = card;
    if (!card.name) {
      cardData = await PokeApi.getPokemon(card.id);
      cardData = PokeApi.getUsefulAttributes(cardData);
      const foundInAllCards = State.user.cards.all.find(poke => poke.id === cardData.id)
      if (foundInAllCards) {
        for (let key in cardData) {
          foundInAllCards[key] = cardData[key];
        }
      }
    }

    const cardDiv = Card.create(cardData);
    cardDiv.draggable = true;
    cardDiv.addEventListener("dragstart", dragStart);
    cardDiv.addEventListener("dblclick", doubleClick);
    Cards.area.presented.appendChild(cardDiv);
  }

  Cards.area.hand.innerHTML = "";
  for (const card of State.user.cards.hand) {
    let cardData = card;
    if (!card.name) {    
      cardData = await PokeApi.getPokemon(card.id);
      cardData = PokeApi.getUsefulAttributes(cardData);
      const foundInAllCards = State.user.cards.hand.find(poke => poke.id === cardData.id)
      if (foundInAllCards) {
        for (let key in cardData) {
          foundInAllCards[key] = cardData[key];
        }
      }
    }
    const cardDiv = Card.create(card);
    cardDiv.draggable = true;
    cardDiv.addEventListener("dragstart", dragStart);
    cardDiv.addEventListener("dblclick", doubleClick);
    Cards.area.hand.appendChild(cardDiv);
  }
};

function dragStart(e) {
  const card = e.target.closest(".card");
  Cards.area.parent = card.closest("[class*='cards_area']");

  e.dataTransfer.setData('text/plain', card.id);
  e.dataTransfer.effectAllowed = 'move';
};

function doubleClick(e) {
  const card = e.target.closest(".card");
  
  if (!toggleCard(card.id)) return;  
  Cards.presentedCards = State.user.cards.all.filter(card => !State.user.cards.hand.includes(card.id));

  Cards.area.parent = card.closest("[class*='cards_area']");
  Cards.area.target = Cards.area.parent.classList.contains('cards_area') ? Cards.area.hand: Cards.area.presented;
  Cards.area.parent.removeChild(card);
  Cards.area.target.appendChild(card);
};

function dragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
};

function drop(e) {
  e.preventDefault();
  Cards.area.target = e.target.closest("[class*='cards_area']");
  const data = e.dataTransfer.getData('text/plain');

  if (Cards.area.target === Cards.area.parent) return;

  if (Cards.area.target.classList.contains("hand_cards_area") && State.user.cards.hand.length >= 6) return;

  if (!toggleCard(data)) return;
  Cards.presentedCards = State.user.cards.all.filter(card => !State.user.cards.hand.includes(card.id));

  const card = document.getElementById(data);
  Cards.area.parent.removeChild(card);
  Cards.area.target.appendChild(card);
};

function toggleCard(id) {
  id = Number(id);

  let foundCard = Cards.presentedCards.find(card => card.id === id);
  if (foundCard && State.user.cards.hand.length < 6) {
    State.user.cards.hand.push(id);
    return true;
  };

  foundCard = State.user.cards.hand.indexOf(id);
  if (foundCard !== -1) {
    State.user.cards.hand.splice(foundCard, 1);
    return true;
  };

  return false;
};

function searchCard() {
  const searched = Cards.search.input.value;
  Cards.search.result = searched ? Cards.presentedCards.filter(card => 
    card.name.toLowerCase().includes(searched.toLowerCase())
  ) : [];

  Cards.update();
};