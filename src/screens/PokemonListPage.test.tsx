import React from 'react';
import { act, render } from 'src/test-utils';
import { PokemonListPage } from './PokemonListPage';
import { useNavigate } from 'react-router-dom';
import { useGetPokemons } from 'src/hooks/useGetPokemons';

jest.mock('src/hooks/useGetPokemons', () => ({
  useGetPokemons: jest.fn().mockReturnValue({
    data: [{ id: '1', name: 'Bulbasaur' }],
    loading: false,
    error: null,
    totalCount: 151,
  }),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('PokemonListPage', () => {
  test('it renders', () => {
    const { getByText } = render(<PokemonListPage />);
    getByText('Bulbasaur');
  });
  test('clicking on a pokemon calls navigate', async () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    const { getByText, user } = render(<PokemonListPage />);

    await act(async () => {
      await user.click(getByText('Bulbasaur'));
    });

    expect(mockNavigate).toHaveBeenCalledWith('/pokemon/1?page=0');
  });
  test('typing in the search bar filters the results', async () => {
    jest.useFakeTimers();

    const useGetPokemonsMock = useGetPokemons as unknown as jest.Mock;

    useGetPokemonsMock.mockImplementation((search?: string) => {
      if (!search) {
        return {
          data: [
            { id: '1', name: 'Bulbasaur' },
            { id: '25', name: 'Pikachu' },
          ],
          loading: false,
          error: null,
          totalCount: 2,
        };
      }

      return {
        data: [{ id: '25', name: 'Pikachu' }],
        loading: false,
        error: null,
        totalCount: 1,
      };
    });

    const { getByText, getByPlaceholderText, queryByText, user } = render(<PokemonListPage />);

    getByText('Bulbasaur');
    getByText('Pikachu');

    await act(async () => {
      await user.type(getByPlaceholderText('Search Pokémon...'), 'Pika');
      jest.advanceTimersByTime(400);
    });

    expect(queryByText('Bulbasaur')).toBeNull();
    expect(getByText('Pikachu')).toBeInTheDocument();

    jest.useRealTimers();
  });
});
