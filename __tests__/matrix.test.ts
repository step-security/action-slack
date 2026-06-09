process.env.GITHUB_RUN_ID = '2';
process.env.MATRIX_CONTEXT = '{"os": "ubuntu-18.04"}';

import {
  gitHubToken,
  gitHubBaseUrl,
  newWith,
  setupMockCommit,
  setupMockJobs,
  successMsg,
  webhookUrl,
} from './helper';
import { Client, With, Success } from '../src/client';

beforeAll(() => {
  setupMockCommit(process.env.GITHUB_SHA as string);
  setupMockJobs(
    process.env.GITHUB_RUN_ID as string,
    'actions.matrix-runs.jobs',
  );
});

describe('MATRIX_CONTEXT', () => {
  beforeEach(() => {
    process.env.GITHUB_REPOSITORY = 'step-security/action-slack';
    process.env.GITHUB_EVENT_NAME = 'push';
    const github = require('@actions/github');
    github.context.payload = {};
  });

  it('runs in matrix', async () => {
    const withParams: With = {
      ...newWith(),
      status: Success,
      fields: 'job,took',
    };
    const client = new Client(
      withParams,
      gitHubToken,
      gitHubBaseUrl,
      webhookUrl,
    );
    expect(await client.prepare('')).toStrictEqual({
      text: successMsg,
      attachments: [
        {
          author_name: '',
          color: 'good',
          fields: [
            {
              short: true,
              title: 'job',
              value:
                '<https://github.com/step-security/action-slack/runs/762195612|notification (ubuntu-18.04)>',
            },
            { short: true, title: 'took', value: '1 hour 1 min 1 sec' },
          ],
        },
      ],
      username: '',
      icon_emoji: '',
      icon_url: '',
      channel: '',
    });
  });
});
