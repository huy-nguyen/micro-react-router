
import getHooks from '../index'

const RouteID = {
  AboutMyWorks: 'about-my-works',
  AboutMe: 'about-me',
  About: 'about-root',
  Topics: 'topics',
  home: 'home',
}

const routes = [
  {id: RouteID.AboutMyWorks, path: '/about/me/works/:workName?'},
  {id: RouteID.AboutMe, path: '/about/me'},
  {id: RouteID.About, path: '/about'},
  {id: RouteID.Topics, path: '/topics/:topicName'},
  {id: RouteID.Home, path: '/'},
];

const { __internalRoutesMap, } = getHooks(routes);


const topicsRoute = __internalRoutesMap.get(RouteID.Topics);
const aboutMyWorksRoute = __internalRoutesMap.get(RouteID.AboutMyWorks);
const aboutRoute = __internalRoutesMap.get(RouteID.About);

test('Should return empty string if no path params are provided', () => {
  expect(aboutMyWorksRoute.convertPathParamsToPath({})).toEqual('/about/me/works')
  expect(aboutRoute.convertPathParamsToPath({})).toEqual('/about')
})

test('Should insert path params if needed as specified in path pattern', () => {
  expect(topicsRoute.convertPathParamsToPath({topicName: 'VSCode'})).toEqual('/topics/VSCode')
  expect(aboutRoute.convertPathParamsToPath({topicName: 'VSCode'})).toEqual('/about')
})
