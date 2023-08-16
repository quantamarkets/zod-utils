import * as z from 'zod';

export declare type FormikErrors<Values> = {
  [K in keyof Values]?: Values[K] extends any[]
    ? Values[K][number] extends object
      ? FormikErrors<Values[K][number]>[] | string | string[]
      : string | string[]
    : Values[K] extends object
    ? FormikErrors<Values[K]>
    : string;
};

export function formik<T extends z.Schema<any>, V = z.infer<T>>(
  validationSchema: T,
  values: V,
  errorMap?: z.ZodErrorMap
): FormikErrors<V> {
  const result = validationSchema.safeParse(values, { errorMap });

  if (result.success) {
    return {};
  } else {
    return mapErrors<V>(result.error);
  }
}

export function mapErrors<V>(error: z.ZodError<V>) {
  const fieldErrors: FormikErrors<V> = {};
  const processError = (e: z.ZodError) => {
    for (const error of e.errors) {
      if (error.code === 'invalid_union') {
        error.unionErrors.map(processError);
      } else {
        const path = error.path.map((x) => x.toString());
        path.reduce((acc, key, i) => {
          if (i === path.length - 1) {
            const currentErrorAtPath = acc?.[key];
            acc[key] = currentErrorAtPath // if error already exists, append as new line
              ? `${error.message}\n${currentErrorAtPath}`
              : error.message;
          }
          return acc?.[key];
        }, fieldErrors as any) as string;
      }
    }
  };
  processError(error);
  return fieldErrors;
}
