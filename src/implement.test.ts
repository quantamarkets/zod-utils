import { z } from 'zod';
import { implement } from './implement';


describe('implement', () => {
  it('works', async () => {

    implement<string>()(z.string());

    // @ts-expect-error
    implement<string>()(z.number())

  });
});
