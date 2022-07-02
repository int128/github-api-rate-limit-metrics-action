import * as core from '@actions/core'
import * as github from '@actions/github'
import { calculateMetrics } from './metrics'
import { client, v1 } from '@datadog/datadog-api-client'

type Inputs = {
  githubToken: string
  datadogAPIKey?: string
  datadogTags: string[]
}

export const run = async (inputs: Inputs): Promise<void> => {
  const octokit = github.getOctokit(inputs.githubToken)
  const configuration = client.createConfiguration({ authMethods: { apiKeyAuth: inputs.datadogAPIKey } })
  const metrics = new v1.MetricsApi(configuration)

  const rateLimit = await octokit.rest.rateLimit.get()
  core.info(`Got rate limit: ${JSON.stringify(rateLimit, undefined, 2)}`)

  const tags = [
    `repository_owner:${github.context.repo.owner}`,
    `repository_name:${github.context.repo.repo}`,
    `workflow_name:${github.context.workflow}`,
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
