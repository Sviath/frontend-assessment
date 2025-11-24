import React from 'react';
import { act, renderWithNoRouter as render } from './test-utils';
import App from './App';

jest.mock('../README.md', () => ({
  text: jest.fn().mockResolvedValue('hello world'),
}));

test('renders home page', async () => {
  let utils: ReturnType<typeof render> | undefined;

  await act(async () => {
    utils = render(<App />);
  });

  if (!utils) {
    throw new Error('App failed to render');
  }

  expect(utils.getByTestId('MockReactMarkdown')).toBeInTheDocument();
});
