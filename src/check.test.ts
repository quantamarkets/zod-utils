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

  it('handles optional fields', () => {
    type Props = {
      foo?: string;
    };

    const schema = implement<Props>()(
      z.object({
        foo: z.string().optional(),
      })
    );

    check(schema, {} as Props);
  });

  it('handles optional params', () => {
    function main(foo?: string) {
      return foo;
    }

    const schema = implement<Parameters<typeof main>>()(
      z.tuple([z.string().optional()])
    );

    check(schema, 'foo' as any as Parameters<typeof main>);
  });
});
