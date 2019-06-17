import React from 'react';
import App from '../App';
import { render } from '@testing-library/react';

const setURL = (url) => window.history.pushState(null, null, url);

const cleanUpURL = () => setURL('');

afterEach(() => {
  cleanUpURL();
})


test('should succeeed in matching home route', () => {
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

})

test('should succeeed in matching simple route with no path or query params', () => {
  setURL('/about/me');

  const {getByText} = render(<App/>)
  expect(getByText(/Match result:/)).toHaveTextContent(/Success/)
  expect(getByText(/Matched route ID:/)).toHaveTextContent(/about-me/)

  expect(
    () => getByText(/Path Param:/)
  ).toThrow(/Unable to find an element/);

  expect(
    () => getByText(/Query Param:/)
  ).toThrow(/Unable to find an element/);

})

test('Should succeed in matching mandatory path params', () => {
  setURL('/topics/haskell');

  const {getByText} = render(<App/>);
  expect(getByText(/Match result:/)).toHaveTextContent(/Success/);
  expect(getByText(/Matched route ID:/)).toHaveTextContent(/topics/);
  expect(getByText(/Path Param:/)).toHaveTextContent(/topicName: haskell/);

  expect(
    () => getByText(/Query Param:/)
  ).toThrow(/Unable to find an element/);

})

test('Should succeed in matching optional path params', () => {
  setURL('/about/me/works/the-mythical-man-month');

  const {getByText} = render(<App/>);
  expect(getByText(/Match result:/)).toHaveTextContent(/Success/);
  expect(getByText(/Matched route ID:/)).toHaveTextContent(/about-my-works/);
  expect(getByText(/Path Param:/)).toHaveTextContent(/workName: the-mythical-man-month/);

  expect(
    () => getByText(/Query Param:/)
  ).toThrow(/Unable to find an element/);

})

test('Should succeed in matching query params', () => {
  setURL('/about/me/works?year=2000');

  const {getByText} = render(<App/>);
  expect(getByText(/Match result:/)).toHaveTextContent(/Success/);
  expect(getByText(/Matched route ID:/)).toHaveTextContent(/about-my-works/);
  expect(getByText(/Query Param:/)).toHaveTextContent(/year: 2000/);

  expect(
    () => getByText(/Path Param:/)
  ).toThrow(/Unable to find an element/);

})

test('Should succeed in matching path and query params', () => {
  setURL('/about/me/works/the-art-of-computer-programming?part=1&year=2000');

  const {getByText} = render(<App/>);
  expect(getByText(/Match result:/)).toHaveTextContent(/Success/);
  expect(getByText(/Matched route ID:/)).toHaveTextContent(/about-my-works/);
  expect(getByText(/Path Param/)).toHaveTextContent(/workName: the-art-of-computer-programming/);
  expect(getByText(/Query Param: part:/)).toHaveTextContent(/part: 1/);
  expect(getByText(/Query Param: year:/)).toHaveTextContent(/year: 2000/);
})
