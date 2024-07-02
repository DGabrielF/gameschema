import { Firestore } from "../../../scripts/services/firebase/firestore.js";
import { Duel } from "./duel.js";
import { SearchDuel } from "./search.js";

export const NpcEnemy = {
  self: document.querySelector("section.search_duel .npc_enemy"),
  databaseName: "npc",
  data: null,
  dataLimit: 10,
  lastDoc: null,
  totalCount: null,
  selectedEnemy: null,
  load: async () => {},
  list: () => {},
}

NpcEnemy.load = async () => {
  if (!NpcEnemy.data || NpcEnemy.data.length === 0) {
    await SearchDuel.subsectionDataUpdate(NpcEnemy);
  };

  NpcEnemy.list();

  const updateButton = NpcEnemy.self.querySelector(".update.icon");
  updateButton.addEventListener("click", updateList)
}

NpcEnemy.list = () => {
  const duellerList = NpcEnemy.self.querySelector(".dueller_list");
  duellerList.innerHTML = "";

  if (NpcEnemy.data.length > 0) {
    for (const dueller of NpcEnemy.data) {
      const id = document.getElementById(dueller.id);
      if (!id) {
        const li = document.createElement("li");
        li.classList.add("dueller");
        li.id = dueller.id;
        const duellerContent = `
          <span class="dueller_name">${dueller.name}</span>
          ${dueller.private?'<img src="./src/assets/icons/general/lock.svg"} alt="">':""}
          <button class="icon">
            <img src="./src/assets/icons/general/enter.svg" alt="" class="icon">
          </button>
        `
        li.innerHTML = duellerContent;
        duellerList.appendChild(li)
      }
    }
  }
}

async function updateList () {
  // TODO Criar uma função para pegar dados aleatórios do bando de dados no firebase

  await SearchDuel.subsectionDataUpdate(NpcEnemy);

  NpcEnemy.list();
}

function enterRoom (event) {
  const duelId = event.target.closest(".dueller").id

  const foundRoom = NpcEnemy.data.find(room => room.id === duelId);

  if (foundRoom.private) {
    console.log("digite a senha para entrar nessa sala")
  }
  // Verificação de senha correta
  // Alerta de senha incorreta
  // Alerta de senha correta e carregamento de dados
  Duel.load("npc", foundRoom)

  // Usar os dados da sala para pegar os dados do jogador, cartas na mão
  // Os dados já estão carregados em NpcEnemy.data

  // Em casos que não são npc
  // Verificar se a sala precisa de senha
  // Caso precisa, criar uma janela para digitar a senha

  // Apresentar a janela de duelo após a atualização dos dados
}