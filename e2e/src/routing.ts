import getHooks, {Route} from 'micro-react-router';

export enum RouteID {
  AboutMyWorks = 'about-my-works',
  AboutMe = 'about-me',
  About = 'about-root',
  Topics = 'topics',
  Home = 'home',
}

const routes: Route<RouteID>[] = [
  {id: RouteID.AboutMyWorks, path: '/about/me/works/:workName?'},
  {id: RouteID.AboutMe, path: '/about/me'},
  {id: RouteID.About, path: '/about'},
  {id: RouteID.Topics, path: '/topics/:topicName'},
  {id: RouteID.Home, path: '/'},
];

const {
  HistoryProvider, useMatchedRoute, useLink, useNavLink, useNavLinkGroup,
  useCustomizedLink,
} = getHooks(routes);

export {
  HistoryProvider, useMatchedRoute, useLink, useNavLink, useNavLinkGroup,
  useCustomizedLink,
}
