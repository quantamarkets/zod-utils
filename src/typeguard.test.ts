import { z } from 'zod';
import { typeguard } from './typeguard';


describe('typeguard', () => {
  it('works', async () => {
    
    const a: any = 1;
    expect(typeguard(z.string(), a)).toBeFalsy()

    if (typeguard(z.string(), a)) {
      a.toUpperCase(); // See? No type error
    }
    
  });
});