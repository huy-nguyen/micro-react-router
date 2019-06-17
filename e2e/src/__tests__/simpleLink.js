import React from 'react';
import App from '../App';
import { render } from '@testing-library/react';

const setURL = (url) => window.history.pushState(null, null, url);

const cleanUpURL = () => setURL('');

afterEach(() => {
  cleanUpURL();
})

test('Navigation by clicking on simple links should work', () => {
  setURL('');

  const {getByText} = render(<App/>)
  expect(getByText(/Match result:/)).toHaveTextContent(/Success/)
  expect(getByText(/Matched route ID:/)).toHaveTextContent(/home/)

  expect(
    () => getByText(/Path Param:/)
  ).toThrow(/Unable to find an element/);

  expect(
    () => getByText(/Query Param:/)
  ).toThrow(/Unable to find an element/);

  setURL('/about/me');

  expect(getByText(/Match result:/)).toHaveTextContent(/Success/)
  expect(getByText(/Matched route ID:/)).toHaveTextContent(/about-me/)

  expect(
    () => getByText(/Path Param:/)
  ).toThrow(/Unable to find an element/);

  expect(
    () => getByText(/Query Param:/)
  ).toThrow(/Unable to find an element/);

})
