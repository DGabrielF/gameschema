export const State = {
  user: {
    uid: null
  },
  defaultUser: {
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
    State.user = State.defaultUser;
  }
}

State.userUpdate();