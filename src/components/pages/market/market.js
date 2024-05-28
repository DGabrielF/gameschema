import { Page } from "../../../scripts/engine/page.js";
import { State } from "../../../scripts/engine/state.js";
import { PokeApi } from "../../../scripts/services/api.js";
import { Firestore } from "../../../scripts/services/firebase/firestore.js";
import { Card } from "../../shared/card/card.js";
import { Dialog } from "../../shared/dialog/dialog.js";
import { Toast } from "../../shared/toast/toast.js";

export const Market = {
  self: document.querySelector("section.market"),
  selectedSubSection: null,
  subSections: {
    package: {
      data: null,
      lastDoc: null,
      totalCount: null,
      confirmButton: document.querySelector(".dialog .package .confirm"),
      confirm: () => {}
    },
    buy: [],
    sell: [],
    trade: [],
  },
  load: () => {},
  toggleDialog: () => {},
  updateDialog: () => {},
  toggleDisplay: () => {},
  updateDisplay: () => {},
};

Market.load = async () => {
  const marketContent = Market.self.querySelector(".market_content");
  const marketSections = marketContent.querySelectorAll('.market_type');
  for (const marketSection of marketSections) {
    if (!marketSection.classList.contains("hide")) {
      for (const classItem of marketSection.classList) {
        if (classItem !== "market_type") {
          Market.selectedSubSection = classItem;
          let {data, lastDoc} = await Firestore.fetchLimitedDataFromFirebase(classItem, 6, Market.subSections[classItem].lastDoc);
          Market.subSections[classItem].data = data;
          Market.subSections[classItem].lastDoc = lastDoc;
        }
      }
    }
  }
  Market.subSections[Market.selectedSubSection].load();
  Market.subSections.package.confirmButton.addEventListener("click", Market.subSections.package.confirm)
  attachEventAtOfferButtons();
};

function attachEventAtOfferButtons() {
  const offerButtons = Market.self.querySelectorAll(".offer button");
  for (const offerButton of offerButtons) {
    offerButton.addEventListener("click", () => {
      Dialog.open();
      updateDialog(offerButton);
      removeSelectedMarkOfOffers();
      offerButton.parentNode.classList.add("selected")
    });
  }
}

function removeSelectedMarkOfOffers() {
  const offers = Market.self.querySelectorAll(".offer");
  for (const offer of offers) {
    offer.classList.remove("selected")
  }
}

function updateDialog(offerButton) {
  const marketSection = offerButton.closest(".market_type");
  for (const classItem of marketSection.classList) {
    if (classItem !== "market_type") {
      const offerItem = offerButton.parentNode;

      const offerArray = Market.subSections[classItem].data;
      const selectedOffer = offerArray.find(offer => offer.id === offerItem.id);
      Market.subSections[classItem].updateDialog(selectedOffer)
      Dialog.handle(classItem);
    }
  }
};

Market.update = () => {
  const moneySpans = Market.self.querySelectorAll(".money");
  for (const moneySpan of moneySpans) {
    moneySpan.textContent = State.user.coins;
  }
};

Market.subSections.package.load = () => {
  const packageOfferList = Market.self.querySelector(".package .offer_list");
  for (const offer of Market.subSections.package.data.sort((a, b) => a.quantity - b.quantity)) {
    const div = document.createElement("div");
    div.classList.add("offer");
    div.id = offer.id;
    const offetContent = `
      <span class="name">${offer.name}</span>
      <span class="quantity">${offer.quantity} carta${offer.quantity>1?"s":""}</span>
      <button>
        <img src="./src/assets/icons/general/money-offer.svg" alt="" class="icon">
        <span class="price">${offer.quantity * 200 * (1 - offer.off)}</span>
      </button>
    `
    div.innerHTML = offetContent;
    packageOfferList.appendChild(div)
  }
}

Market.subSections.package.updateDialog = (offer) => {
  const name = document.querySelector(".dialog .package .name");
  name.textContent = offer.name;

  const quantity = document.querySelector(".dialog .package .quantity");
  quantity.textContent = `${offer.quantity} carta${offer.quantity>1?"s":""}`;

  const price = document.querySelector(".dialog .package .price");
  price.textContent = offer.quantity * 200 * (1 - offer.off);
}

Market.subSections.package.confirm = async () => {
  const offers = Market.self.querySelectorAll(".offer");
  for (const offer of offers) {
    if (offer.classList.contains("selected")) {
      const offerSelected = Market.subSections.package.data.find(item => item.id === offer.id);
      const price = offerSelected.quantity * 200 * (1 - offerSelected.off);
      if (!State.user.uid) {
        Toast.open("Erro", "Você precisa estar logado para realizar esta ação.", Toast.error);
        Dialog.close();
        Page.change("signin");
        return;
      }
      if (State.user.coins < price) {
        Toast.open("Erro", `Você não tem dinheiro suficiente. Faltam P$ ${price - State.user.coins}.`, Toast.error);
        return;
      }
      Dialog.handle("purchased_cards");
      const purchasedCards = await Market.subSections.package.open(offerSelected.quantity);
    }
  }
}

Market.subSections.package.open = async (quantity) => {
  const purchasedCards = [];
  const purchasedCardsArea = document.querySelector(".dialog .purchased_cards_area");
  purchasedCardsArea.innerHTML = "";
  while (purchasedCards.length < quantity) {
    const drawedID = await drawInInterval();
    const pokeData = await PokeApi.getPokemon(drawedID)
    const nowLuck = Math.random() * 2;
    if (!pokeData.base_experience) {
      continue;
    }
    if (State.user.luck * nowLuck < pokeData.base_experience) {
      State.user.luck += (pokeData.base_experience - (State.user.luck * nowLuck)) / 10;
      continue;
    }
    State.user.luck = (State.user.luck - pokeData.base_experience) / 2 > 0 ? (State.user.luck - pokeData.base_experience) / 2 : 0;
    purchasedCards.push(pokeData);
    const pokeCard = await Card.create(drawedID);
    purchasedCardsArea.appendChild(pokeCard);  
  }
  return purchasedCards;
}

async function drawInInterval() {
  const maxNumber = await PokeApi.getPokemonTotalNumber();
  return Math.floor(Math.random() * maxNumber) + 1;
}