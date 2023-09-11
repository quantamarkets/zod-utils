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

export type IHandlePartialTuples<T extends any> = T extends Array<infer F>
  ? F[] extends T // Is it a non-tuple array?
    ? T
    : IOptionalSchemas<T>
  : T;

export function check<
  S extends z.ZodTypeAny,
  V extends IHandlePartialTuples<z.infer<S>>, // TODO: Remove this when this is merged: https://github.com/colinhacks/zod/pull/2708 and update zod peerDep
>(schema: S, data: V) {}
