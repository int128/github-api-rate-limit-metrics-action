import * as core from '@actions/core'
import { run } from './run.js'

const main = async (): Promise<void> => {
  await run({
    githubToken: core.getInput('github-token', { required: true }),
    datadogAPIKey: core.getInput('datadog-api-key') || undefined,
    datadogTags: core.getMultilineInput('datadog-tags'),
  })
}

main().catch((e: Error) => {
  core.setFailed(e)
  console.error(e)
})
