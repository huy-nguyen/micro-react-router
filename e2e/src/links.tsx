import React from 'react';
import { useLink, RouteID, useNavLink, useNavLinkGroup, useCustomizedLink} from './routing';
import {
  LocationDescriptor, NavLinkGroup
} from 'micro-react-router';
import styled from 'styled-components';
const {customizedLinkTestTargetID} = require('./dataTestIDs');


const linkColor = '#007bff';
const linkFadedColor = '#0056b3';

const BaseLink = styled.a`
  display: block;
  padding: 0.5rem 1rem;
  text-decoration: none;
  border-radius: 0.25rem;
`

const InactiveLink = styled(BaseLink)`
  color: ${linkColor};

  &:visited {
    color: ${linkColor};
  }

  &:hover {
    color: ${linkFadedColor};
  }
`

const ActiveLink = styled(BaseLink)`
  color: white;
  background-color: ${linkColor};

  &:visited {
    color: white;
  }
`

interface SimpleLinkProps extends LocationDescriptor<RouteID> {
  // In real usage, `chlidren` can be any valid `React.ReactNode`.
  // Here we restrict `children` to string to ensure testing reliability:
  children: string
}
export const SimpleLink = ({children, ...rest}: SimpleLinkProps) => {
  const anchorProps = useLink(rest);

  return (
    <InactiveLink {...anchorProps}> Simple Link: {children} </InactiveLink>
  )
}

interface CustomizedLinkProps extends LocationDescriptor<RouteID> {
  // In real usage, `chlidren` can be any valid `React.ReactNode`.
  // Here we restrict `children` to string to ensure testing reliability:
  children: string
}
export const CustomizedLink = ({children, id, pathParams, queryParams}: CustomizedLinkProps) => {
  const customOnClickAction = () => {
    const target = document.querySelector(`[data-testid="${customizedLinkTestTargetID}"]`)
    if (target === null) {
      throw new Error('Test target for customized link cannot be found in the DOM');
    }
    target.textContent = id;
  }
  const anchorProps = useCustomizedLink(
    {id, pathParams, queryParams},
    {onClick: customOnClickAction}
  );
  return (
    <InactiveLink {...anchorProps}> Simple Customized Link: {children} </InactiveLink>
  )
}

interface NavLinkProps extends LocationDescriptor<RouteID> {
  // In real usage, `chlidren` can be any valid `React.ReactNode`.
  // Here we restrict `children` to string to ensure testing reliability:
  children: string
}

export const NavLink = ({children, ...rest}: NavLinkProps) => {
  const [anchorProps, isActive] = useNavLink(rest);

  const Component = isActive ? ActiveLink : InactiveLink;

  const labelText = isActive ? 'Nav Link: Active:' : 'Nav Link: Inactive:';

  return (
    <Component {...anchorProps}> {labelText} {children} </Component>
  )
}

interface NavLinkInGroupProps<K extends string | number | symbol> {
  group: NavLinkGroup<K, RouteID>
  groupKey: K
  // In real usage, `chlidren` can be any valid `React.ReactNode`.
  // Here we restrict `children` to string to ensure testing reliability:
  children: string
}
export function NavLinkInGroup<K extends string | number | symbol>
  (props: NavLinkInGroupProps<K>) {

  const {groupKey, group, children} = props;

  const getProps = useNavLinkGroup(group);

  const [anchorProps, isActive] = getProps(groupKey);
  const Component = isActive ? ActiveLink : InactiveLink;
  const labelText = isActive ? 'Nav Link in Group: Active:' : 'Nav Link In Group: Inactive:';

  return (
    <Component {...anchorProps}>{labelText} {children}</Component>
  )
}
