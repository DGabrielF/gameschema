export const PokeApi = {
  BASE_URL: "https://pokeapi.co/api/v2/pokemon",
  getPokemon: async () => {},
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
  }
}