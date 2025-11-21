import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

export interface Pokemon {
  id: number | string;
  name: string;
  types?: string[];
  sprite?: string;
}

export interface PokemonDetail extends Pokemon {
  // Details
}

export const GET_POKEMONS = gql`
  query GetPokemons($search: String) {
    pokemon(
      limit: 151
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
  }
`;

export const GET_POKEMON_DETAILS = gql`
  query GetPokemonDetails($id: String!) {
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

// Search should be done client-side for the mid-level assessment. Uncomment for the senior assessment.
export const useGetPokemons = (/* search?: string */): {
  data: Pokemon[];
  loading: boolean;
  error: useQuery.Result['error'];
} => {
  const { data, loading, error } = useQuery<{ pokemon: PokemonAPIResponse[] }>(GET_POKEMONS, {
    variables: {
      search: '', // `.*${search}.*`,
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
    loading,
    error,
  };
};
