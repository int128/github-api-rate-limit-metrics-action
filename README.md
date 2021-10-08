# github-api-rate-limit-metrics-action [![ts](https://github.com/int128/github-api-rate-limit-metrics-action/actions/workflows/ts.yaml/badge.svg)](https://github.com/int128/github-api-rate-limit-metrics-action/actions/workflows/ts.yaml)

This is an action to send the metrics of [GitHub API rate limit](https://docs.github.com/en/rest/reference/rate-limit) to Datadog.


## Getting Started

### Rate limit of `GITHUB_TOKEN`

```yaml
      - uses: int128/github-api-rate-limit-metrics-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          datadog-api-key: ${{ secrets.DATADOG_API_KEY }}
          datadog-tags: |
            repository:${{ github.repository }}
            github_token:GITHUB_TOKEN
```

### Rate limit of your personal access token

```yaml
      - uses: int128/github-api-rate-limit-metrics-action@v1
        with:
          github-token: ${{ secrets.YOUR_PAT }}
          datadog-api-key: ${{ secrets.DATADOG_API_KEY }}
          datadog-tags: |
            github_token:YOUR_PAT
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
            github_token:YOUR_APP
```


## Inputs

| Name | Type | Description
|------|------|------------
| `github-token` | required | GitHub token
| `datadog-api-key` | optional | Datadog API key
| `datadog-tags` | optional | Datadog tags in form of multiline of `KEY:VALUE`
