import React from 'react';
import { Modal, Skeleton } from 'antd';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { tss } from '../tss';
import { useGetPokemonDetails } from 'src/hooks/useGetPokemons';

const PokemonDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { classes } = useStyles();

  const { data, loading, error } = useGetPokemonDetails(id || '');

  const handleCancel = () => {
    // close the modal but keep search/page query params intact.
    navigate({ pathname: '/list', search: location.search });
  };

  // Only show modal if there's an ID in the URL
  if (!id) {
    return null;
  }

  return (
    <Modal
      open
      onCancel={handleCancel}
      footer={null}
      width={600}
      centered
      className={classes.modal}
      destroyOnClose
    >
      <div className={classes.modalContent}>
        {loading && <Skeleton active paragraph={{ rows: 6 }} />}
        {error && <div className={classes.statusMessage}>Error: {error.message}</div>}
        {data && !loading && !error && (
          <div className={classes.pokemonDetails}>
            <div className={classes.pokemonHeader}>
              <img src={data.sprite} alt={data.name} className={classes.pokemonImage} />
              <div className={classes.pokemonInfo}>
                <h2 className={classes.pokemonName}>{data.name}</h2>
                <span className={classes.pokemonNumber}>#{String(data.id).padStart(3, '0')}</span>
                <div className={classes.typesContainer}>
                  {data.types?.map((type) => {
                    const typeKey = `typeTag--${type.toLowerCase()}`;
                    const typeClass = (classes as Record<string, string>)[typeKey] ?? '';

                    return (
                      <span key={type} className={`${classes.typeTag} ${typeClass}`}>
                        {type}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className={classes.detailsGrid}>
              <div className={classes.detailItem}>
                <span className={classes.detailLabel}>Height:</span>
                <span className={classes.detailValue}>
                  {data.height ? `${(data.height / 10).toFixed(1)}m` : 'N/A'}
                </span>
              </div>
              <div className={classes.detailItem}>
                <span className={classes.detailLabel}>Weight:</span>
                <span className={classes.detailValue}>
                  {data.weight ? `${(data.weight / 10).toFixed(1)}kg` : 'N/A'}
                </span>
              </div>
              <div className={classes.detailItem}>
                <span className={classes.detailLabel}>Capture Rate:</span>
                <span className={classes.detailValue}>
                  {data.capture_rate ? `${data.capture_rate}%` : 'N/A'}
                </span>
              </div>

              <div className={classes.statsContainer}>
                <h3 className={classes.statsTitle}>Base Stats</h3>
                <div className={classes.statsList}>
                  {data.pokemonstats?.map((stat) => {
                    const statName = stat.stat?.name || 'unknown';

                    return (
                      <div key={`${statName}-${stat.base_stat}`} className={classes.statItem}>
                        <span className={classes.statLabel}>
                          {stat.stat?.name.replace('-', ' ') || 'N/A'}:
                        </span>
                        <span className={classes.statValue}>{stat.base_stat}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
        {!data && !loading && !error && (
          <div className={classes.statusMessage}>No details available for this Pokémon.</div>
        )}
      </div>
    </Modal>
  );
};

const useStyles = tss.create(({ theme }) => ({
  modal: {
    '& .ant-modal-content': {
      backgroundColor: theme.color.surface,
      color: theme.color.text.primary,
    },
  },
  modalContent: {
    padding: '20px',
  },
  pokemonDetails: {
    textAlign: 'center',
  },
  pokemonHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
  },
  pokemonImage: {
    width: '120px',
    height: '120px',
    objectFit: 'contain',
    marginBottom: '16px',
  },
  pokemonInfo: {
    textAlign: 'center',
    width: '100%',
  },
  pokemonNumber: {
    fontSize: '16px',
    color: '#888',
    display: 'block',
    marginBottom: '8px',
  },
  pokemonName: {
    margin: '0 0 8px 0',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  typesContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '8px',
    flexWrap: 'wrap',
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
  detailsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    textAlign: 'left',
  },
  detailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  detailLabel: {
    fontWeight: 'bold',
    color: theme.color.text.primary,
  },
  detailValue: {
    color: theme.color.text.primary,
  },
  statsContainer: {
    marginTop: '16px',
  },
  statsTitle: {
    margin: '0 0 12px 0',
    fontSize: '18px',
    color: theme.color.text.primary,
  },
  statsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  statItem: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  statLabel: {
    color: theme.color.text.primary,
  },
  statValue: {
    color: theme.color.text.primary,
    fontWeight: 'bold',
  },
  statusMessage: {
    padding: '20px',
    textAlign: 'center',
    fontSize: '16px',
  },
}));

export { PokemonDetailsPage };
