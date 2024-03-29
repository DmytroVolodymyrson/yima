import { useRuntimeConfig } from '#imports'
import Typesense from 'typesense'

const config = useRuntimeConfig()

export const client = new Typesense.Client({
  nodes: [
    {
      host: 'kmj58vxcdg0bqe61p-1.a1.typesense.net',
      port: 443,
      protocol: 'https',
    },
  ],
  apiKey: config.public.typesenseApiKey,
  connectionTimeoutSeconds: 10,
  retryIntervalSeconds: 10,
})
