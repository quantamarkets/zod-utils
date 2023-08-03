import { z } from 'zod'
        
type DeepNullable<T> =
  T extends Date
    ? Date | null
    : T extends Array<any>
      ? Array<DeepNullable<T[0]>>
      : T extends object
        ? {
          [K in keyof T]: DeepNullable<T[K]>
        }
        : T | null

type DeepUnparseDates<T> = 
  T extends Date
    ? Date | string
    : T extends Array<any>
      ? Array<DeepUnparseDates<T[0]>>
      : T extends object
        ? {
          [K in keyof T]: DeepUnparseDates<T[K]>
        }
        : T


/**
 * If U does not exist, we STILL want to replace T with DeepPartialNullable<T>
 */
type DeepReplaceOrNullable<T, U> =
  T extends Date
    ? U extends Date
      ? Date
      : Date | null
    : T extends Array<any>
      ? Array<DeepUnparseDates<T[0]>>
      : T extends object
        ? U extends object
          ? {
            [K in keyof T]: K extends keyof U
              ? DeepReplaceOrNullable<T[K], U[K]>
              : DeepNullable<T[K]>
          }
          : DeepNullable<T>
        : T extends string
          ? U extends string 
            ? T 
            : T | null
          : U extends undefined
            ? T | null
            : T


export const incomplete = <D, S extends z.ZodTypeAny>(props: {
  schema: S
  defaultValue?: D | null
  value: any
}) => {
  const {
    schema,
    defaultValue,
    value 
  } = props
  const incompletedSchema = incompleteZod(schema, defaultValue)
  return incompletedSchema.parse(value)
}

const incompleteZod = <D, S extends z.ZodTypeAny>(
  schema: S, 
  defaultValue?: D | null,
  keys: Array<string> = []
): z.ZodType<DeepReplaceOrNullable<z.infer<S>, D>> => {

  let zodDef = schema._def
  if (zodDef.typeName === z.ZodFirstPartyTypeKind.ZodEffects) {
    zodDef = zodDef.schema._def
  }

  const typeName: z.ZodFirstPartyTypeKind = zodDef.typeName
  switch (typeName) {
    case z.ZodFirstPartyTypeKind.ZodObject: {
      const shape = zodDef.shape()
      const properties: any = {}
      for (const key in shape) {
        const zodTypeAtKey = shape[key]
        const defaultValueAtKey = defaultValue ? (defaultValue as any)[key] : undefined
        properties[key] = incompleteZod(zodTypeAtKey, defaultValueAtKey, [...keys, key])
      }
      // @ts-ignore
      return z.any()
        .transform((v) => {
          try {
            return z.object(properties).parse(v || v)
          }
          catch (e) {
            return z.object(properties).parse({})
          }
        })
      
    }
    case z.ZodFirstPartyTypeKind.ZodArray: {  
      // @ts-ignore
      return z.any()
        .transform((v) => {
          try {
            if (schema._def.typeName === z.ZodFirstPartyTypeKind.ZodEffects) {
              v = schema._def.effect.transform(v)
            }
            return z.array(
              z.any()
                .transform((e) => {
                  return incompleteZod(zodDef.type).parse(e)
                })
            ).parse(v)
          }
          catch (e) {
            return defaultValue || []
          }
        })
    }
    case z.ZodFirstPartyTypeKind.ZodBoolean:
      return z.any()
        .transform((v) => {
          const result = schema.safeParse(v)
          if (result.success) {
            return result.data
          }
          return false
        })
    case z.ZodFirstPartyTypeKind.ZodDefault:
    case z.ZodFirstPartyTypeKind.ZodOptional:
    case z.ZodFirstPartyTypeKind.ZodNullable:
    case z.ZodFirstPartyTypeKind.ZodEnum:
    case z.ZodFirstPartyTypeKind.ZodLiteral:
    case z.ZodFirstPartyTypeKind.ZodUnion:
    case z.ZodFirstPartyTypeKind.ZodTuple:
    case z.ZodFirstPartyTypeKind.ZodBigInt:
    case z.ZodFirstPartyTypeKind.ZodString:
    case z.ZodFirstPartyTypeKind.ZodNumber:
    case z.ZodFirstPartyTypeKind.ZodDate:
    default: {
      return z.any()
        .transform((v) => {
          const result = schema.safeParse(v)
          if (result.success) {
            return result.data
          }
          return typeof defaultValue === 'undefined' ? null : defaultValue
        })
    }
  }
}

