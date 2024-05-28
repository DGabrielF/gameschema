import { Market } from "../../components/pages/market/market.js";
import { TopMenu } from "../../components/shared/top_menu/top_menu.js";

export const State = {
  default: {
    user: {
      uid: null,
      name: "Anônimo",
      coins: 2500,
      luck: 0,
      cards: {
        all: [
          {id: 1, quantity: 1},
          {id: 4, quantity: 1},
          {id: 7, quantity: 1},
          {id: 12, quantity: 1},
          {id: 16, quantity: 1},
          {id: 25, quantity: 1},
        ],
        hand: [1, 4, 7, 12, 16, 25],
      },
      relationship: {
        friends: [],
        sentRequests: [],
        receivedRequests: [],
        blocked: []
      }
    },
  },
  user: {
    uid: null,
    name: "Anônimo",
    coins: 0,
    cards: {
      all: [],
      hand: [],
    },
    relationship: {
      friends: [],
      sentRequests: [],
      receivedRequests: [],
      blocked: []
    }
  },
  
};

State.userUpdate = async (user) => {
  if (user) {
    State.user = user;
  } else {
    State.user = State.default.user;
  }
  TopMenu.update();
  Market.update();
}

