import React from 'react'
import { RouteID } from './routing';
import {
  SimpleLink, NavLink, NavLinkInGroup, CustomizedLink
} from './links';

import styled from 'styled-components';

const LinkListContainer = styled.nav`
`
const LinkListTitle = styled.div`

`
const LinkList = styled.ul`
  display: flex;
  flex-direction: column;
  border: 1px solid grey;
  border-radius: 0.25rem;
;`
const LinkContainer = styled.li`
  list-style: none;
`

const Nav = () => {

  const navLinkGroup = {
    aboutGroupKey: {id: RouteID.About},
    aboutMeGroupKey: {id: RouteID.AboutMe},
    aboutMyWorksGroupKey: {id: RouteID.AboutMyWorks},
    homeGroupKey: {id: RouteID.Home},
  };

  return (
    <>
      <LinkListContainer style={{gridColumn: 2, gridRow: 1}}>
        <LinkListTitle>Simple links</LinkListTitle>
        <LinkList>
          <LinkContainer>
            <SimpleLink id={RouteID.Home}>Home</SimpleLink>
          </LinkContainer>
          <LinkContainer>
            <SimpleLink id={RouteID.Topics} pathParams={{topicName: 'haskell'}}>
              Topic Haskell
            </SimpleLink>
          </LinkContainer>
          <LinkContainer>
            <SimpleLink id={RouteID.About}>About Only</SimpleLink>
          </LinkContainer>
          <LinkContainer>
            <SimpleLink id={RouteID.AboutMe}>About Me</SimpleLink>
          </LinkContainer>
          <LinkContainer>
            <SimpleLink id={RouteID.AboutMyWorks}>About My Works</SimpleLink>
          </LinkContainer>
          <LinkContainer>
            <SimpleLink
              id={RouteID.AboutMyWorks}
              pathParams={{workName: 'the-mythical-man-month'}}
            >
              About My Work: The Mythical Man Month
            </SimpleLink>
          </LinkContainer>
          <LinkContainer>
            <SimpleLink
              id={RouteID.AboutMyWorks}
              queryParams={{year: '2000'}}
            >
              About My Works in 2000
            </SimpleLink>
          </LinkContainer>
          <LinkContainer>
            <SimpleLink
              id={RouteID.AboutMyWorks}
              pathParams={{workName: 'the-art-of-computer-programming'}}
              queryParams={{part: '1'}}
            >
              About My Work: The Art of Computer Programming part 1
            </SimpleLink>
          </LinkContainer>
        </LinkList>
      </LinkListContainer>
      <LinkListContainer style={{gridColumn: 3, gridRow: 1}}>
        <LinkListTitle>Customized simple links</LinkListTitle>
        <LinkList>
          <LinkContainer>
            <CustomizedLink id={RouteID.Home}>Home</CustomizedLink>
          </LinkContainer>
          <LinkContainer>
            <CustomizedLink id={RouteID.Topics} pathParams={{topicName: 'ReasonML'}}>Topic ReasonML</CustomizedLink>
          </LinkContainer>
          <LinkContainer>
            <CustomizedLink id={RouteID.About}>About Only</CustomizedLink>
          </LinkContainer>
          <LinkContainer>
            <CustomizedLink id={RouteID.AboutMe}>About Me</CustomizedLink>
          </LinkContainer>
          <LinkContainer>
            <CustomizedLink id={RouteID.AboutMyWorks}>About My Works</CustomizedLink>
          </LinkContainer>
        </LinkList>
      </LinkListContainer>

      <LinkListContainer style={{gridColumn: 4, gridRow: 1}}>
        <LinkListTitle>Nav links</LinkListTitle>
        <LinkList>
          <LinkContainer>
            <NavLink id={RouteID.Home}>Home</NavLink>
          </LinkContainer>
          <LinkContainer>
            <NavLink id={RouteID.Topics} pathParams={{topicName: 'Clojure'}}>Topic Clojure</NavLink>
          </LinkContainer>
          <LinkContainer>
            <NavLink id={RouteID.Topics} pathParams={{topicName: 'Haskell'}}>Topic Haskell</NavLink>
          </LinkContainer>
          <LinkContainer>
            <NavLink id={RouteID.About}>About Only</NavLink>
          </LinkContainer>
          <LinkContainer>
            <NavLink id={RouteID.AboutMe}>About Me</NavLink>
          </LinkContainer>
          <LinkContainer>
            <NavLink id={RouteID.AboutMyWorks}>About My Works</NavLink>
          </LinkContainer>
        </LinkList>
      </LinkListContainer>

      <LinkListContainer style={{gridColumn: 2, gridRow: 2}}>
        <LinkListTitle>Nav links in group</LinkListTitle>
        <LinkList>
          <LinkContainer>
            <NavLinkInGroup group={navLinkGroup} groupKey='homeGroupKey'>Home</NavLinkInGroup>
          </LinkContainer>
          <LinkContainer>
            <NavLinkInGroup group={navLinkGroup} groupKey='aboutGroupKey'>About Only</NavLinkInGroup>
          </LinkContainer>
          <LinkContainer>
            <NavLinkInGroup group={navLinkGroup} groupKey='aboutMeGroupKey'>About Me</NavLinkInGroup>
          </LinkContainer>
          <LinkContainer>
            <NavLinkInGroup group={navLinkGroup} groupKey='aboutMyWorksGroupKey'>About My Works</NavLinkInGroup>
          </LinkContainer>
        </LinkList>
      </LinkListContainer>

    </>
  )
}

export default Nav;
