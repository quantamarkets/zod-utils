import { z } from 'zod';

export const implement =
  <T>() =>
  <S extends z.ZodType<T, any, any>>(schema: S) =>
    schema;
