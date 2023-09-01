import z, { ZodArray, ZodObject, ZodTuple, ZodTypeAny, ZodUnion } from 'zod';

export function coerceAllDates(schema: ZodTypeAny): ZodTypeAny {
  switch (schema._def.typeName) {
    case 'ZodDate':
      return z.coerce.date();
    case 'ZodTuple':
      return z.tuple(
        (schema as ZodTuple).items.map((item: ZodTypeAny) =>
          coerceAllDates(item)
        ) as [ZodTypeAny, ...ZodTypeAny[]]
      );
    case 'ZodObject':
      return z.object(
        Object.entries((schema as ZodObject<any>).shape).reduce(
          (acc, [key, value]) => {
            acc[key] = coerceAllDates(value as ZodTypeAny);
            return acc;
          },
          {} as any
        )
      );
    case 'ZodUnion':
      // eslint-disable-next-line no-underscore-dangle
      return z.union(
        (schema as ZodUnion<any>).options.map((option: ZodTypeAny) =>
          coerceAllDates(option)
        )
      );
    case 'ZodOptional':
      // eslint-disable-next-line no-underscore-dangle
      return coerceAllDates(schema._def.innerType).optional();
    case 'ZodArray':
      return z.array(coerceAllDates((schema as ZodArray<any>).element));
  }
  return schema;
}
