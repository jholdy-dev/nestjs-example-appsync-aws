import { Directive } from '@nestjs/graphql';

export const aws_subscribe = (
  kind: 'queries' | 'mutations',
  queries: string[],
) =>
  Directive(
    `@aws_subscribe(${kind}: [${queries.map((query) => `"${query}"`).join(', ')}])`,
  );
