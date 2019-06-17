// This file is the entry point for JSDOM-based tests:

import React from 'react'
import Content from './Content'
import Nav from './Nav'
import styled from 'styled-components';
const {customizedLinkTestTargetID} = require('./dataTestIDs');

const Root = styled.div`
  display: grid;
  padding-top: 1rem;
  grid-template-columns: 0.5rem repeat(3, 1fr) 0.5rem;
  grid-template-rows: 400px 300px auto auto;
  column-gap: 1rem;
  row-gap: 1rem;
`

const App = () => (
  <Root>
    <Nav/>
    <Content/>
    <div style={{gridColumn: 2, gridRow: 4}} data-testid={customizedLinkTestTargetID}/>
  </Root>
)

export default App;
