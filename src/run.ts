import * as core from '@actions/core'
import { client, v1 } from '@datadog/datadog-api-client'
import type { Octokit } from '@octokit/action'
import type { Context } from './github.js'
import { calculateMetrics } from './metrics.js'

type Inputs = {
  datadogAPIKey?: string
  datadogTags: string[]
}

export const run = async (inputs: Inputs, octokit: Octokit, context: Context): Promise<void> => {
  const configuration = client.createConfiguration({ authMethods: { apiKeyAuth: inputs.datadogAPIKey } })
  const metrics = new v1.MetricsApi(configuration)

  const rateLimit = await octokit.rest.rateLimit.get()
  core.info(`Got rate limit: ${JSON.stringify(rateLimit, undefined, 2)}`)

  const tags = [
    `repository_owner:${context.repo.owner}`,
    `repository_name:${context.repo.repo}`,
    `workflow_name:${context.workflow}`,
    ...inputs.datadogTags,
  ]

  const now = Math.floor(rateLimit.headers.date ? Date.parse(rateLimit.headers.date) : Date.now()) / 1000

  const series = calculateMetrics(rateLimit.data.resources, now, tags)
  if (inputs.datadogAPIKey === undefined) {
    core.info(`dry-run: sending ${series.length} series to Datadog: ${JSON.stringify(series, undefined, 2)}`)
    return
  }

  await metrics.submitMetrics({ body: { series } })
  core.info(`Sent ${series.length} series to Datadog`)
}
