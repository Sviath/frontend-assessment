import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

export interface Pokemon {
  id: number | string;
  name: string;
  types?: string[];
  sprite?: string;
}

export interface PokemonDetail extends Pokemon {
  capture_rate?: number;
  weight?: number;
  height?: number;
  pokemonstats?: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
}

export const getPokemons = gql`
  query GetPokemons($search: String, $first: Int, $offset: Int) {
    pokemon(
      limit: $first
      offset: $offset
      order_by: { id: asc }
      where: {
        pokemonspecy: {
          pokemonspeciesnames: { language: { name: { _eq: "en" } }, name: { _regex: $search } }
        }
      }
    ) {
      id
      pokemonspecy {
        pokemonspeciesnames(where: { language: { name: { _eq: "en" } } }) {
          name
        }
      }
      pokemonsprites {
        sprites(path: "other.official-artwork.front_default")
      }
      pokemontypes {
        type {
          typenames(where: { language: { name: { _eq: "en" } } }) {
            name
          }
        }
      }
    }
    pokemon_aggregate(
      where: {
        pokemonspecy: {
          pokemonspeciesnames: { language: { name: { _eq: "en" } }, name: { _regex: $search } }
        }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const getPokemonDetails = gql`
  query GetPokemonDetails($id: Int!) {
    pokemon(where: { id: { _eq: $id } }) {
      id
      pokemonspecy {
        pokemonspeciesnames(where: { language: { name: { _eq: "en" } } }) {
          name
        }
        capture_rate
      }
      pokemonsprites {
        sprites(path: "other.official-artwork.front_default")
      }
      pokemontypes {
        type {
          typenames(where: { language: { name: { _eq: "en" } } }) {
            name
          }
        }
      }
      weight
      height
      pokemonstats {
        base_stat
        stat {
          name
        }
      }
    }
  }
`;

interface PokemonAPIResponse {
  id: string;
  pokemonspecy: {
    pokemonspeciesnames: {
      name: string;
    }[];
  };
  pokemonsprites: {
    sprites: string;
  }[];
  pokemontypes: {
    type: {
      typenames: {
        name: string;
      }[];
    };
  }[];
}

interface PokemonDetailAPIResponse {
  id: string;
  pokemonspecy: {
    pokemonspeciesnames: {
      name: string;
    }[];
    capture_rate: number;
  };
  pokemonsprites: {
    sprites: string;
  }[];
  pokemontypes: {
    type: {
      typenames: {
        name: string;
      }[];
    };
  }[];
  weight: number;
  height: number;
  pokemonstats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
}

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildSearchPattern = (term?: string | null): string => {
  if (!term || !term.trim()) {
    return '.*';
  }
  const escaped = escapeRegex(term.trim());
  return `(?i).*${escaped}.*`;
};

// Search should be done client-side for the mid-level assessment. Uncomment for the senior assessment.
export const useGetPokemons = (
  search?: string,
  first: number = 20,
  offset: number = 0,
): {
  data: Pokemon[];
  loading: boolean;
  error: useQuery.Result['error'];
  totalCount: number;
} => {
  const { data, loading, error } = useQuery<{
    pokemon: PokemonAPIResponse[];
    pokemon_aggregate: { aggregate: { count: number } };
  }>(getPokemons, {
    variables: {
      search: buildSearchPattern(search),
      first,
      offset,
    },
  });

  return {
    data:
      data?.pokemon?.map(
        (p): Pokemon => ({
          id: String(p.id),
          name: p.pokemonspecy.pokemonspeciesnames?.[0]?.name,
          types:
            p.pokemontypes
              ?.map((t) => t.type.typenames?.[0]?.name)
              .filter((name): name is string => Boolean(name)) ?? [],
          sprite: p.pokemonsprites?.[0]?.sprites,
        }),
      ) ?? [],
    totalCount: data?.pokemon_aggregate?.aggregate?.count || 0,
    loading,
    error,
  };
};

export const useGetPokemonDetails = (
  id: string,
): {
  data: PokemonDetail | undefined;
  loading: boolean;
  error: useQuery.Result['error'];
} => {
  const numericId = parseInt(id, 10);
  const shouldSkip = !id || Number.isNaN(numericId);

  const { data, loading, error } = useQuery<{
    pokemon: PokemonDetailAPIResponse[];
  }>(getPokemonDetails, {
    variables: {
      id: numericId,
    },
    skip: shouldSkip,
  });

  if (shouldSkip || !data || !data.pokemon || data.pokemon.length === 0) {
    return {
      data: undefined,
      loading: shouldSkip ? false : loading,
      error,
    };
  }

  const pokemon = data.pokemon[0];

  const result: PokemonDetail = {
    id: String(pokemon.id),
    name: pokemon.pokemonspecy.pokemonspeciesnames?.[0]?.name,
    types:
      pokemon.pokemontypes
        ?.map((t) => t.type.typenames?.[0]?.name)
        .filter((name): name is string => Boolean(name)) ?? [],
    sprite: pokemon.pokemonsprites?.[0]?.sprites,
    capture_rate: pokemon.pokemonspecy.capture_rate,
    weight: pokemon.weight,
    height: pokemon.height,
    pokemonstats: pokemon.pokemonstats,
  };

  return {
    data: result,
    loading,
    error,
  };
};
