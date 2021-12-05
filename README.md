# github-api-rate-limit-metrics-action [![ts](https://github.com/int128/github-api-rate-limit-metrics-action/actions/workflows/ts.yaml/badge.svg)](https://github.com/int128/github-api-rate-limit-metrics-action/actions/workflows/ts.yaml)

This is an action to send the metrics of [GitHub API rate limit](https://docs.github.com/en/rest/reference/rate-limit) to Datadog.
If you have a large scale monorepo, you may need to monitor the rate limit to improve stability of CI/CD pipeline.


## Metrics

This action sends the following metrics:

- `github.rate_limit.remaining` (gauge)
- `github.rate_limit.limit` (gauge)

Each metric has the following tags:

- `resource` is either of values (see [docs](https://docs.github.com/en/rest/reference/rate-limit) for details)
  - `core`
  - `search`
  - `graphql`
- `repository_owner`
- `repository_name`
- `workflow_name`


## Getting Started

You can run this action frequently,
because GitHub does not count `/rate_limit` endpoint against your rate limit.

To run this action every 10 minutes,

```yaml
name: github-api-rate-limit-metrics

on:
  schedule:
    - cron: '*/10 * * * *'

  # provide easy way to test this action on a pull request
  pull_request:
    branches:
      - main
    paths:
      - .github/workflows/github-api-rate-limit-metrics.yaml

jobs:
  send:
    timeout-minutes: 10
    runs-on: ubuntu-latest
    steps:
      - uses: int128/github-api-rate-limit-metrics-action@v1
```

Here are some examples.

### Rate limit of `GITHUB_TOKEN`

```yaml
      - uses: int128/github-api-rate-limit-metrics-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          datadog-api-key: ${{ secrets.DATADOG_API_KEY }}
          datadog-tags: |
            github_token_name:GITHUB_TOKEN_${{ github.repository }}
```

### Rate limit of your personal access token

```yaml
      - uses: int128/github-api-rate-limit-metrics-action@v1
        with:
          github-token: ${{ secrets.YOUR_PAT }}
          datadog-api-key: ${{ secrets.DATADOG_API_KEY }}
          datadog-tags: |
            github_token_name:YOUR_PAT
```

### Rate limit of your GitHub App token

```yaml
      - uses: cybozu/octoken-action@v1
        id: octoken
        with:
          github_app_id: ${{ secrets.YOUR_APP_PRIVATE_KEY }}
          github_app_private_key: ${{ secrets.YOUR_APP_PRIVATE_KEY }}
      - uses: int128/github-api-rate-limit-metrics-action@v1
        with:
          github-token: ${{ steps.outputs.octoken.token }}
          datadog-api-key: ${{ secrets.DATADOG_API_KEY }}
          datadog-tags: |
            github_token_name:YOUR_APP
```


## Inputs

| Name | Default | Description
|------|------|------------
| `github-token` | (required) | GitHub token
| `datadog-api-key` | - | Datadog API key. If not set, do not send metrics actually
| `datadog-tags` | - | Datadog tags in form of multiline of `KEY:VALUE`
