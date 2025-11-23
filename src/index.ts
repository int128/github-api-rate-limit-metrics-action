import * as core from '@actions/core'
import * as github from './github.js'
import { run } from './run.js'

const main = async (): Promise<void> => {
  await run(
    {
      datadogAPIKey: core.getInput('datadog-api-key') || undefined,
      datadogTags: core.getMultilineInput('datadog-tags'),
    },
    github.getOctokit(core.getInput('github-token', { required: true })),
    await github.getContext(),
  )
}

try {
  await main()
} catch (e) {
  core.setFailed(e instanceof Error ? e : String(e))
  console.error(e)
}
