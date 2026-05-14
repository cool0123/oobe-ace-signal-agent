import { loadConfig } from './config.js';
import { createRunLog } from './logger.js';
import { runSignalAgent } from './agent.js';

const config = loadConfig();
const log = createRunLog(config);
const report = await runSignalAgent(config, log);
const summary = log.summary({ report });

if (config.json) {
  console.log(JSON.stringify(summary, null, 2));
} else {
  console.log('\n=== Final Agent Report ===');
  console.log(JSON.stringify(report, null, 2));
}
