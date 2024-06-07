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
      load: () => {},
      updateDialog: () => {},
      open: () => {},
      confirm: () => {},
    },
    buy: {
      data: null,
      lastDoc: null,
      totalCount: null,
      createOfferArea: document.querySelector("section.market .buy .create_buy_offer"),
      confirmButton: document.querySelector(".dialog .buy .confirm"),
      load: () => {},
      createOffer: () => {},
      list: () => {},
      updateDialog: () => {},
      confirm: () => {},
    },
    sell: {
      data: null,
      lastDoc: null,
      totalCount: null,
      createOfferArea: document.querySelector("section.market .sell .create_buy_offer"),
      confirmButton: document.querySelector(".dialog .buy .confirm"),
      load: () => {},
      createOffer: () => {},
      list: () => {},
      updateDialog: () => {},
      confirm: () => {},
    },
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
          await Market.fetchDataSubsecion(classItem);
        }
      }
    }
  }
  Market.subSections.package.confirmButton.addEventListener("click", Market.subSections.package.confirm);
  Market.subSections.buy.confirmButton.addEventListener("click", Market.subSections.buy.confirm);
  attachEventAtOfferButtons();
};

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
  attachEventAtOfferButtons();
}

function attachEventAtOfferButtons() {
  const offerButtons = Market.self.querySelectorAll(".offer button");
  for (const offerButton of offerButtons) {
    offerButton.addEventListener("click", () => {
      Dialog.open();
      updateDialog(offerButton);
      removeSelectedMarkOfOffers();
      offerButton.parentNode.classList.add("selected");
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
    const id = document.querySelector(`#${offer.id}`);
    if (!id) {
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
      packageOfferList.appendChild(div);
    }
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
    };
    if (State.user.luck * nowLuck < pokeData.base_experience) {
      State.user.luck += (pokeData.base_experience - (State.user.luck * nowLuck)) / 10;
      continue;
    };
    State.user.luck = (State.user.luck - pokeData.base_experience) / 2 > 0 ? (State.user.luck - pokeData.base_experience) / 2 : 0;
    purchasedCards.push(pokeData);
    const pokeCard = await Card.create(drawedID);
    purchasedCardsArea.appendChild(pokeCard);  
  }
  return purchasedCards;
};

Market.subSections.package.confirm = async () => {
  const offers = Market.self.querySelectorAll(".offer");
  for (const offer of offers) {
    if (offer.classList.contains("selected")) {
      const offerSelected = Market.subSections.package.data.find(item => item.id === offer.id);
      
      if (!authVerification(State.user.uid)) return;

      const price = offerSelected.quantity * 200 * (1 - offerSelected.off);
      if (!coinVerification(State.user.coins, price)) return;
      State.user.coins -= price;
      
      const cardRollback = [...State.user.cards.all]      
      Dialog.handle("purchased_cards");

      const purchasedCards = await Market.subSections.package.open(offerSelected.quantity);
      for (const card of purchasedCards) {
        addCardToPlayer(card, State.user.cards.all);
      }
      const newData = {
        coins: State.user.coins,
        cards: State.user.cards,
      }
      const response = await Firestore.update("Users", State.user.uid, newData);
      Market.update();
      if (response) {
        Toast.open("Erro", response, Toast.error);
        State.user.coins += price;
        State.user.cards.all = [...cardRollback]
      }
    }
  }
}

async function drawInInterval() {
  const maxNumber = await PokeApi.getPokemonTotalNumber();
  return Math.floor(Math.random() * maxNumber) + 1;
};

Market.subSections.buy.load = async () => {
  const createOfferArea = Market.self.querySelector(".buy .create_buy_offer");
  const searchID = createOfferArea.querySelector(".card_id");
  searchID.addEventListener("blur", async () => {
    await addCardToOfferDetail(searchID, createOfferArea);
  });
  const createButton = createOfferArea.querySelector("button");
  createButton.addEventListener("click", Market.subSections.buy.createOffer);

  Market.subSections.buy.list();
};

Market.subSections.buy.createOffer = async () => {
  const createOfferArea = Market.self.querySelector(".buy .create_buy_offer");

  if (!authVerification(State.user.uid)) return;

  const priceElement = createOfferArea.querySelector(".price");
  const price = Number(priceElement.value);  
  if (!coinVerification(State.user.coins, price)) return;
  State.user.coins -= price;

  const newData = {
    coins: State.user.coins,
  }

  const userResponse = await Firestore.update("Users", State.user.uid, newData);
  Market.update();
  if (userResponse) {
    Toast.open("Erro", userResponse, Toast.error);
    State.user.coins += price;
    return;
  }
  const data = {
    owner: State.user.uid,
    card: createOfferArea.querySelector(".card span.name").textContent,
    cardId: Number(createOfferArea.querySelector(".card").id),
    price: price,
    date: new Date().toISOString(),
  };
  const offerResponse = await Firestore.createData("sell", data);
  if (typeof offerResponse === "string") {
    Toast.open("Erro", offerResponse, Toast.error);
    State.user.coins += price;
  } else {
    Toast.open("Sucesso", "Oferta criada com sucesso", Toast.success);
  }
};

Market.subSections.buy.list = async () => {
  const packageOfferList = Market.self.querySelector(".buy .offer_list");
  for (const offer of Market.subSections.buy.data.sort((a, b) => a.quantity - b.quantity)) {
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

Market.subSections.buy.updateDialog = (offer) => {
  const name = document.querySelector(".dialog .buy .name");
  name.textContent = offer.name;

  const price = document.querySelector(".dialog .buy .price");
  price.textContent = offer.price;
}

Market.subSections.buy.confirm = async () => {
  const offers = Market.self.querySelectorAll(".offer");
  for (const offer of offers) {
    if (offer.classList.contains("selected")) {
      const offerSelected = Market.subSections.buy.data.find(item => item.id === offer.id);
      console.log("offerSelected", offerSelected)

      if (!authVerification(State.user.uid)) return;

      if (!coinVerification(State.user.coins, offerSelected.price)) return;

      State.user.coins -= offerSelected.price;
      const cardRollback = [...State.user.cards.all];

      Dialog.handle("purchased_cards");
      console.log("offerSelected.cardId", offerSelected.cardId)
      const pokeCard = await Card.create(offerSelected.cardId);
      const purchasedCardsArea = document.querySelector(".dialog .purchased_cards_area");
      purchasedCardsArea.innerHTML = "";
      purchasedCardsArea.appendChild(pokeCard);

      const foundCard = State.user.cards.all.find(item => item.id === offerSelected.cardId);
      if (foundCard) {
        foundCard.quantity += 1;
      } else {
        State.user.cards.all.push({id: offerSelected.cardId, quantity: 1})
      };

      const newData = {
        coins: State.user.coins,
        cards: State.user.cards,
      };
      console.log("novos dados do usuário", newData);
      const response = await Firestore.update("Users", State.user.uid, newData);
      Market.update();
      if (response) {
        Toast.open("Erro", response, Toast.error);
        State.user.coins += price;
        State.user.cards.all = [...cardRollback];
        return;
      };

      const removeResponse = await Firestore.delete("sell", offer.id);
      if (removeResponse) {
        Toast.open("Erro", removeResponse, Toast.error);
        State.user.coins += price;
        State.user.cards.all = [...cardRollback];
        return;
      };
    }
  }
}

Market.subSections.sell.load = async () => {
  const createOfferArea = Market.self.querySelector(".sell .create_buy_offer");
  const searchID = createOfferArea.querySelector(".card_id");
  searchID.addEventListener("blur", async () => {
    await addCardToOfferDetail(searchID, createOfferArea);
  });
  const createButton = createOfferArea.querySelector("button");
  createButton.addEventListener("click", Market.subSections.buy.createOffer);

  Market.subSections.buy.list();
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

Market.subSections.sell.updateDialog = (offer) => {
  const name = document.querySelector(".dialog .sell .name");
  name.textContent = offer.name;

  const price = document.querySelector(".dialog .sell .price");
  price.textContent = offer.price;
}

async function addCardToOfferDetail(searchID, createOfferArea) {
  if (searchID.value) {
    const cardData = await PokeApi.getPokemon(searchID.value);
    const card = await Card.create(cardData.id);
    const detail = createOfferArea.querySelector(".detail");
    detail.innerHTML = "";
    detail.appendChild(card);
  };
}

function authVerification (uid) {
  if (!uid) {
    const message = "Você precisa estar logado para realizar esta ação.";
    Toast.open("Erro", message, Toast.error);
    Dialog.close();
    Page.change("signin");
  }
  return uid
}

function coinVerification (playerCoins, neededCoins) {
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

function addCardToPlayer (card, array) {
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