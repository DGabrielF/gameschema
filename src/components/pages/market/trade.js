import { Firestore } from "../../../scripts/services/firebase/firestore.js";
import { Market } from "./market.js";

export const Trade = {
  self: document.querySelector("section.market .buy"),
  databaseName: "trade",
  data: null,
  dataLimit: 10,
  lastDoc: null,
  totalCount: null,
  newOfferCard: null,
  selectedOffer: null,
  confirmButton: document.querySelector(".dialog .trade .confirm"),
  load: () => {},
  list: async () => {},
  dialogUpdate: () => {},
  confirm: () => {},
}

Trade.load = async () => {
  if (!Trade.data) {
    await Market.subsectionDataUpdate(Trade);
  }

  const createOfferArea = Trade.self.querySelector(".create_trade_offer");
  const searchID = createOfferArea.querySelector(".card_id");
  searchID.addEventListener("blur", async () => {
    Trade.newOfferCard = await Market.addCardToOfferDetail(searchID, createOfferArea);
  });
  const createButton = createOfferArea.querySelector("button");
  createButton.addEventListener("click", newOffer);

  await Trade.list();

  Market.attachEventAtOfferButtons();

  Trade.confirmButton.addEventListener("click", Trade.confirm);
};

Trade.list = async () => {
  const offerList = Trade.self.querySelector(".offer_list");

  if (Trade.data.length > 0) {
    for (const offer of Trade.data) {
      const foundElement = document.getElementById(offer.id);
      if (foundElement) return;

      const ownerData = await Firestore.fetchDocById("Users", offer.owner);
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
      <span class="card_name">deseja ${offer.card}</span>
      <span class="date">${formattedDate}</span>
      <button>
      <img src="./src/assets/icons/general/money-offer.svg" alt="" class="icon">
      <span class="price">Ver mais</span>
      </button>
      `
      div.innerHTML = offetContent;
      offerList.appendChild(div);
    }
  }
};
// TODO: Editar melhor o dialogo de Trade 
Trade.dialogUpdate = async (offer) => {
  Trade.selectedOffer = offer;

  const name = document.querySelector(".dialog .trade .name");
  name.textContent = offer.name;

  const price = document.querySelector(".dialog .trade .price");
  price.textContent = offer.price;
};

Trade.confirm = async () => {
  const offer = Trade.selectedOffer;

  const foundCard = Market.cardVerification(offer, State.user.cards.all);
  if (!foundCard) {
    const message = `Você não possui esta carta`;
    Toast.open("Erro", message, Toast.error);
    return;
  };

  foundCard.quantity -= 1;
  Market.removeCardFromPlayer(foundCard, State.user.cards)
};

async function newOffer () {};