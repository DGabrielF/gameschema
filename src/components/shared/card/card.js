import { cardColors } from "./type.js";

export const Card = {
  create: () => {},
};

Card.create = (pokeData) => {
  const div = document.createElement("div");
  div.id = Card.id;
  div.classList.add("card");

  getPokeAttributesFromData(pokeData)

  const typesString = typesStringGenerator(Card.types);
  addClassTypes(div, Card.types);
  cardColors.setBgColor(div);

  const cardContent = `
    <span class="name"">${Card.name}</span>
    <div class="details">
      <div class="shape">
        <div class="attribute">
          <img src="src/assets/icons/card/height.svg">
          <span>${Card.height}</span>
        </div>
        <div class="attribute">
          <img src="src/assets/icons/card/weight.svg">
          <span>${Card.weight}</span>
        </div>
      </div>
      <ul class="types">
        ${typesString}
      </ul>
    </div>
    <div class="image">
      <img src="${Card.image}" alt="metapod">
    </div>
    <div class="attributes">
      <div class="attribute">
        <img src="src/assets/icons/card/health.svg">
        <span>${Card.health}</span>
      </div>
      <div class="attribute">
        <img src="src/assets/icons/card/speed.svg" >
        <span>${Card.speed}</span>
      </div>
      <div class="attribute">
        <img src="src/assets/icons/card/attack.svg">
        <span>${Card.attack}</span>
      </div>
      <div class="attribute">
        <img src="src/assets/icons/card/defense.svg">
        <span>${Card.defense}</span>
      </div>
    </div>
  `;

  div.innerHTML = cardContent;
  return div
}

function getPokeAttributesFromData (pokeData) {
  Card.name = pokeData.name;
  Card.types = pokeData.types;
  Card.height = pokeData.height;
  Card.weight = pokeData.weight;
  Card.image = pokeData.image;
  Card.health = pokeData.health;
  Card.speed = pokeData.speed;
  Card.attack = pokeData.attack;
  Card.defense = pokeData.defense;
}

function typesStringGenerator(types) {
  let typesString = "";
  for (const element of types) {
    typesString += `
      <li>
        <img src="src/assets/icons/card/types/${element.type.name}.svg" alt="${element.type.name}">
      </li>
    `;
  }
  return typesString
}

function addClassTypes (card, types) {
  for (const element of types) {
    card.classList.add(element.type.name)
  }
}