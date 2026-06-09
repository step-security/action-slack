import { MockAgent, setGlobalDispatcher } from 'undici';

const mockAgent = new MockAgent();
mockAgent.disableNetConnect();
setGlobalDispatcher(mockAgent);

// Patch undici.Agent and undici.ProxyAgent so @actions/github v6 routes through MockAgent
// eslint-disable-next-line @typescript-eslint/no-require-imports
const undici = require('undici');
undici.Agent = function () { return mockAgent; };
undici.ProxyAgent = function () { return mockAgent; };

(global as any).__undiciMockAgent = mockAgent;
