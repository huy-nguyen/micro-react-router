import {createContext, useContext, useMemo, useEffect, useState, useRef} from 'react';
import pathToRegexp, {
  Key as PathToRegexpKey,
} from 'path-to-regexp';
import {
  queryStringToSimpleObject, specialJSONStringify,
  simpleObjectToQueryString, retrieveNonNullableValueFromRecord
} from './Utils';

// A single route passed in by the user:
export interface Route<ID> {
  id: ID
  path: string
}
interface ComposeAnchorPropsInput {
  onClick?: React.MouseEventHandler
}

type RouteMatchResult<ID> = {
  success: false
} | {
  success: true,
  id: ID
  pathParams: Record<string, string>,
  queryParams: Record<string, string>
}

type LocationSubset = Pick<Location, 'pathname' | 'search' | 'hash'>;
const getLocationSubset = ({pathname, search, hash}: Location): LocationSubset => ({pathname, search, hash});

interface InternalRoute<ID> {
  id: ID
  path: string;

  // this performs the match with the `end` option set to `true`
  performStandardMatch(location: LocationSubset): RouteMatchResult<ID>

  // this performs the match with the `end` option set to `false`
  performRelaxedMatch(location: LocationSubset): RouteMatchResult<ID>

  // Given the data for the path params, convert the path match pattern to the full path:
  convertPathParamsToPath(pathParamsData: Record<string, string | undefined>): string
}

export interface LocationDescriptor<ID> {
  id: ID
  pathParams?: Record<string, string | undefined>
  queryParams?: Record<string, string | undefined>
}

export type NavLinkGroup<K extends string | number | symbol, ID> = Record<K, LocationDescriptor<ID>>

// Determine if a path matches a RegExp. If so, returns the
// path and query params:
function matchPathAgainstRegexp<ID> (
    id: ID,
    regexp: RegExp,
    path: string,
    searchString: string,
    keys: PathToRegexpKey[]
  ): RouteMatchResult<ID> {
  const matchResult = regexp.exec(path);
  if (matchResult === null) {
    return {success: false}
  } else {
    const pathParams: Record<string, string> = {};

    // If a match occurs, `matchResult` is an array whose (n+1)-th element
    // is the value of the n-th key.
    const numKeys = keys.length;
    for (let i = 0; i < numKeys; i += 1) {
      const key = keys[i].name;
      const value = matchResult[i + 1];
      pathParams[key] = value;
    }

    const queryParams = queryStringToSimpleObject(searchString);
    return {
      success: true,
      id, pathParams, queryParams,
    }
  }
}

function convertExternalRouteToInternalRoute<ID>(
      {id, path}: Route<ID>
    ): InternalRoute<ID> {

  const standardKeys: PathToRegexpKey[] = [];
  const standardRegexp = pathToRegexp(path, standardKeys, {end: true});

  const relaxedKeys: PathToRegexpKey[] = [];
  const relaxedRegexp = pathToRegexp(path, relaxedKeys, {end: false});

  const performStandardMatch = ({pathname, search}: LocationSubset) =>
    matchPathAgainstRegexp(id, standardRegexp, pathname, search, standardKeys);

  const performRelaxedMatch = ({pathname, search}: LocationSubset) =>
    matchPathAgainstRegexp(id, relaxedRegexp, pathname, search, relaxedKeys);

  const compile = pathToRegexp.compile(path);
  const convertPathParamsToPath = (pathParamsData: Record<string, string | undefined>) => {
    try {
      return compile(pathParamsData);
    } catch (e) {
      throw new Error(
        'Error while converting path parameters to full path. Check that the path pattern for route ID ' +
        id + ' match the provided data for its parameters: ' + e
      );
    }
  }

  return {
    id, path,
    performStandardMatch, performRelaxedMatch,
    convertPathParamsToPath,
  }
}

function assertNever(_value: never, errorMessage = 'This code path should be unreacheable'): never {
  throw new Error(errorMessage)
}

enum MatchStrategy {
  Standard,
  Relaxed,
}

function matchAgainstSingleRoute<ID>
  (route: InternalRoute<ID>, location: LocationSubset, matchStrategy: MatchStrategy): RouteMatchResult<ID> {

  let result: RouteMatchResult<ID>
  if (matchStrategy === MatchStrategy.Standard) {
    result = route.performStandardMatch(location);
  } else if (matchStrategy === MatchStrategy.Relaxed) {
    result = route.performRelaxedMatch(location);
  } else {
    throw assertNever(matchStrategy);
  }
  return result;
}

function matchAgainstMultipleRoutes<ID>
  (routes: InternalRoute<ID>[], location: LocationSubset, matchStrategy: MatchStrategy): RouteMatchResult<ID> {

  for (const route of routes) {
    const result = matchAgainstSingleRoute(route, location, matchStrategy);
    if (result.success === true) {
      const {id, pathParams, queryParams} = result;
      return {
        success: true,
        id, pathParams, queryParams,
      }
    }
  }
  return {success: false}
}

