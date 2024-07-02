import { State } from "../../../scripts/engine/state.js";
import { PokeApi } from "../../../scripts/services/api.js";
import { Firestore } from "../../../scripts/services/firebase/firestore.js";
import { Card } from "../../shared/card/card.js";
import { Dialog } from "../../shared/dialog/dialog.js";
import { Toast } from "../../shared/toast/toast.js";
import { Market } from "./market.js";

export const Buy = {
  self: document.querySelector("section.market .buy"),
  databaseName: "buy",
  data: null,
  dataLimit: 10,
  lastDoc: null,
  totalCount: null,
  newOfferCard: null,
  selectedOffer: null,
  confirmButton: document.querySelector(".dialog .buy .confirm"),
  load: () => {},
  list: async () => {},
  dialogUpdate: () => {},
  confirm: () => {},
};

Buy.load = async () => {
  if (!Buy.data) {
    await Market.subsectionDataUpdate(Buy);
  };

  const createOfferArea = Buy.self.querySelector(".create_buy_offer");
  const searchID = createOfferArea.querySelector(".card_id");
  searchID.addEventListener("blur", async () => {
    Buy.newOfferCard = await Market.addCardToOfferDetail(searchID, createOfferArea);
  });
  const createButton = createOfferArea.querySelector("button");
  createButton.addEventListener("click", newOffer);

  await Buy.list();

  Market.attachEventAtOfferButtons();

  Buy.confirmButton.addEventListener("click", Buy.confirm);
};

Buy.list = async () => {
  const offerList = Buy.self.querySelector(".offer_list");

  if (Buy.data.length > 0) {
    for (const offer of Buy.data) {
      const foundElement = document.getElementById(offer.id);
      if (foundElement) return;

      const ownerData = await Firestore.fetchDocById("Users", offer.owner);
      const li = document.createElement("li");
      li.classList.add("offer");
      li.id = offer.id;

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
      li.innerHTML = offetContent;
      offerList.appendChild(li);
    }
  }
};

Buy.dialogUpdate = (offer) => {
  Buy.selectedOffer = offer;

  const name = document.querySelector(".dialog .buy .name");
  name.textContent = offer.name;

  const price = document.querySelector(".dialog .buy .price");
  price.textContent = offer.price;
};

Buy.confirm = async () => {
  const offer = Buy.selectedOffer;

  if (!Market.coinVerification(State.user.coins, offer.price)) return;

  State.user.coins -= offer.price;
  const cardRollback = [...State.user.cards.all];

  Dialog.handle("purchased_cards");
  const pokeData = await PokeApi.getPokemon(offer.cardId);
  const pokeUsefulData = PokeApi.getUsefulAttributes(pokeData);
  const pokeCard = Card.create(pokeUsefulData);
  const purchasedCardsArea = document.querySelector(".dialog .purchased_cards_area");
  purchasedCardsArea.innerHTML = "";
  purchasedCardsArea.appendChild(pokeCard);

  Market.addCardToPlayer(pokeCard, State.user.cards.all);

  const newData = {
    coins: State.user.coins,
    cards: State.user.cards,
  };
  const response = await Firestore.update("Users", State.user.uid, newData);
  if (response) {
    Toast.open("Erro", response, Toast.error);
    State.user.coins += price;
    State.user.cards.all = [...cardRollback];
    return;
  };
  const ownerData = await Firestore.fetchDocById("Users", offer.owner);
  const newOwnerData = {
    coins: ownerData.coins + offer.price
  }
  const ownerResponse = await Firestore.update("Users", ownerData.uid, newOwnerData);
  if (ownerResponse) {
    Toast.open("Erro", response, Toast.error);
    State.user.coins += price;
    State.user.cards.all = [...cardRollback];
    return;
  };

  const removeResponse = await Firestore.delete("buy", offer.id);
  if (removeResponse) {
    Toast.open("Erro", removeResponse, Toast.error);
    State.user.coins += price;
    State.user.cards.all = [...cardRollback];
    return;
  };

  const offerElement = document.getElementById(offer.id)
  offerElement.remove();

  Market.update();
};

async function newOffer () {
  const createOfferArea = Buy.self.querySelector(".create_buy_offer");

  if (!Market.authVerification(State.user.uid)) return;

  if (!Buy.newOfferCard) {
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
  if (!Market.coinVerification(State.user.coins, price)) return;
  State.user.coins -= price;

  const newData = {
    coins: State.user.coins,
  };
  const userResponse = await Firestore.update("Users", State.user.uid, newData);
  Market.update();
  if (userResponse) {
    Toast.open("Erro", userResponse, Toast.error);
    State.user.coins += price;
    return;
  };
  
  const data = {
    owner: State.user.uid,
    card: Buy.newOfferCard.name,
    cardId: Buy.newOfferCard.id,
    price: price,
    date: new Date().toISOString(),
  };
  const offerResponse = await Firestore.createData("sell", data);
  if (typeof offerResponse === "string") {
    Toast.open("Erro", offerResponse, Toast.error);
    State.user.coins += price;
  } else {
    Toast.open("Sucesso", "Oferta criada com sucesso", Toast.success);
  };
};