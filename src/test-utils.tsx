/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable import/no-extraneous-dependencies */

import React, { FC, ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

const AllTheProviders: FC<{ children: React.ReactNode }> = ({ children }) => (
  <MemoryRouter initialEntries={['/list']}>{children}</MemoryRouter>
);

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

const renderWithNoRouter = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { ...options });

const userEventRender = (jsx: any, options?: RenderOptions) => {
  const wrapper = customRender(jsx, options);
  return {
    user: userEvent.setup({ delay: null }),
    ...wrapper,
  };
};
export * from '@testing-library/react';
export { userEventRender as render, renderWithNoRouter };
