export const PokeApi = {
  BASE_URL: "https://pokeapi.co/api/v2/pokemon",
  getPokemon: async () => {},
  getPokemonTotalNumber: async () => {},
}

PokeApi.getPokemonTotalNumber = async () => {
  const url = `${PokeApi.BASE_URL}?limit=1`
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro ao obter dados. Código de status: ${response.status}`)
    }
    const data = await response.json();
    return data.count    
  } catch (error) {
    return error.message
  }
}

PokeApi.getPokemon = async (idOrName) => {
  const url = `${PokeApi.BASE_URL}/${idOrName}`
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro ao obter dados. Código de status: ${response.status}`)
    }
    const data = await response.json();
    return data      
  } catch (error) {
    return error.message
  }
}