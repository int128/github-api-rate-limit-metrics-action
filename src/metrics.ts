import { v1 } from '@datadog/datadog-api-client'
import { Endpoints } from '@octokit/types'

type RateLimitResources = Endpoints['GET /rate_limit']['response']['data']['resources']

export const calculateMetrics = (r: RateLimitResources, now: number, tags: string[]): v1.Series[] => {
  const series: v1.Series[] = []

  series.push(
    {
      host: 'github.com',
      tags: [...tags, 'resource:core'],
      metric: 'github.rate_limit.remaining',
      type: 'gauge',
      points: [[now, r.core.remaining]],
    },
    {
      host: 'github.com',
      tags: [...tags, 'resource:core'],
      metric: 'github.rate_limit.limit',
      type: 'gauge',
      points: [[now, r.core.limit]],
    },
    {
      host: 'github.com',
      tags: [...tags, 'resource:search'],
      metric: 'github.rate_limit.remaining',
      type: 'gauge',
      points: [[now, r.search.remaining]],
    },
    {
      host: 'github.com',
      tags: [...tags, 'resource:search'],
      metric: 'github.rate_limit.limit',
      type: 'gauge',
      points: [[now, r.search.limit]],
    }
  )

  if (r.graphql) {
    series.push(
      {
        host: 'github.com',
        tags: [...tags, 'resource:graphql'],
        metric: 'github.rate_limit.remaining',
        type: 'gauge',
        points: [[now, r.graphql.remaining]],
      },
      {
        host: 'github.com',
        tags: [...tags, 'resource:graphql'],
        metric: 'github.rate_limit.limit',
        type: 'gauge',
        points: [[now, r.graphql.limit]],
      }
    )
  }

  return series
}
