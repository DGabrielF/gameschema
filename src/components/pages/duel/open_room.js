import { State } from "../../../scripts/engine/state.js";
import { Firestore } from "../../../scripts/services/firebase/firestore.js";
import { UserValidation } from "../../../scripts/services/validation/user.js";
import { Toast } from "../../shared/toast/toast.js";
import { SearchDuel } from "./search.js"

export const OpenRoom = {
  self: document.querySelector("section.search_duel .open_room"),
  databaseName: "NPCs",
  data: null,
  dataLimit: 10,
  lastDoc: null,
  totalCount: null,
  selectedEnemy: null,
  privateRoom: false,
  load: () => {},
  list: () => {}
}

OpenRoom.load = async () => {
  if (!OpenRoom.data) {
    await SearchDuel.subsectionDataUpdate(OpenRoom)
  }
  const privateCheckBox = OpenRoom.self.querySelector(".private_input input");
  privateCheckBox.addEventListener("change", togglePrivateRoom)

  const confirmButton = OpenRoom.self.querySelector("button.confirm");
  console.log(confirmButton)
  confirmButton.addEventListener("click", createRoom);
}

function togglePrivateRoom() {
  OpenRoom.privateRoom = !OpenRoom.privateRoom;

  const passwordInputArea = OpenRoom.self.querySelector(".password_input");
  if (OpenRoom.privateRoom) {
    passwordInputArea.classList.remove("hide");
  } else {
    passwordInputArea.classList.add("hide");
  }
}

async function createRoom() {
  if (UserValidation.unauthenticated(State.user.uid)) return;

  const nameInput = OpenRoom.self.querySelector(".room_name_input input");

  const name = nameInput.value;

  const passwordInput = OpenRoom.self.querySelector(".password_input input");
  let password = passwordInput.value;
  if (!OpenRoom.privateRoom) {
    password = null
  }

  const data = {
    uid: State.user.uid,
    name: name,
    private: OpenRoom.privateRoom,
    password: password,
    status: "open"
  }
  const response = await Firestore.createData("rooms", data);
  if (typeof response === "string") {
    Toast.open("Erro", response, Toast.error);
  } else {
    Toast.open("Sucesso", "Sala Criada! Aguarde um desafiante", Toast.success);
  }
}