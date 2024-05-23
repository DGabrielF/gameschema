import { TopMenu } from "../../components/shared/top_menu/top_menu.js";

export const State = {
  default: {
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
  TopMenu.update()
}

