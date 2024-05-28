export const cardColors = {};

const typeColors = {
  bug: {
    background: "#808000"
  },
  dark: {
    background: "#705848"
  },
  dragon: {
    background: "#7038f8"
  },
  electric: {
    background: "#f8d030"
  },
  fairy: {
    background: "#ee82ee"
  },
  fighting: {
    background: "#903028"
  },
  fire: {
    background: "#f05030"
  },
  flying: {
    background: "#a890f0"
  },
  ghost: {
    background: "#705898"
  },
  grass: {
    background: "#78c850"
  },
  ground: {
    background: "#e0c068"
  },
  ice: {
    background: "#98d8d8"
  },
  normal: {
    background: "#a8a878"
  },
  poison: {
    background: "#a040a0"
  },
  psychic: {
    background: "#f85888"
  },
  rock: {
    background: "#b8a038"
  },
  steel: {
    background: "#b8b8d0"
  },
  water: {
    background: "#6890f0"
  },
}

cardColors.setBgColor = (element) => {
  const bgColors = [];
  for (const itemList of element.classList) {
    if (itemList in typeColors) {
      bgColors.push(typeColors[itemList].background);
    }
  }
  const startColors = [];
  const endColors = [];
  let bgString = "linear-gradient(45deg"
  for (let i = 0; i < bgColors.length; i++) {
    if (i === 0) {
      startColors.push(`${bgColors[0]}ff`);
      endColors.push(`${bgColors[0]}ff)`)
    }    
    startColors.push(`${bgColors[i]}aa`);
    if (i !== bgColors.length - 1) {
      endColors.push(`${bgColors[i]}aa`);
    }
  }
  const concatColors = startColors.concat(endColors.reverse());
  concatColors.forEach(color => bgString += `, ${color}`)
  element.style.background = bgString
}