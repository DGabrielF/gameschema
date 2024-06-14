import { State } from "../../../scripts/engine/state.js";
import { Firestore } from "../../../scripts/services/firebase/firestore.js";
import { Toast } from "../../shared/toast/toast.js";
import { Market } from "./market.js";

export const Sell = {
  self: document.querySelector("section.market .sell"),
  databaseName: "sell",
  data: null,
  dataLimit: 10,
  lastDoc: null,
  totalCount: null,
  newOfferCard: null,
  selectedOffer: null,
  confirmButton: document.querySelector(".dialog .sell .confirm"),
  load: () => {},
  list: async () => {},
  dialogUpdate: () => {},
  confirm: () => {},
};

Sell.load = async () => {
  if (!Sell.data) {
    await Market.subsectionDataUpdate(Sell)
  };

  const createOfferArea = Sell.self.querySelector(".create_sell_offer");
  const searchID = createOfferArea.querySelector(".card_id");
  searchID.addEventListener("blur", async () => {
    Sell.newOfferCard = await Market.addCardToOfferDetail(searchID, createOfferArea);
  });
  const createButton = createOfferArea.querySelector("button");
  createButton.addEventListener("click", newOffer);

  await Sell.list();

  Market.attachEventAtOfferButtons();

  Sell.confirmButton.addEventListener("click", Sell.confirm);
};

Sell.list = async () => {
  const offerList = Sell.self.querySelector(".offer_list");

  if (Sell.data.length > 0) {
    for (const offer of Sell.data.sort((a, b) => a.quantity - b.quantity)) {
      const foundElement = document.getElementById(offer.id);
      if (foundElement) return;

      const ownerData = await Firestore.fetchDocById ("Users", offer.owner);
      const div = document.createElement("div");
      div.classList.add("offer");
      div.id = offer.id;

      const date = new Date(offer.date);
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
      offerList.appendChild(div);
    }
  }
};

Sell.dialogUpdate = (offer) => {
  Sell.selectedOffer = offer;

  const name = document.querySelector(".dialog .sell .name");
  name.textContent = offer.name;

  const price = document.querySelector(".dialog .sell .price");
  price.textContent = offer.price;
};

Sell.confirm = async () => {
  const offer = Sell.selectedOffer;

  State.user.coins += offer.price;
  const cardRollback = [...State.user.cards.all];

  const foundCard = Market.cardVerification(offer, State.user.cards.all);
  if (!foundCard) {
    const message = `Você não possui esta carta`;
    Toast.open("Erro", message, Toast.error);
    return;
  };

  foundCard.quantity -= 1;
  Market.removeCardFromPlayer(foundCard, State.user.cards)

  const newData = {
    coins: State.user.coins,
    cards: State.user.cards,
  };
  const response = await Firestore.update("Users", State.user.uid, newData);
  if (response) {
    Toast.open("Erro", response, Toast.error);
    State.user.coins -= price;
    State.user.cards.all = [...cardRollback];
    return;
  };
  const ownerData = await Firestore.fetchDocById("Users", offer.owner);
  Market.addCardToPlayer(foundCard, ownerData.cards.all);
  const newOwnerData = {
    cards: ownerData.cards
  }
  const ownerResponse = await Firestore.update("Users", ownerData.uid, newOwnerData);
  if (ownerResponse) {
    Toast.open("Erro", response, Toast.error);
    State.user.coins -= price;
    State.user.cards.all = [...cardRollback];
    return;
  };

  const removeResponse = await Firestore.delete("sell", offer.id);
  if (removeResponse) {
    Toast.open("Erro", removeResponse, Toast.error);
    State.user.coins -= price;
    State.user.cards.all = [...cardRollback];
    return;
  };

  const offerElement = document.getElementById(offer.id)
  offerElement.remove();

  Market.update();
};

async function newOffer () {
  const createOfferArea = Sell.self.querySelector(".create_sell_offer");
  
  if (!Market.authVerification(State.user.uid)) return;

  if (!Sell.newOfferCard) {
    const message = `É necessário selecionar uma carta para criar uma oferta`;
    Toast.open("Erro", message, Toast.error);
    return;
  } 

  const priceElement = createOfferArea.querySelector(".price");
  const price = Number(priceElement.value);
  if (price <= 0) {
    const message = `Só é possível utilizar valores maiores que zero`;
    Toast.open("Erro", message, Toast.error);
    return;
  }

  const foundCard = Market.cardVerification(Sell.newOfferCard, State.user.cards);
  if (!foundCard) {
    const message = `Você não possui esta carta`;
    Toast.open("Erro", message, Toast.error);
    return;
  };
  
  foundCard.quantity -= 1;
  Market.removeCardFromPlayer(foundCard, State.user.cards)

  const newData = {
    cards: State.user.cards,
  };
  const userResponse = await Firestore.update("Users", State.user.uid, newData);
  Market.update();
  if (userResponse) {
    Toast.open("Erro", userResponse, Toast.error);
    Market.addCardToPlayer(foundCard, State.user.cards.all)
    return;
  };
  
  const data = {
    owner: State.user.uid,
    card: Sell.newOfferCard.name,
    cardId: Sell.newOfferCard.id,
    price: price,
    date: new Date().toISOString(),
  };
  const offerResponse = await Firestore.createData("buy", data);
  if (typeof offerResponse === "string") {
    Toast.open("Erro", offerResponse, Toast.error);
    State.user.coins += price;
  } else {
    Toast.open("Sucesso", "Oferta criada com sucesso", Toast.success);
  };
};