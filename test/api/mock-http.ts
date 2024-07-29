export const queryHello = {
  body: JSON.stringify({
    query: 'query MyQuery { hello }',
    variables: null,
    operationName: 'MyQuery',
  }),
  path: '/graphql',
  httpMethod: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
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
