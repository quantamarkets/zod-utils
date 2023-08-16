![zod-utils](./zod-utils.png)

This is a collection of utility methods that are handy when working with zod.

- [Getting started](#getting-started)
- [`zutils.incomplete()`](#zutilsincomplete)
- [`zutils.implement()`](#zutilsimplement)
- [`zutils.validate()`](#zutilsvalidate)
- [`zutils.check()`](#zutilscheck)


## Getting started

```
pnpm add zod-utils
```

In your code:

```
import { zutils } from 'zod-utils'zutils.
```


## `zutils.incomplete()`

Calling this function with a zod schema and a value to parse and it will spit out an object with `null` on any (nested) property that is not valid.


```
const result = zutils.incomplete({
  schema: z.object({
    foo: z.string(),
    bar: z.object({
      baz: z.object({
        buz: z.string(),
      }),
    }),
  }),
  defaultValue: null,
  value: {},
})

expect(result).toEqual({
  foo: null,
  bar: {
    baz: {
      buz: null,
    },
  },
});
```

See more examples in [incomplete.test.ts](./src/incomplete.test.ts)

When is this handy? **forms**!

TODO: Add an example

Also it's great for query parameters from a url. Using `incomplete` we can keep all the good (valid) query parameters and throw out the bad.

TODO: Add an example

## `zutils.implement()`

Use this function to make sure your zod schemas implement a given type definition.

```
zutils.implement<string>()(z.string())

// @ts-expect-error
zutils.implement<string>()(z.number())
```

## `zutils.validate()`

Use this to do a type assertion with your schema. Use it in an if statement to discriminate the type inside that scope.

```
const schema = z.string()
let val: any
if (zutils.validate(schema, val)) {
  return val // val is a string in in this scope
}
```

## `zutils.check()`

So `zutils.implement` makes sure that your schema *extends your type*. This command will make sure that a type *extends your schema*. 

Use case:

```
interface FOOBAR {
  foo?: 'bar'
}
const schema = zutils.implement<FOOBAR>()(
  z.object({
    foo: z.literal('bar') // NOTE: this isn't optional, yet no TS error
  })
)
zutils.check(schema, { foo: 'bar' } as FOOBAR) // TS error!
```

