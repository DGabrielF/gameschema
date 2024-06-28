import { State } from "../../../scripts/engine/state.js";
import { PokeApi } from "../../../scripts/services/api.js";
import { Firestore } from "../../../scripts/services/firebase/firestore.js";
import { Card } from "../../shared/card/card.js";
import { Dialog } from "../../shared/dialog/dialog.js";
import { Toast } from "../../shared/toast/toast.js";
import { Market } from "./market.js";

export const Package = {
  self: document.querySelector("section.market .package"),
  databaseName: "package",
  data: null,
  dataLimit: 10,
  lastDoc: null,
  totalCount: null,
  selectedOffer: null,
  confirmButton: document.querySelector(".dialog .package .confirm"),
  lastCardId: 1025,
  load: async () => {},
  list: () => {},
  dialogUpdate: () => {},
  confirm: () => {},
};

Package.load = async () => {
  if (!Package.data) {
    await Market.subsectionDataUpdate(Package)
  };

  Package.list();

  Market.attachEventAtOfferButtons();

  Package.confirmButton.addEventListener("click", Package.confirm);
}

Package.list = () => {
  const offerList = Package.self.querySelector(".offer_list");

  if (Package.data.length > 0) {
    for (const offer of Package.data.sort((a, b) => a.quantity - b.quantity)) {
      const id = document.querySelector(`#${offer.id}`);
      if (!id) {
        const div = document.createElement("div");
        div.classList.add("offer");
        div.id = offer.id;
        const offerContent = `
          <span class="name">${offer.name}</span>
          <span class="quantity">${offer.quantity} carta${offer.quantity>1?"s":""}</span>
          <button>
            <img src="./src/assets/icons/general/money-offer.svg" alt="" class="icon">
            <span class="price">${offer.quantity * 200 * (1 - offer.off)}</span>
          </button>
        `
        div.innerHTML = offerContent;
        offerList.appendChild(div);
      }
    }
  }
}

Package.dialogUpdate = (offer) => {
  Package.selectedOffer = offer;

  const name = document.querySelector(".dialog .package .name");
  name.textContent = offer.name;

  const quantity = document.querySelector(".dialog .package .quantity");
  quantity.textContent = `${offer.quantity} carta${offer.quantity>1?"s":""}`;

  const price = document.querySelector(".dialog .package .price");
  price.textContent = offer.quantity * 200 * (1 - offer.off);
}

Package.confirm = async () => {
  const offer = Package.selectedOffer;

  const price = offer.quantity * 200 * (1 - offer.off);
  if (!Market.coinVerification(State.user.coins, price)) return;
  State.user.coins -= price;

  const cardRollback = [...State.user.cards.all] ;     
  Dialog.handle("purchased_cards");
  
  const purchasedCards = await openPackage(offer.quantity);
  for (const card of purchasedCards) {
    Market.addCardToPlayer(card, State.user.cards.all);
  };

  const newData = {
    coins: State.user.coins,
    cards: State.user.cards,
  };
  const response = await Firestore.update("Users", State.user.uid, newData);
  if (response) {
    Toast.open("Erro", response, Toast.error);
    State.user.coins += price;
    State.user.cards.all = [...cardRollback];
  }
  Market.update();
}

async function openPackage(quantity) {
  const purchasedCards = [];
  const purchasedCardsArea = document.querySelector(".dialog .purchased_cards_area");
  purchasedCardsArea.innerHTML = "";
  while (purchasedCards.length < quantity) {
    const drawedID = await drawInInterval();
    const pokeData = await PokeApi.getPokemon(drawedID)
    const nowLuck = Math.random() * 2;
    if (!pokeData.base_experience) {
      continue;
    };
    if (State.user.luck * nowLuck < pokeData.base_experience) {
      State.user.luck += (pokeData.base_experience - (State.user.luck * nowLuck)) / 10;
      continue;
    };
    State.user.luck = (State.user.luck - pokeData.base_experience) / 2 > 0 ? (State.user.luck - pokeData.base_experience) / 2 : 0;
    purchasedCards.push(pokeData);
    const pokeCard = await Card.create(pokeData);
    purchasedCardsArea.appendChild(pokeCard);  
  }
  return purchasedCards;
}

async function drawInInterval() {
  const maxNumber = Package.lastCardId;
  return Math.floor(Math.random() * maxNumber) + 1;
};