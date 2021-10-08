import { Series } from '@datadog/datadog-api-client/dist/packages/datadog-api-client-v1/models/Series'
import { calculateMetrics } from '../src/metrics'

test('run successfully', () => {
  const now = Date.now() / 1000
  const series = calculateMetrics(
    {
      core: {
        limit: 5000,
        used: 1001,
        remaining: 3999,
        reset: 123456789,
      },
      search: {
        limit: 6000,
        used: 5001,
        remaining: 999,
        reset: 123456789,
      },
      graphql: {
        limit: 7000,
        used: 2001,
        remaining: 4999,
        reset: 123456789,
      },
    },
    now,
    []
  )
  expect(series).toStrictEqual<Series[]>([
    {
      host: 'github.com',
      tags: [],
      metric: 'github.rate_limit.core.remaining',
      type: 'gauge',
      points: [[now, 3999]],
    },
    {
      host: 'github.com',
      tags: [],
      metric: 'github.rate_limit.core.limit',
      type: 'gauge',
      points: [[now, 5000]],
    },
    {
      host: 'github.com',
      tags: [],
      metric: 'github.rate_limit.search.remaining',
      type: 'gauge',
      points: [[now, 999]],
    },
    {
      host: 'github.com',
      tags: [],
      metric: 'github.rate_limit.search.limit',
      type: 'gauge',
      points: [[now, 6000]],
    },
    {
      host: 'github.com',
      tags: [],
      metric: 'github.rate_limit.graphql.remaining',
      type: 'gauge',
      points: [[now, 4999]],
    },
    {
      host: 'github.com',
      tags: [],
      metric: 'github.rate_limit.graphql.limit',
      type: 'gauge',
      points: [[now, 7000]],
    },
  ])
})
