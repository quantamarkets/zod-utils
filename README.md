![zod-utils](./zod-utils.png)

This is a collection of utility methods that are handy when working with zod.

- [Getting started](#getting-started)
- [`zutils.incomplete()`](#zutilsincomplete)
  - [About forms](#about-forms)
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
const result = incomplete({
  schema: z.object({
    string: z.string(),
    nested1: z.object({
      nested2: z.object({
        string: z.string(),
        array: z.array(z.string()),
        enum: z.enum(['a', 'b', 'c']),
      }),
    }),
  }),
  defaultValue: null,
  value: null,
});

expect(result).toMatchInlineSnapshot(`
  {
    "nested1": {
      "nested2": {
        "array": [],
        "enum": null,
        "string": null,
      },
    },
    "string": null,
  }
`);
```

See more examples in [incomplete.test.ts](./src/incomplete.test.ts)

When is this handy? **forms**!

### About forms
Let's assume you're using a library like Formik. You want to provide it initial values for every input. With `incomplete()` you can take your schema for a **complete** form and generate values to use for a partially complete form.

Also it's great for query parameters from a url. Using `incomplete` we can keep all the good (valid) query parameters and throw out the bad.

For example, say you point to a page with your form and you supply some initial query parameters:

```
// At pathname /form?firstName=Morgan&lastName=25

const formSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
})

function Form() {

  const query = useQuery()
  const initialValues = zutils.incomplete({
    schema: formSchema,
    defaultValue: {
      firstName: '',
      lastName: '',
      email: '',
    },
    value: query
  })

  /**
  * lastName, which was a number in query parameters (and so, invalid),
  * is '' on the initialValues object, as is "email".
  */

  const [formValues, setFormValues] = setState(initialValues)
  function onChange(prop, value) {
    return setFormValues({
      ...formValues,
      [prop]: value
    })
  }

  function onClick() {
    if (zutils.validate(formSchema, formValues)) {
      // Submit to backend
    }
    // Else, alert the user
  }

  return (
    <form>
      <input value={formValues.firstName} onChange={onChange} />
      <input value={formValues.lastName} onChange={onChange} />
      <input value={formValues.email} onChange={onChange} />
      <button onClick={onClick}>
        Submit
      </button>
    </form>
  )
}


```

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

