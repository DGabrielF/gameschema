import { Page } from "../../../scripts/engine/page.js";
import { State } from "../../../scripts/engine/state.js";
import { PokeApi } from "../../../scripts/services/api.js";
import { Firestore } from "../../../scripts/services/firebase/firestore.js";
import { Card } from "../../shared/card/card.js";
import { Dialog } from "../../shared/dialog/dialog.js";
import { Toast } from "../../shared/toast/toast.js";
import { Buy } from "./buy.js";
import { Package } from "./package.js";
import { Sell } from "./sell.js";
import { Trade } from "./trade.js";

export const Market = {
  self: document.querySelector("section.market"),
  selectedSubSection: null,
  subSections: {
    package: null,
    buy: null,
    sell: null,
    trade: null,
  },
  load: async () => {},
  toggleDialog: () => {},
  toggleDisplay: () => {},
  updateDisplay: () => {},
  attachEventAtOfferButtons: () => {},
};

Market.load = async () => {
  if (!Market.subSections.package) {
    Market.subSections.package = Package;
  };
  if (!Market.subSections.buy) {
    Market.subSections.buy = Buy;
  };
  if (!Market.subSections.sell) {
    Market.subSections.sell = Sell;
  };
  if (!Market.subSections.trade) {
    Market.subSections.trade = Trade;
  };
  const marketContent = Market.self.querySelector(".market_content");
  const marketSections = marketContent.querySelectorAll('.market_type');
  for (const marketSection of marketSections) {
    if (!marketSection.classList.contains("hide")) {
      for (const classItem of marketSection.classList) {
        if (classItem !== "market_type") {
          await Market.fetchDataSubsecion(classItem);
        }
      }
    }
  };
  Market.attachEventAtOfferButtons();  
};

Market.subsectionDataUpdate = async (subsectionObject) => {
  const { data, lastDoc } = await Firestore.fetchLimitedDataFromFirebase(
    subsectionObject.databaseName,
    subsectionObject.dataLimit,
    subsectionObject.lastDoc,
  );
  subsectionObject.data = data;
  subsectionObject.lastDoc = lastDoc;
}

Market.fetchDataSubsecion = async (classItem) => {
  Market.selectedSubSection = classItem;
  let { data, lastDoc } = await Firestore.fetchLimitedDataFromFirebase(classItem, 6, Market.subSections[classItem].lastDoc);
  if (!Market.subSections[classItem].data) {
    Market.subSections[classItem].data = data;
  }
  if (Market.subSections[classItem].lastDoc) {
    Market.subSections[classItem].lastDoc = lastDoc;
  }

  Market.subSections[Market.selectedSubSection].load();
  Market.attachEventAtOfferButtons();
}

Market.attachEventAtOfferButtons = () => {
  const offerButtons = Market.self.querySelectorAll(".offer button");
  for (const offerButton of offerButtons) {
    offerButton.addEventListener("click", () => {
      if (!Market.authVerification(State.user.uid)) return;
      dialogUpdate(offerButton);
      Dialog.open();
      removeSelectedMarkOfOffers();
      offerButton.parentNode.classList.add("selected");
    });
  }
}

Market.update = () => {
  const moneySpans = Market.self.querySelectorAll(".money");
  for (const moneySpan of moneySpans) {
    moneySpan.textContent = State.user.coins;
  }
};

function removeSelectedMarkOfOffers() {
  const offers = Market.self.querySelectorAll(".offer");
  for (const offer of offers) {
    offer.classList.remove("selected")
  }
}

function dialogUpdate(offerButton) {
  const marketSection = offerButton.closest(".market_type");
  for (const classItem of marketSection.classList) {
    if (classItem !== "market_type") {
      const offerItem = offerButton.parentNode;
      const offerArray = Market.subSections[classItem].data;
      const selectedOffer = offerArray.find(offer => offer.id === offerItem.id);
      Market.subSections[classItem].dialogUpdate(selectedOffer)
      Dialog.handle(classItem);
    }
  }
};

Market.addCardToOfferDetail = async (searchID, createOfferArea) => {
  if (!searchID.value) return;
  
  const cardData = await PokeApi.getPokemon(searchID.value);
  if (typeof cardData === "string") {
    Toast.open("Erro", cardData, Toast.error);
    return;
  };

  const pokeData = await PokeApi.getPokemon(cardData.id);
  const pokeUsefulData = PokeApi.getUsefulAttributes(pokeData);
  const card = Card.create(pokeUsefulData);
  const detail = createOfferArea.querySelector(".detail");
  detail.innerHTML = "";
  detail.appendChild(card);
  return cardData;
}

Market.authVerification = (uid) => {
  if (!uid) {
    const message = "Você precisa estar logado para realizar esta ação.";
    Toast.open("Erro", message, Toast.error);
    Dialog.close();
    Page.change("signin");
  }
  return uid
}

Market.coinVerification = (playerCoins, neededCoins) => {
  const enoughCoins = (playerCoins >= neededCoins);
  if (!enoughCoins) {
    const message = `Você não tem dinheiro suficiente. Faltam P$ ${neededCoins - playerCoins}.`;
    Toast.open("Erro", message, Toast.error);
  }
  return enoughCoins
}

Market.cardVerification = (card, array) => {
  return array.find(item => item.id === card.id);
}

Market.addCardToPlayer = (card, array) => {
  const foundCard = Market.cardVerification(card, array);
  if (foundCard) {
    foundCard.quantity += 1;
  } else {
    array.push({
      id: card.id,
      quantity: 1,
    })
  }
}

Market.removeCardFromPlayer = (card, cards) => {
  const foundCard = Market.cardVerification(card, cards.all);
  foundCard.quantity -= 1;
  if (foundCard.quantity === 0) {
    cards.all.filter(card => card.id === foundCard.id && foundCard.quantity === 0);
    cards.hand.filter(card => card === foundCard.id);
  };
}