import { State } from "../../../scripts/engine/state.js";
import { Firestore } from "../../../scripts/services/firebase/firestore.js";
import { UserValidation } from "../../../scripts/services/validation/user.js";
import { Duel } from "./duel.js";
import { NpcEnemy } from "./npc_enemy.js";
import { OpenRoom } from "./open_room.js";

export const SearchDuel = {
  self: document.querySelector("section.search_duel"),
  selectedSubSection: null,
  subSections: {
    npc_enemy: null,
    player_ranking: null,
    enter_room: null,
    open_room: null,
  },
  load: async () => {},
  toggleDuel: () => {},
  fetchDataSubsecion: async () => {},
};

SearchDuel.load = () => {
  if (!SearchDuel.subSections.npc_enemy) {
    SearchDuel.subSections.npc_enemy = NpcEnemy;
  };

  if (!SearchDuel.subSections.open_room) {
    SearchDuel.subSections.open_room = OpenRoom;
  };
  
  const content = SearchDuel.self.querySelector(".search_duel_content");
  content.addEventListener("click", event => {
    const dueller = event.target.closest(".dueller");
    if (!dueller) return;
    if (!UserValidation.unauthenticated(State.user.uid)) return;
    enterRoom(event);
  });
}

SearchDuel.subsectionDataUpdate = async (subsectionObject) => {
  const { data, lastDoc } = await Firestore.fetchLimitedDataFromFirebase(
    subsectionObject.databaseName,
    subsectionObject.dataLimit,
    subsectionObject.lastDoc,
  );
  subsectionObject.data = data;
  subsectionObject.lastDoc = lastDoc;
}

SearchDuel.fetchDataSubsecion = async (classItem) => {
  SearchDuel.selectedSubSection = classItem;
  let { data, lastDoc } = await Firestore.fetchLimitedDataFromFirebase(classItem, 6, SearchDuel.subSections[classItem].lastDoc);
  if (!SearchDuel.subSections[classItem].data) {
    SearchDuel.subSections[classItem].data = data;
  }
  SearchDuel.subSections[classItem].lastDoc = lastDoc;

  await SearchDuel.subSections[SearchDuel.selectedSubSection].load();
}

function enterRoom(event) {
  const duelId = event.target.closest(".dueller").id;
  
  const type = event.target.closest(".search_duel_type").classList[0];

  const foundRoom = SearchDuel.subSections[type].data.find(room => room.id === duelId);

  if (foundRoom.private) {
    console.log("digite a senha para entrar nessa sala")
    return
  }

  Duel.load(type, foundRoom);
}