import React from 'react'
import { useMatchedRoute, } from './routing';
import styled from 'styled-components';

const Root = styled.main`
  grid-row: 3;
  grid-column: 2 / 5;
`
const ParamsContainer = styled.div`
  margin-top: 1rem;
`


const Content = () => {
  const matchedRoute = useMatchedRoute();
  let content;
  if (matchedRoute.success === true) {
    const {pathParams, queryParams} = matchedRoute;

    const pathParamsPairs = Object.entries(pathParams).filter(
      ([, value]) => value !== undefined,
    )
    let pathParamsListing: React.ReactElement<any> | null;
    if (pathParamsPairs.length === 0) {
      pathParamsListing = null;
    } else {
      const pathParamsListElems = pathParamsPairs.map(([key, value]) => (
        <li key={key}>Path Param: {key}: {value}</li>
      ))
      pathParamsListing = (
        <ParamsContainer>
          <div>Path Elements:</div>
          <ul>{pathParamsListElems}</ul>
        </ParamsContainer>
      )
    }

    const queryParamsPairs = Object.entries(queryParams).filter(
      ([, value]) => value !== undefined,
    );
    let queryParamsListing: React.ReactElement<any> | null;
    if (queryParamsPairs.length === 0) {
      queryParamsListing = null;
    } else {
      const queryParamsListElems = queryParamsPairs.map(([key, value]) => (
        <li key={key}>Query Param: {key}: {value}</li>
      ))
      queryParamsListing = (
        <ParamsContainer>
          <div>Query Elements:</div>
          <ul>{queryParamsListElems}</ul>
        </ParamsContainer>
      )
    }
    content = (
      <>
        <div data-testid="match-route-success-or-failure">Match result: Success</div>
        <div data-testid="match-route-route-id">Matched route ID: {matchedRoute.id}</div>
        {pathParamsListing}
        {queryParamsListing}
      </>
    )
  } else {
    content = (
      <div>Match result: Failure</div>
    )
  }
  return (
    <Root>
      {content}
    </Root>
  )
}

export default Content;
