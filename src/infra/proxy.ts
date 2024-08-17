import { AppSyncResolverEvent } from 'aws-lambda';

interface SelectionSet {
  [key: string]: SelectionSet | boolean;
}

type Vars = { [key: string]: any };

interface QueryInfo {
  fieldName: string;
  selectionSetList: string[];
  selectionSetGraphQL: string;
  parentTypeName: string;
  variables: Vars;
}

function buildSelectionSet(selectionSetList: string[]): SelectionSet {
  const selectionSet: SelectionSet = {};

  selectionSetList.forEach((path) => {
    const parts = path.split('/');
    let currentLevel = selectionSet;

    parts.forEach((part, index) => {
      if (!currentLevel[part]) {
        currentLevel[part] = index === parts.length - 1 ? true : {};
      }
      currentLevel = currentLevel[part] as SelectionSet;
    });
  });

  return selectionSet;
}

function selectionSetToString(selectionSet: SelectionSet): string {
  const recurse = (obj: SelectionSet): string => {
    return Object.entries(obj)
      .map(([key, value]) => {
        if (value === true) {
          return key;
        } else {
          return `${key} {\n${recurse(value as SelectionSet).replace(/^/gm, '  ')}\n}`;
        }
      })
      .join('\n');
  };
  return recurse(selectionSet);
}

export function buildGraphQLQuery(info: QueryInfo, args: Vars): string {
  const { fieldName, selectionSetList, parentTypeName, variables: vars } = info;

  let variables = {};

  if (Object.keys(vars).length > 0) {
    variables = vars;
  } else {
    const hasArguments = Object.keys(args).length > 0;

    if (hasArguments) {
      variables = args;
    }
  }

  const selectionSet = buildSelectionSet(selectionSetList);
  const selectionSetString = selectionSetToString(selectionSet);
  const hasVariables = Object.keys(variables).length > 0;

  const argsStr = Object.entries(variables)
    .map(([key, value]) => `${key}: "${value}"`)
    .join(', ');
  const argsString = hasVariables ? `(${argsStr})` : '';

  return `${parentTypeName.toLowerCase()}  {
  ${fieldName}${argsString} ${
    selectionSetString
      ? `{
    ${selectionSetString}
  }`
      : ''
  }
}`;
}

export function getEventHttp<T = any>(
  appSyncResolverEvent: AppSyncResolverEvent<T>,
) {
  const query = buildGraphQLQuery(
    appSyncResolverEvent.info,
    appSyncResolverEvent.arguments,
  );

  return {
    body: JSON.stringify({
      query,
      variables:
        (appSyncResolverEvent?.info?.variables ||
          appSyncResolverEvent.arguments) ??
        {},
      operationName: null,
    }),
    path: '/graphql',
    httpMethod: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...appSyncResolverEvent.request.headers,
    },
    multiValueHeaders: {
      Accept: ['application/json'],
      'Content-Type': ['application/json'],
    },
    requestContext: {
      path: '/graphql',
      resourcePath: '/{proxy+}',
      httpMethod: 'POST',
    },
  };
}
