import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tss } from '../tss';
import { useGetPokemons, Pokemon } from 'src/hooks/useGetPokemons';

// Custom hook to debounce search input
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const PokemonListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { data, loading, error } = useGetPokemons(debouncedSearchTerm);
  const { classes } = useStyles();
  const navigate = useNavigate();

  const handlePokemonClick = (pokemonId: string) => {
    navigate(`/pokemon/${pokemonId}`);
  };

  // Function to get a random message when no Pokémon are found
  const getRandomEmptyMessage = () => {
    const messages = [
      "No Pokémon found… they're probably hiding in tall grass.",
      'No Pokémon here… maybe they all fainted?',
      'No Pokémon found. Did Team Rocket steal them again?',
      "Area empty. Even Zubat didn't show up (that's rare).",
      'Looks like this patch of grass is empty.',
      'No Pokémon found… try a different route?',
      'No Pokémon found… they might be out of season.',
      'Empty area. A wild MissingNo. appeared instead!',
      "No Pokémon here… maybe they're in the underground?",
      'No Pokémon found. Did you forget your Poké Flute?',
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const renderContent = () => {
    switch (true) {
      case loading && debouncedSearchTerm !== '':
        return (
          <>
            <div className={classes.searchContainer}>
              <input
                type="text"
                placeholder="Search Pokémon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={classes.searchInput}
              />
            </div>
            <div className={classes.statusMessage}>Searching...</div>
          </>
        );
      case loading:
        return (
          <>
            <div className={classes.searchContainer}>
              <input
                type="text"
                placeholder="Search Pokémon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={classes.searchInput}
              />
            </div>
            <div className={classes.statusMessage}>Loading...</div>
          </>
        );
      case Boolean(error):
        return (
          <>
            <div className={classes.searchContainer}>
              <input
                type="text"
                placeholder="Search Pokémon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={classes.searchInput}
              />
            </div>
            <div className={classes.statusMessage}>Error: {error?.message}</div>
          </>
        );
      case !data || data.length === 0:
        return (
          <>
            <div className={classes.searchContainer}>
              <input
                type="text"
                placeholder="Search Pokémon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={classes.searchInput}
              />
            </div>
            <div className={classes.statusMessage}>{getRandomEmptyMessage()}</div>
          </>
        );
      case debouncedSearchTerm && data && data.length === 0:
        return (
          <>
            <div className={classes.searchContainer}>
              <input
                type="text"
                placeholder="Search Pokémon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={classes.searchInput}
              />
            </div>
            <div className={classes.statusMessage}>No Pokémon match your search</div>
          </>
        );
      default:
        return (
          <>
            <div className={classes.searchContainer}>
              <input
                type="text"
                placeholder="Search Pokémon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={classes.searchInput}
              />
            </div>
            <ul className={classes.list}>
              {data?.map((pokemon: Pokemon) => (
                <PokemonItem
                  key={pokemon.id}
                  pokemon={pokemon}
                  classes={classes}
                  onClick={() => handlePokemonClick(String(pokemon.id))}
                />
              ))}
            </ul>
          </>
        );
    }
  };

  return <div className={classes.root}>{renderContent()}</div>;
};

interface PokemonItemProps {
  pokemon: Pokemon;
  classes: Record<string, string>;
  onClick: () => void;
}

const PokemonItem: React.FC<PokemonItemProps> = ({ pokemon, classes, onClick }) => (
  <button
    type="button"
    className={classes.pokemonCard}
    onClick={onClick}
    style={{
      background:
        pokemon.types && pokemon.types.length > 0
          ? `radial-gradient(circle at center, ${getTypeColor(pokemon.types[0])}40 0%, transparent 70%)`
          : 'radial-gradient(circle at center, #66666640 0%, transparent 70%)',
    }}
  >
    {pokemon.sprite && (
      <img src={pokemon.sprite} alt={pokemon.name} className={classes.pokemonImage} />
    )}
    <div className={classes.pokemonInfo}>
      <h3 className={classes.pokemonName}>{pokemon.name}</h3>
      <span className={classes.pokemonNumber}>#{String(pokemon.id).padStart(3, '0')}</span>
      {pokemon.types && pokemon.types.length > 0 && (
        <div
          className={
            pokemon.types.length === 1 ? classes.typesContainerSingle : classes.typesContainer
          }
        >
          {pokemon.types.map((type) => (
            <span
              key={type}
              className={`${classes.typeTag} ${classes[`typeTag--${type.toLowerCase()}`]}`}
            >
              {type}
            </span>
          ))}
        </div>
      )}
    </div>
  </button>
);

const getTypeColor = (type: string): string => {
  const typeColors: Record<string, string> = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
  };
  return typeColors[type.toLowerCase()] || '#666666';
};

const useStyles = tss.create(({ theme }) => ({
  root: {
    color: theme.color.text.primary,
    padding: '20px',
  },
  searchContainer: {
    marginBottom: '20px',
    textAlign: 'center',
  },
  searchInput: {
    padding: '10px 15px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backgroundColor: theme.color.surface,
    color: theme.color.text.primary,
    width: '300px',
    outline: 'none',
    '&:focus': {
      borderColor: '#007bff',
    },
  },
  statusMessage: {
    padding: '20px',
    textAlign: 'center',
    fontSize: '16px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  listItem: {
    margin: 0,
    padding: 0,
  },
  pokemonCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: theme.color.surface,
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    minHeight: '200px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
    },
    '&:focus': {
      outline: '2px solid #007bff',
    },
  },
  pokemonInfo: {
    textAlign: 'center',
    marginTop: '12px',
    width: '100%',
  },
  pokemonNumber: {
    fontSize: '12px',
    color: '#888',
    display: 'block',
  },
  pokemonName: {
    margin: '4px 0',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  typesContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '6px',
    marginTop: '8px',
  },
  typesContainerSingle: {
    display: 'flex',
    justifyContent: 'center',
    gap: '6px',
    marginTop: '8px',
  },
  typeTag: {
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '12px',
    fontSize: '13px',
    textTransform: 'uppercase',
    width: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  'typeTag--normal': {
    backgroundColor: '#A8A878',
  },
  'typeTag--fire': {
    backgroundColor: '#F08030',
  },
  'typeTag--water': {
    backgroundColor: '#6890F0',
  },
  'typeTag--electric': {
    backgroundColor: '#F8D030',
  },
  'typeTag--grass': {
    backgroundColor: '#78C850',
  },
  'typeTag--ice': {
    backgroundColor: '#98D8D8',
  },
  'typeTag--fighting': {
    backgroundColor: '#C03028',
  },
  'typeTag--poison': {
    backgroundColor: '#A040A0',
  },
  'typeTag--ground': {
    backgroundColor: '#E0C068',
  },
  'typeTag--flying': {
    backgroundColor: '#A890F0',
  },
  'typeTag--psychic': {
    backgroundColor: '#F85888',
  },
  'typeTag--bug': {
    backgroundColor: '#A8B820',
  },
  'typeTag--rock': {
    backgroundColor: '#B8A038',
  },
  'typeTag--ghost': {
    backgroundColor: '#705898',
  },
  'typeTag--dragon': {
    backgroundColor: '#7038F8',
  },
  'typeTag--dark': {
    backgroundColor: '#705848',
  },
  'typeTag--steel': {
    backgroundColor: '#B8B8D0',
  },
  'typeTag--fairy': {
    backgroundColor: '#EE99AC',
  },
  pokemonImage: {
    width: '80px',
    height: '80px',
    objectFit: 'contain',
    marginBottom: '8px',
  },
}));

export { PokemonListPage };
