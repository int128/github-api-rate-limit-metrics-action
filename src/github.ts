import assert from 'node:assert'
import { Octokit } from '@octokit/action'
import { retry } from '@octokit/plugin-retry'

export const getOctokit = (token: string) =>
  new (Octokit.plugin(retry))({
    // Unset the strategy to use the given token.
    authStrategy: undefined,
    auth: token,
  })

export type Context = {
  repo: {
    owner: string
    repo: string
  }
  workflow: string
}

export const getContext = async (): Promise<Context> => {
  // https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/store-information-in-variables#default-environment-variables
  return {
    repo: getRepo(),
    workflow: getEnv('GITHUB_WORKFLOW'),
  }
}

const getRepo = () => {
  const [owner, repo] = getEnv('GITHUB_REPOSITORY').split('/')
  return { owner, repo }
}

const getEnv = (name: string): string => {
  assert(process.env[name], `${name} is required`)
  return process.env[name]
}
