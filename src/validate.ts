import { z } from 'zod';

export function validate<T, S extends z.ZodType<T, any, any>>(
  schema: S,
  data: any
): data is z.infer<S> {
  return schema.safeParse(data).success;
}
