import { z } from 'zod';

export function check<S extends z.ZodTypeAny, V extends z.infer<S>>(
  schema: S,
  data: V
) {}
