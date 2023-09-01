import { z } from 'zod';

export type IOptional<T> = {
  [P in keyof T]: T[P] | undefined;
};

export type IOptionalSchemas<
  T extends any[],
  U extends any[] = [],
> = IOptional<T> extends T
  ? [...U, ...Partial<Required<T>>]
  : T extends [infer F, ...infer R]
  ? IOptionalSchemas<R, [...U, F]>
  : U;

export type IHandlePartialTuples<T extends any> = T extends any[]
  ? IOptionalSchemas<T>
  : T;

export function check<
  S extends z.ZodTypeAny,
  V extends IHandlePartialTuples<z.infer<S>>,
>(schema: S, data: V) {}
