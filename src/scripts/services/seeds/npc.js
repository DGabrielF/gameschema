export async function generateData() {
  const allNpc = await Firestore.fetchDataFromFirebase("NPCs")
  let count = 0
  for (const npc of allNpc) {
    const NpcData = {
      name: npc.name,
      owner: {
        uid: null,
        name: npc.name,
        cards: {
          selected: npc.cards,
          disabled: null,
          hand: npc.cards
        }
      },
      challenger: {
        uid: null,
        name: null,
        cards: {
          selected: null,
          disabled: null,
          hand: null
        }
      },
      private: false,
      password: null,
      challengerName: null,
      status: "open"
    }

    const response = await Firestore.createData("npc", NpcData);
    if (typeof response !== "string") {
      count += 1
      console.log("Adição realizada com sucesso, progresso: ", (count * 100 / allNpc.length).toFixed(2), "%")
      console.log("=====================================================")
    } else {
      console.error(response)
      console.error("Apague o banco de dados e recomece")
      break
    }
  };

  if (count === allNpc.length) {
    console.log("Processo de adição de npcs realizada com sucesso até o final");
  }
}