function usePrevious<T>(value: T) {
  const ref = useRef<T | undefined>(undefined)
  useEffect(() => {
    ref.current = value;
  })
  return ref.current;
}

function getHooks<ID>(routes: Route<ID>[]) {

  // Pre-process routes for use later:
  const internalRoutesList: InternalRoute<ID>[] = [];
  const internalRoutesMap = new Map<ID, InternalRoute<ID>>();
  for (const externalRoute of routes) {
    const internalRoute = convertExternalRouteToInternalRoute(externalRoute);
    internalRoutesList.push(internalRoute);
    internalRoutesMap.set(internalRoute.id, internalRoute);
  }

  const historyContext = createContext<History>(history);

  const useHistory = () => useContext(historyContext);

  const useLocation = () => {
    const history = useHistory();

    const [locationSubset, setLocationSubset] = useState<LocationSubset>(getLocationSubset(location));
    const previousLocationSubset = usePrevious({...locationSubset});

    useEffect(() => {
      const handlePopState = () => {
        const nextLocationSubset = getLocationSubset(location);
        const stringifiedPreviousLocationSubset = (previousLocationSubset === undefined) ? undefined : specialJSONStringify(previousLocationSubset);
        const stringifiedNextLocationSubset = specialJSONStringify(nextLocationSubset);
        if (stringifiedPreviousLocationSubset !== stringifiedNextLocationSubset) {
          setLocationSubset({...nextLocationSubset});
        }
      }
      window.addEventListener('popstate', handlePopState);

      return () => window.removeEventListener('popstate', handlePopState);
    }, [history])

    return locationSubset;
  }

  const triggerPopState = () => {
    const popStateEvent = new PopStateEvent('popstate');
    window.dispatchEvent(popStateEvent);
  }

  const useNavigationByString = () => {
    const localHistory = useHistory();
    return {
      push: (input: string) => {
        localHistory.pushState(null, '', input);
        triggerPopState();
      },
      replace: (input: string) => {
        localHistory.replaceState(null, '', input)
        triggerPopState();
      },
    }
  }

  const usePushStateByString = () => useNavigationByString().push;
  const useReplaceStateByString = () => useNavigationByString().replace;

  const useNavigationByDescriptor = () => {
    const {pushState, replaceState} = useHistory();

    const getHref = ({id, pathParams = {}, queryParams = {}}: LocationDescriptor<ID>) => {
      const internalRoute = internalRoutesMap.get(id);
      if (internalRoute === undefined) {
        throw new Error('Cannot find routing information for route ID ' + id);
      }
      const {convertPathParamsToPath} = internalRoute;
      const pathname = convertPathParamsToPath(pathParams);
      const searchString = simpleObjectToQueryString(queryParams);
      return pathname + searchString;
    }

    return {
      push: (input: LocationDescriptor<ID>) => {
        pushState(null, '', getHref(input))
        triggerPopState();
      },
      replace: (input: LocationDescriptor<ID>) => {
        replaceState(null, '', getHref(input))
        triggerPopState();
      },
    }
  }

  const usePushStateByDescriptor = () => useNavigationByDescriptor().push;
  const useReplaceStateByDescriptor = () => useNavigationByDescriptor().replace;

  const useQueryParams = () => {
    const {search} = useLocation();
    return queryStringToSimpleObject(search);
  }

  const useMatchedRoute = () => {
    const {pathname, search, hash} = useLocation();
    const matchResult = useMemo(() => {
      const result = matchAgainstMultipleRoutes(internalRoutesList, {pathname, search, hash}, MatchStrategy.Standard);
      return result;
    }, [specialJSONStringify({pathname, search})])
    return matchResult;
  }

  const useLinkInternal = ({id, pathParams, queryParams}: Required<LocationDescriptor<ID>>) => {
    const internalRoute = internalRoutesMap.get(id);
    if (internalRoute === undefined) {
      throw new Error('Cannot find routing information for route ID ' + id);
    }
    const stringifiedPathParams = specialJSONStringify(pathParams);
    const stringifiedQueryParams = specialJSONStringify(queryParams);

    const {push} = useNavigationByString();

    const matchedRoute = useMatchedRoute();

    let isActive: boolean;
    // First check if a route can be matched at all...
    if (matchedRoute.success === false) {
      isActive = false
    } else {
      // ... then check if the path pattern match ...
      const doesPathNameMatch = isActive = (matchedRoute.id === id);
      if (doesPathNameMatch === false) {
        isActive = false;
      } else {
        const {
          pathParams: matchedPathParams, queryParams: matchedQueryParams
        } = matchedRoute;
        // ... then check if path params (if provided) match ...
        let doesPathParamsMatch = true;
        for (const key in pathParams) {
          if (pathParams.hasOwnProperty(key)) {
            if (pathParams[key] !== matchedPathParams[key]) {
              doesPathParamsMatch = false;
              break;
            }
          }
        }
        if (doesPathParamsMatch === false) {
          isActive = false;
        } else {
          // ... finally check if query params (if provided) match ...
          let doesQueryParamsMatch = true;
          for (const key in queryParams) {
            if (queryParams.hasOwnProperty(key)) {
              if (queryParams[key] !== matchedQueryParams[key]) {
                doesQueryParamsMatch = false;
                break;
              }
            }
          }
          isActive = doesQueryParamsMatch;
        }
      }
    }

    const pathname = internalRoute.convertPathParamsToPath(pathParams);
    const queryString = simpleObjectToQueryString(queryParams);
    const href = pathname + queryString;

    const anchorProps = useMemo(() => {
      const onClick = (e: React.MouseEvent) => {
        e.preventDefault();
        push(href);
      }
      return { href, onClick, }
    }, [stringifiedPathParams, stringifiedQueryParams]);

    const composeAnchorProps = (input: ComposeAnchorPropsInput) => {
      const {onClick: customOnClick, ...rest} = input;
      const onClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (customOnClick !== undefined) {
          customOnClick(e);
        }
        push(href);
      }

      return { ...rest, href, onClick,}
    }

    return { anchorProps, isActive, composeAnchorProps};
  }

  const useLink = ({id, pathParams = {}, queryParams = {}}: LocationDescriptor<ID>) =>
                    useLinkInternal({id, pathParams, queryParams}).anchorProps;

  const useCustomizedLink = (descriptor: LocationDescriptor<ID>, customAttributes: ComposeAnchorPropsInput) => {
    const {id, pathParams = {}, queryParams = {}} = descriptor;
    const {composeAnchorProps} = useLinkInternal({id, pathParams, queryParams});
    return composeAnchorProps(customAttributes);
  }

  const useNavLink = ({id, pathParams = {}, queryParams = {}, }: LocationDescriptor<ID>) => {
    const {anchorProps, isActive} = useLinkInternal({id, pathParams, queryParams});
    return [anchorProps, isActive] as const;
  }

  const useCustomizedNavLink = (descriptor: LocationDescriptor<ID>, customAttributes: ComposeAnchorPropsInput) => {
    const {id, pathParams = {}, queryParams = {}} = descriptor;
    const {composeAnchorProps, isActive} = useLinkInternal({id, pathParams, queryParams});
    const anchorProps = composeAnchorProps(customAttributes);
    return [anchorProps, isActive] as const;
  }

  function useNavLinkGroup<K extends string | number | symbol>(navLinkGroup: NavLinkGroup<K, ID>) {
    type GroupKey = keyof typeof navLinkGroup;

    const location = useLocation();

    const routeIDsInGroup = new Set<ID>();
    for (const key in navLinkGroup) {
      if (navLinkGroup.hasOwnProperty(key)) {
        const {id} = retrieveNonNullableValueFromRecord(navLinkGroup, key, 'provided nav link group');
        routeIDsInGroup.add(id);
      }
    }
    const internalRoutesInGroup = internalRoutesList.filter(({id}) => routeIDsInGroup.has(id));

    type LocalMatchResult = {success: true, id: ID} | {success: false};
    let localMatchResult: LocalMatchResult;
    const standardMatchResult = matchAgainstMultipleRoutes(internalRoutesInGroup, location, MatchStrategy.Standard,)
    if (standardMatchResult.success === true) {
      localMatchResult = {success: true, id: standardMatchResult.id}
    } else {
      const relaxedMatchResult = matchAgainstMultipleRoutes(internalRoutesInGroup, location, MatchStrategy.Relaxed);
      if (relaxedMatchResult.success === true) {
        localMatchResult = {success: true, id: relaxedMatchResult.id}
      } else {
        localMatchResult = {success: false}
      }
    }
    const getProps = (key: GroupKey) => {
      const {
        id, pathParams = {}, queryParams = {}
      } = retrieveNonNullableValueFromRecord(navLinkGroup, key, 'provided nav link group');
      const {anchorProps} = useLinkInternal({id, pathParams, queryParams});
      const isActive = (localMatchResult.success === true && localMatchResult.id === id);

      return [anchorProps, isActive]
    }

    return getProps;
  }

  return {
    useMatchedRoute,
    useQueryParams,

    usePushStateByDescriptor,
    usePushStateByString,
    useReplaceStateByString,
    useReplaceStateByDescriptor,

    useLink,
    useNavLink,
    useCustomizedLink,
    useCustomizedNavLink,
    useNavLinkGroup,
    useLinkInternal,

    __internalRoutesMap: internalRoutesMap,
  }
}

export default getHooks
