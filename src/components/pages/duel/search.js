import { State } from "../../../scripts/engine/state.js";
import { Firestore } from "../../../scripts/services/firebase/firestore.js";
import { UserValidation } from "../../../scripts/services/validation/user.js";
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
  attachEventAtEnemyButtons: () => {},
};

SearchDuel.load = () => {
  if (!SearchDuel.subSections.npc_enemy) {
    SearchDuel.subSections.npc_enemy = NpcEnemy;
  };

  if (!SearchDuel.subSections.open_room) {
    SearchDuel.subSections.open_room = OpenRoom;
  };
  
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
  console.log(SearchDuel.subSections)
  let { data, lastDoc } = await Firestore.fetchLimitedDataFromFirebase(classItem, 6, SearchDuel.subSections[classItem].lastDoc);
  if (!SearchDuel.subSections[classItem].data) {
    SearchDuel.subSections[classItem].data = data;
  }
  if (SearchDuel.subSections[classItem].lastDoc) {
    SearchDuel.subSections[classItem].lastDoc = lastDoc;
  }

  SearchDuel.subSections[SearchDuel.selectedSubSection].load();
  SearchDuel.attachEventAtEnemyButtons();
}

SearchDuel.attachEventAtEnemyButtons = () => {
  const enemyButtons = SearchDuel.self.querySelectorAll(".dueller button");
  for (const enemyButton of enemyButtons) {
    enemyButton.addEventListener("click", () => {
      if (!UserValidation.unauthenticated(State.user.uid)) return;
      enemyButton.parentNode.classList.add("selected");
    });
  }
}