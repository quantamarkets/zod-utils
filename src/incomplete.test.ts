import { z } from 'zod';
import { incomplete } from './incomplete';

describe('incomplete', () => {
  it('no default param, no object', async () => {
    const result = incomplete({
      schema: z.string(),
      value: undefined,
    });

    expect(result).toEqual(null);
  });
  it('no object, with default', async () => {
    const result = incomplete({
      schema: z.string(),
      defaultValue: '',
      value: undefined,
    });

    expect(result).toEqual('');
  });
  it('no default param', async () => {
    const result = incomplete({
      schema: z.object({
        foo: z.string(),
      }),
      value: {},
    })

    expect(result).toEqual({
      foo: null,
    });
  });
  it('no default param and nested objects', async () => {
    const result = incomplete({
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
  });

  it('with default', () => {
    const schema = z.object({
      str: z.string(),
      arr: z.array(z.string()),
      num: z.number(),
      obj: z.object({
        str: z.string(),
        arr: z.array(z.string()),
        num: z.number(),
        obj2: z.object({
          str: z.string(),
          arr: z.array(z.string()),
          num: z.number(),
        }),
      }),
    });
    const values = incomplete({
      schema, 
      defaultValue: {
        str: 'str',
        arr: ['arr'],
        num: 1,
        obj: {
          str: 'str',
          arr: ['arr'],
          num: 1,
          obj2: {
            str: 'str',
            arr: ['arr'],
            num: 1,
          },
        },
      },
      value: {}
    });

    expect(values).toMatchInlineSnapshot(`
      {
        "arr": [
          "arr",
        ],
        "num": 1,
        "obj": {
          "arr": [
            "arr",
          ],
          "num": 1,
          "obj2": {
            "arr": [
              "arr",
            ],
            "num": 1,
            "str": "str",
          },
          "str": "str",
        },
        "str": "str",
      }
    `);
  });

  it('with enums again', () => {
    const ZSchema = z.object({
      foo: z.union([z.string(), z.number()]),
      enum: z.enum(['a', 'b', 'c']),
      obj: z.object({
        a: z.string(),
        b: z.object({
          c: z.string(),
        }),
      }),
    });

    const values = incomplete({
      schema: ZSchema,
      defaultValue: {
        foo: 'foo',
        enum: 'a',
      },
      value: {},
    })

    expect(values).toMatchInlineSnapshot(`
      {
        "enum": "a",
        "foo": "foo",
        "obj": {
          "a": null,
          "b": {
            "c": null,
          },
        },
      }
    `);
  });

  it('with arrays', () => {
    const ZSchema = z.object({
      foo: z.array(
        z.object({
          a: z.string(),
          b: z.string(),
        })
      ),
    });

    const values = incomplete({
      schema: ZSchema,
      value: {
        foo: [
          {
            a: 'a',
          },
        ],
      }
    })

    expect(values).toMatchInlineSnapshot(`
      {
        "foo": [
          {
            "a": "a",
            "b": null,
          },
        ],
      }
    `);
  });
});
