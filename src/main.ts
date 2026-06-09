import * as fs from 'fs';
import * as core from '@actions/core';
import { Client, Success, Failure, Cancelled, Custom } from './client';
import axios, { isAxiosError } from 'axios';

async function validateSubscription(): Promise<void> {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  let repoPrivate: boolean | undefined;

  if (eventPath && fs.existsSync(eventPath)) {
    const eventData = JSON.parse(fs.readFileSync(eventPath, 'utf8'));
    repoPrivate = eventData?.repository?.private;
  }

  const upstream = '8398a7/action-slack';
  const action = process.env.GITHUB_ACTION_REPOSITORY;
  const docsUrl =
    'https://docs.stepsecurity.io/actions/stepsecurity-maintained-actions';

  core.info('');
  core.info('\u001b[1;36mStepSecurity Maintained Action\u001b[0m');
  core.info(`Secure drop-in replacement for ${upstream}`);
  if (repoPrivate === false)
    core.info('\u001b[32m\u2713 Free for public repositories\u001b[0m');
  core.info(`\u001b[36mLearn more:\u001b[0m ${docsUrl}`);
  core.info('');

  if (repoPrivate === false) return;

  const serverUrl = process.env.GITHUB_SERVER_URL || 'https://github.com';
  const body: Record<string, string> = { action: action || '' };
  if (serverUrl !== 'https://github.com') body.ghes_server = serverUrl;
  try {
    await axios.post(
      `https://agent.api.stepsecurity.io/v1/github/${process.env.GITHUB_REPOSITORY}/actions/maintained-actions-subscription`,
      body,
      { timeout: 3000 },
    );
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 403) {
      core.error(
        `\u001b[1;31mThis action requires a StepSecurity subscription for private repositories.\u001b[0m`,
      );
      core.error(
        `\u001b[31mLearn how to enable a subscription: ${docsUrl}\u001b[0m`,
      );
      process.exit(1);
    }
    core.info('Timeout or API not reachable. Continuing to next step.');
  }
}

async function run(): Promise<void> {
  await validateSubscription();
  try {
    const status = core.getInput('status', { required: true }).toLowerCase();
    const mention = core.getInput('mention');
    const author_name = core.getInput('author_name');
    const if_mention = core.getInput('if_mention').toLowerCase();
    const text = core.getInput('text');
    const username = core.getInput('username');
    const icon_emoji = core.getInput('icon_emoji');
    const icon_url = core.getInput('icon_url');
    const channel = core.getInput('channel');
    const custom_payload = core.getInput('custom_payload');
    const payload = core.getInput('payload');
    const fields = core.getInput('fields');
    const job_name = core.getInput('job_name');
    const success_message = core.getInput('success_message');
    const cancelled_message = core.getInput('cancelled_message');
    const failure_message = core.getInput('failure_message');
    const github_token = core.getInput('github_token');
    const github_base_url = core.getInput('github_base_url');

    core.debug(`status: ${status}`);
    core.debug(`mention: ${mention}`);
    core.debug(`author_name: ${author_name}`);
    core.debug(`if_mention: ${if_mention}`);
    core.debug(`text: ${text}`);
    core.debug(`username: ${username}`);
    core.debug(`icon_emoji: ${icon_emoji}`);
    core.debug(`icon_url: ${icon_url}`);
    core.debug(`channel: ${channel}`);
    core.debug(`custom_payload: ${custom_payload}`);
    core.debug(`payload: ${payload}`);
    core.debug(`fields: ${fields}`);
    core.debug(`job_name: ${job_name}`);
    core.debug(`success_message: ${success_message}`);
    core.debug(`cancelled_message: ${cancelled_message}`);
    core.debug(`failure_message: ${failure_message}`);
    core.debug(`github_base_url: ${github_base_url}`);

    const client = new Client(
      {
        status,
        mention,
        author_name,
        if_mention,
        username,
        icon_emoji,
        icon_url,
        channel,
        fields,
        job_name,
        success_message,
        cancelled_message,
        failure_message,
      },
      github_token,
      github_base_url,
      process.env.SLACK_WEBHOOK_URL,
    );

    switch (status) {
      case Success:
      case Failure:
      case Cancelled:
        await client.send(await client.prepare(text));
        break;
      case Custom:
        await client.send(await client.custom(custom_payload));
        break;
      default:
        throw new Error(
          'You can specify success or failure or cancelled or custom',
        );
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

run();
