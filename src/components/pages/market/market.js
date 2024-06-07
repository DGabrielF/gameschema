import { Page } from "../../../scripts/engine/page.js";
import { State } from "../../../scripts/engine/state.js";
import { PokeApi } from "../../../scripts/services/api.js";
import { Firestore } from "../../../scripts/services/firebase/firestore.js";
import { Card } from "../../shared/card/card.js";
import { Dialog } from "../../shared/dialog/dialog.js";
import { Toast } from "../../shared/toast/toast.js";
import { Buy } from "./buy.js";
import { Package } from "./package.js";

export const Market = {
  self: document.querySelector("section.market"),
  selectedSubSection: null,
  subSections: {
    package: null,
    buy: null,
    sell: {
      data: null,
      lastDoc: null,
      totalCount: null,
      createOfferArea: document.querySelector("section.market .sell .create_buy_offer"),
      confirmButton: document.querySelector(".dialog .buy .confirm"),
      load: () => {},
      createOffer: () => {},
      list: () => {},
      dialogUpdate: () => {},
      confirm: () => {},
    },
    trade: [],
  },
  load: () => {},
  toggleDialog: () => {},
  dialogUpdate: () => {},
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
  }
  Market.subSections.buy.confirmButton.addEventListener("click", Market.subSections.buy.confirm);
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

Market.subSections.sell.load = async () => {
  const createOfferArea = Market.self.querySelector(".sell .create_buy_offer");
  const searchID = createOfferArea.querySelector(".card_id");
  searchID.addEventListener("blur", async () => {
    // await addCardToOfferDetail(searchID, createOfferArea);
  });
  const createButton = createOfferArea.querySelector("button");
  createButton.addEventListener("click", Market.subSections.buy.createOffer);

  // Market.subSections.buy.list();
  cardVerification();
}

Market.subSections.sell.list = async () => {
  const packageOfferList = Market.self.querySelector(".sell .offer_list");
  for (const offer of Market.subSections.sell.data.sort((a, b) => a.quantity - b.quantity)) {
    const id = document.querySelector(`#${offer.id}`);
    if (!id) {
      const ownerData = await Firestore.fetchDocById ("Users", offer.owner);
      const div = document.createElement("div");
      div.classList.add("offer");
      div.id = offer.id;
      const date = new Date(offer.date)
      const day = ("0" + date.getUTCDate()).slice(-2);
      const month = ("0" + (date.getUTCMonth() + 1)).slice(-2);
      const year = date.getUTCFullYear().toString().slice(-2);

      const formattedDate = `${day}/${month}/${year}`;
      const offetContent = `
        <span class="name">${ownerData.name}</span>
        <span class="card_name">${offer.card}</span>
        <span class="date">${formattedDate}</span>
        <button>
          <img src="./src/assets/icons/general/money-offer.svg" alt="" class="icon">
          <span class="price">${offer.price}</span>
        </button>
      `
      div.innerHTML = offetContent;
      packageOfferList.appendChild(div);
    }
  }
}

Market.subSections.sell.dialogUpdate = (offer) => {
  const name = document.querySelector(".dialog .sell .name");
  name.textContent = offer.name;

  const price = document.querySelector(".dialog .sell .price");
  price.textContent = offer.price;
}

Market.addCardToOfferDetail = async (searchID, createOfferArea) => {
  if (!searchID.value) return;
  
  const cardData = await PokeApi.getPokemon(searchID.value);
  if (typeof cardData === "string") {
    Toast.open("Erro", cardData, Toast.error);
    return;
  };

  const card = await Card.create(cardData.id);
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

function cardVerification () {
  console.log(State.user.cards);
}

Market.addCardToPlayer = (card, array) => {
  const foundCard = array.find(item => item.id === card.id);
  if (foundCard) {
    foundCard.quantity += 1;
  } else {
    array.push({
      id: card.id,
      quantity: 1,
    })
  }
}