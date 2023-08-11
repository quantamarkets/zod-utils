import { z } from 'zod'
import { server } from 'zod-sdk/server'

export const routes = {
  hello: server.makeQuery(
    async (date: Date) => ({
      hello: 'world',
      on: new Date(),
    }),
    {
      parameter: z.date(),
      payload: z.object({
        hello: z.string(),
        on: z.date(),
      }),
    }
  ),
}

export type IRoutes = typeof routes
