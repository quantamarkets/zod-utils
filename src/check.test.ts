import { z } from 'zod';
import { implement } from './implement';
import { check } from './check';

describe('check', () => {
  it('works', async () => {
    interface FOOBAR {
      foo?: 'bar';
    }
    const schema = implement<FOOBAR>()(
      z.object({
        foo: z.literal('bar'),
      })
    );
    // @ts-expect-error
    check(schema, { foo: 'bar' } as FOOBAR);
  });
});
