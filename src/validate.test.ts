import { z } from 'zod';
import { validate } from './validate';


describe('validate', () => {
  it('works', async () => {
    
    const a: any = 1;
    expect(validate(z.string(), a)).toBeFalsy()

    if (validate(z.string(), a)) {
      a.toUpperCase(); // See? No type error
    }
    
  });
});