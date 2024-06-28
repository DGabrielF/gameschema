export const PokeApi = {
  BASE_URL: "https://pokeapi.co/api/v2/pokemon",
  getPokemon: async () => {},
  getUsefulAttributes: () => {},
}

PokeApi.getPokemon = async (idOrName) => {
  const url = `${PokeApi.BASE_URL}/${idOrName}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return "Não foi possível encontrar este pokemon";
    }
    const data = await response.json();
    return data;    
  } catch (error) {
    return error.message;
  };
};

PokeApi.getUsefulAttributes = (pokeData) => {
  if (typeof pokeData === "string") return
  const usefulAttributes = {};
  usefulAttributes.id = pokeData.id;
  usefulAttributes.name = pokeData.name;
  usefulAttributes.types = pokeData.types;
  usefulAttributes.height = pokeData.height;
  usefulAttributes.weight = pokeData.weight;
  usefulAttributes.image = pokeData.sprites.other.dream_world.front_default ? pokeData.sprites.other.dream_world.front_default : pokeData.sprites.front_default;
  usefulAttributes.health = pokeData.stats.find((item) => item.stat.name === "hp").base_stat || 0;
  usefulAttributes.speed = pokeData.stats.find((item) => item.stat.name === "speed").base_stat || 0;
  usefulAttributes.attack = pokeData.stats.find((item) => item.stat.name === "attack").base_stat || 0;
  usefulAttributes.defense = pokeData.stats.find((item) => item.stat.name === "defense").base_stat || 0;

  return usefulAttributes;
};