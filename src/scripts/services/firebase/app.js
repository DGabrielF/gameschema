import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyB9p5BFfviAsW4FQ0NGi_xZQmbW_AGvR9g",
  authDomain: "pokecard-game.firebaseapp.com",
  projectId: "pokecard-game",
  storageBucket: "pokecard-game.appspot.com",
  messagingSenderId: "98956537747",
  appId: "1:98956537747:web:f6289ff96b2b0d45058266"
};

export const app = initializeApp(firebaseConfig);