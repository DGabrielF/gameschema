import { State } from "../../../scripts/engine/state.js";
import { PokeApi } from "../../../scripts/services/api.js";
import { Card } from "../../shared/card/card.js";

export const Duel = {
  self: document.querySelector("section.search_duel #duel_page"),
  room: null,
  round: {
    starter: null,
    count: 0
  },
  winner: null,
  score: {
    owner: 0,
    challenger: 0
  },
  attribute: {
    selected: null,
    list: [
      "height",
      "weight",
      "health",
      "speed",
      "attack",
      "defense"
    ]
  },
  load: async () => {},
};

Duel.load = async (type, room) => {
  if (!room) return;

  Duel.room = room;

  // Verificar se o jogador é o owner
  // Posicionar as cartas do adversário na área de cartas do adversário
  // Posicionar as cartas do jogador na área de cartas do jogador

  chooseWhoStarts();

  // Avisar ao jogador se ele deve escolher o atributo ou deve esperar que o adversário escolha
  
  if (type === "npc_enemy") {
    await npcDuel();
  } else if (type === "enter_room") {
    // Apresentar um timer para a escolha do atributo e da carta
    playerDuel();
  }
};

async function npcDuel() {
  // console.log("Esta luta será contra o npc", Duel.room.name)
  // console.log(Duel.room)
  // console.log("objeto Duel", Duel)

  Duel.self.classList.remove("hide")
  const opponentArea = Duel.self.querySelector(".opponent_cards");
  const opponentCards = opponentArea.querySelectorAll(".card");
  console.log("cartas do adversário", opponentCards)
  console.log("duel", Duel)
  console.log("hand", Duel.room.owner.cards.hand)
  for (let i = 0; i < opponentCards.length; i++) {
    const cardData = await PokeApi.getPokemon(Duel.room.owner.cards.hand[i]);
    const cardAttributes = PokeApi.getUsefulAttributes(cardData);
    opponentCards[i].remove()
    opponentArea.appendChild(Card.create(cardAttributes))
  }

  // console.log(opponentCards)


  // TODO criar uma função que escolhe o atributo para npc
  // TODO criar uma função que seleciona a carta disponível com o maior valor do atributo selecionado
};

function playerDuel() {
  console.log("Esta luta será contra o jogador", Duel.room.name);
  // TODO Utilizar o room.uid para fazer uma requisição e pegar o cards.hand para preencher a página
};

function chooseWhoStarts() {
  const randomNumber = Math.random()
  Duel.round.starter = (randomNumber > 0.5) ? Duel.room.name : State.user.name
  console.log("Quem iniciá o duelo será", Duel.round.starter)
}

// Criar o sistema de seleção de atributo (Players)
// Apresentar atributo escolhido
// Criar o sistema de seleção de carta (Players)
// Sistema de temporizador para evitar "Catimba"
// Criar o sistema de verificação de vencedor
// Apresentar vencedor do confronto atual
// Atualizar os dados na tela
// Verificação de conclusão da partida
// Apresentação de resultados
// Sistema de geração de moedas
// Atualização dos dados de estatística dos usuários
// Atualização dos dados de salas de duelo dos usuários

// Se o jogador desafiar um npc
// Sortear quem irá começar a rodada
// Criar o sistema de seleção de atributo (NPC)
// Apresentar atributo escolhido
// Criar o sistema de seleção de carta (NPC)