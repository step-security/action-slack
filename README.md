[![StepSecurity Maintained Action](https://raw.githubusercontent.com/step-security/maintained-actions-assets/main/assets/maintained-action-banner.png)](https://docs.stepsecurity.io/actions/stepsecurity-maintained-actions)

# action-slack

You can notify Slack of GitHub Actions results.

## Permissions

This action only performs read operations. Set the minimum required permissions in your workflow:

```yaml
permissions:
  actions: read   # to list workflow jobs
  contents: read  # to fetch commit metadata
```

## Quick Start

```yaml
steps:
  - uses: step-security/action-slack@v3
    with:
      status: ${{ job.status }}
      fields: repo,message,commit,author,action,eventName,ref,workflow # selectable (default: repo,commit)
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
    if: always() # Pick up events even if the job fails or is canceled.
```

## Usage

```yaml
steps:
  - uses: step-security/action-slack@v3
    with:
      status: ${{ job.status }}
      author_name: Integration Test # default: step-security@action-slack
      fields: repo,commit,message,author # default: repo,commit
      mention: here
      if_mention: failure,cancelled
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
    if: always() # Pick up events even if the job fails or is canceled.
```

## Parameters

| Key | Value | Default |
| --- | --- | --- |
| [status](#status) | `'success'` or `'failure'` or `'cancelled'` or `'custom'` | `''` |
| [fields](#fields) | You can choose the items you want to add to the fields at the time of notification. | `'repo,commit'` |
| [text](#text) | Specify the text you want to add. All strings will be overwritten. | `''` |
| [author_name](#author_name) | It can be overwritten by specifying. The job name is recommended. | `'step-security@action-slack'` |
| [mention](#mention) | `'here'` or `'channel'` or [user_group_id](https://api.slack.com/reference/surfaces/formatting#mentioning-groups) or [user_id](https://api.slack.com/reference/surfaces/formatting#mentioning-users) | `''` |
| [if_mention](#mention) | Specify `'success'` or `'failure'` or `'cancelled'` or `'custom'` or `'always'`. | `''` |
| [username](#username) | Override the legacy integration's default name. | `''` |
| [icon_emoji](#icon_emoji) | [emoji code](https://www.webfx.com/tools/emoji-cheat-sheet/) string to use in place of the default icon. | `''` |
| [icon_url](#icon_url) | icon image URL string to use in place of the default icon. | `''` |
| [channel](#channel) | Override the legacy integration's default channel. This should be an ID, such as `C8UJ12P4P`. | `''` |
| [custom_payload](#custom_payload) | e.g. `{"text": "Custom Field Check", obj: 'LOWER CASE'.toLowerCase()}` | `''` |
| [job_name](#job_name) | If you want to overwrite the job name, you must specify it. | `''` |

### status

Recommend `${{ job.status }}`.

```yaml
steps:
  - uses: step-security/action-slack@v3
    with:
      status: ${{ job.status }}
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

### text

```yaml
steps:
  - uses: step-security/action-slack@v3
    with:
      text: 'any string'
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

### author_name

```yaml
steps:
  - uses: step-security/action-slack@v3
    with:
      author_name: 'my workflow'
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

### mention

This can be mentioned in combination with `if_mention`.

```yaml
steps:
  - uses: step-security/action-slack@v3
    with:
      mention: 'here'
      if_mention: failure
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

If you want to mention multiple users in multiple cases:

```yaml
steps:
  - uses: step-security/action-slack@v3
    with:
      mention: 'user_id,user_id2'
      if_mention: 'failure,cancelled'
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

If you want to mention a user group, prefix the user group id with `subteam^`:

```yaml
steps:
  - uses: step-security/action-slack@v3
    with:
      mention: 'subteam^S012ABC3Y4Z' # replace S012ABC3Y4Z with your user group id
      if_mention: 'failure,cancelled'
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

### username

Only legacy incoming webhook supported.

```yaml
steps:
  - uses: step-security/action-slack@v3
    with:
      username: 'my workflow bot'
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

### icon_emoji

Only legacy incoming webhook supported.

```yaml
steps:
  - uses: step-security/action-slack@v3
    with:
      icon_emoji: ':octocat:'
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

### icon_url

Only legacy incoming webhook supported.

```yaml
steps:
  - uses: step-security/action-slack@v3
    with:
      icon_url: 'http://example.com/hoge.png'
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

### channel

Only legacy incoming webhook supported.

```yaml
steps:
  - uses: step-security/action-slack@v3
    with:
      channel: '#general'
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

### custom_payload

```yaml
steps:
  - uses: step-security/action-slack@v3
    with:
      status: custom
      custom_payload: |
        {
          text: "Custom Field Check",
          attachments: [{
            "author_name": "step-security@action-slack", // json
            fallback: 'fallback',
            color: 'good',
            title: 'CI Result',
            text: 'Succeeded',
            fields: [{
              title: 'lower case',
              value: 'LOWER CASE CHECK'.toLowerCase(),
              short: true
            },
            {
              title: 'reverse',
              value: 'gnirts esrever'.split('').reverse().join(''),
              short: true
            },
            {
              title: 'long title1',
              value: 'long value1',
              short: false
            }],
            actions: [{
            }]
          }]
        }
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

See the Slack docs for `custom_payload` reference:
- [Message Formatting](https://api.slack.com/docs/messages/builder)
- [Reference: Message payloads](https://api.slack.com/reference/messaging/payload)

### job_name

In action-slack, job information is retrieved from the job name. If you overwrite the job name, use `job_name` to match it.

```yaml
jobs:
  test:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - uses: step-security/action-slack@v3
        with:
          job_name: Test # Match the name above.
          fields: job,took
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

## Fields

> **Note:** Additional configuration is required to work with matrix builds. Don't forget to add `MATRIX_CONTEXT`. Not required if the fields do not contain `job` or `took`.

```yaml
steps:
  - uses: step-security/action-slack@v3
    with:
      fields: job,took
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
      MATRIX_CONTEXT: ${{ toJson(matrix) }} # required
```

If you have more than one, enter them in CSV format. Available fields:

<img width="495" alt="success" src="https://user-images.githubusercontent.com/8043276/84587112-64844800-ae57-11ea-8007-7ce83a91dae3.png" />

| Field | Environment Variable | Description |
| --- | --- | --- |
| repo | `AS_REPO` | A working repository name |
| commit | `AS_COMMIT` | commit hash |
| eventName | `AS_EVENT_NAME` | trigger event name |
| ref | `AS_REF` | git reference |
| workflow | `AS_WORKFLOW` | Generate a workflow link from git sha |
| workflowRun | `AS_WORKFLOW_RUN` | Generate a link to the present workflow run |
| message | `AS_MESSAGE` | commit message |
| author | `AS_AUTHOR` | The author who pushed |
| job | `AS_JOB` | Generate a job run link of the job that was executed |
| took | `AS_TOOK` | Execution time for the job |
| pullRequest | `AS_PULL_REQUEST` | Pull Request title, number with link |

```yaml
steps:
  - uses: step-security/action-slack@v3
    with:
      fields: repo,commit
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

To include all fields, specify `all`:

```yaml
steps:
  - uses: step-security/action-slack@v3
    with:
      fields: all
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

### Matrix builds with `include`

In either of the following cases, use the `job_name` parameter instead of `MATRIX_CONTEXT`:

1. Job name overwritten by the `name` syntax
2. Using `matrix` with `include`

```yaml
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [macos-latest, windows-latest, ubuntu-18.04]
        node: [8, 10, 12, 14]
        include:
          - os: windows-latest
            node: 8
            npm: 6

    steps:
      - uses: step-security/action-slack@v3
        with:
          job_name: test (${{ matrix.os }}, ${{ matrix.node }}) # named without `npm`
          fields: job,took
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

## Use Cases

### General use case

Notify Slack of the results of a single job run.

```yaml
steps:
  - uses: step-security/action-slack@v3
    with:
      status: ${{ job.status }}
      fields: repo,message,commit,author,action,eventName,ref,workflow,job,took,pullRequest
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
    if: always() # Pick up events even if the job fails or is canceled.
```

`status: ${{ job.status }}` passes the job outcome (success, failure, cancelled) to action-slack.
`if: always()` ensures action-slack runs even when the job fails.

### Custom use case

For notifications in a format other than the default, use `status: custom`.

```yaml
steps:
  - uses: step-security/action-slack@v3
    with:
      status: custom
      custom_payload: |
        {
          text: "Custom Field Check",
          attachments: [{
            "author_name": "step-security@action-slack", // json
            fallback: 'fallback',
            color: 'good',
            title: 'CI Result',
            text: 'Succeeded',
            fields: [{
              title: 'lower case',
              value: 'LOWER CASE CHECK'.toLowerCase(),
              short: true
            },
            {
              title: 'reverse',
              value: 'gnirts esrever'.split('').reverse().join(''),
              short: true
            },
            {
              title: 'long title1',
              value: 'long value1',
              short: false
            }],
            actions: [{
            }]
          }]
        }
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
```

JavaScript expressions are available inside `custom_payload` (e.g. `toLowerCase()`). You can also combine `custom_payload` with `fields` to access field values via environment variables:

```yaml
steps:
  - uses: step-security/action-slack@v3
    with:
      status: custom
      fields: workflow,job,commit,repo,ref,author,took
      custom_payload: |
        {
          attachments: [{
            color: '${{ job.status }}' === 'success' ? 'good' : '${{ job.status }}' === 'failure' ? 'danger' : 'warning',
            text: `${process.env.AS_WORKFLOW}\n${process.env.AS_JOB} (${process.env.AS_COMMIT}) of ${process.env.AS_REPO}@${process.env.AS_REF} by ${process.env.AS_AUTHOR} ${{ job.status }} in ${process.env.AS_TOOK}`,
          }]
        }
    env:
      SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
    if: always() # Pick up events even if the job fails or is canceled.
```

## License

MIT — see [LICENSE](LICENSE).
