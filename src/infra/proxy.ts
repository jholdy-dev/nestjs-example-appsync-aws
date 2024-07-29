interface SelectionSet {
  [key: string]: SelectionSet | boolean;
}

interface QueryInfo {
  fieldName: string;
  selectionSetList: string[];
  selectionSetGraphQL: string;
  parentTypeName: string;
  variables: { [key: string]: any };
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

export function buildGraphQLQuery(info: QueryInfo): string {
  const { fieldName, selectionSetList, parentTypeName, variables } = info;
  const selectionSet = buildSelectionSet(selectionSetList);
  const selectionSetString = selectionSetToString(selectionSet);

  const hasVariables = Object.keys(variables).length > 0;
  const variablesStr = Object.entries(variables)
    .map(([key, value]) => `$${key}: ${typeof value}`)
    .join(', ');
  const variablesString = hasVariables ? `(${variablesStr})` : '';

  const argsStr = Object.entries(variables)
    .map(([key]) => `${key}: $${key}`)
    .join(', ');
  const argsString = hasVariables ? `(${argsStr})` : '';

  return `${parentTypeName.toLowerCase()} ${variablesString} {
  ${fieldName}${argsString} ${
    selectionSetString
      ? `{
    ${selectionSetString}
  }`
      : ''
  }
}`;
}
