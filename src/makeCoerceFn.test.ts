import { z } from 'zod';
import { makeCoerceFn } from './makeCoerceFn';

describe('coerce', () => {
  it('no default param, no object', async () => {
    const result = makeCoerceFn(z.string())(undefined);

    expect(result).toEqual(null);
  });
  it('no object, with default', async () => {
    const result = makeCoerceFn(z.string(), '')(undefined);

    expect(result).toEqual('');
  });
  it('no default param', async () => {
    const result = makeCoerceFn(
      z.object({
        foo: z.string(),
      })
    )({});

    expect(result).toEqual({
      foo: null,
    });
  });
  it('no default param and nested objects', async () => {
    const result = makeCoerceFn(
      z.object({
        foo: z.string(),
        bar: z.object({
          baz: z.object({
            buz: z.string(),
          }),
        }),
      }),
      null
    )({});

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
    const values = makeCoerceFn(schema, {
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
    })({});

    expect(values).toMatchInlineSnapshot(`
      Object {
        "arr": Array [
          "arr",
        ],
        "num": 1,
        "obj": Object {
          "arr": Array [
            "arr",
          ],
          "num": 1,
          "obj2": Object {
            "arr": Array [
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

    const values = makeCoerceFn(ZSchema, {
      foo: 'foo',
      enum: 'a',
    })('');

    expect(values).toMatchInlineSnapshot(`
      Object {
        "enum": "a",
        "foo": "foo",
        "obj": Object {
          "a": null,
          "b": Object {
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

    const values = makeCoerceFn(ZSchema)({
      foo: [
        {
          a: 'a',
        },
      ],
    });

    expect(values).toMatchInlineSnapshot(`
      Object {
        "foo": Array [
          Object {
            "a": "a",
            "b": null,
          },
        ],
      }
    `);
  });
});
