import { aceServices, sapDiscoveryPlan } from './services.js';
import { previewAceX402Requirement, runAceChatCompletion } from './aceClient.js';

const demoTokens = [
  { symbol: 'SOL', liquidityUsd: 184000000, volume24hUsd: 980000000, holderRisk: 'low' },
  { symbol: 'JUP', liquidityUsd: 42000000, volume24hUsd: 122000000, holderRisk: 'medium' },
  { symbol: 'WIF', liquidityUsd: 31000000, volume24hUsd: 89000000, holderRisk: 'medium' },
];

function scoreToken(token) {
  const liquidityScore = Math.min(40, Math.round(token.liquidityUsd / 5_000_000));
  const volumeScore = Math.min(35, Math.round(token.volume24hUsd / 30_000_000));
  const holderScore = token.holderRisk === 'low' ? 20 : token.holderRisk === 'medium' ? 12 : 5;
  return Math.min(100, liquidityScore + volumeScore + holderScore + 5);
}

function buildPaymentTrace(service, index, config) {
  const simulatedMicrousd = 75_000 + index * 11_000;
  return {
    serviceId: service.id,
    network: config.aceX402Network,
    endpoint: service.endpoint,
    paymentProtocol: 'x402',
    facilitator: 'https://facilitator.acedata.cloud',
    maxAmountRequired: String(simulatedMicrousd),
    status: config.mode === 'live' ? 'ready_for_signed_payment' : 'dry_run_preview',
  };
}

export async function runSignalAgent(config, log) {
  log.step('trigger.received', {
    trigger: 'scheduled-solana-signal-scan',
    autonomous: true,
    manualInputRequired: false,
  });

  log.step('sap.discovery.plan', sapDiscoveryPlan);

  const discoveredTools = aceServices.map((service, index) => ({
    rank: index + 1,
    id: service.id,
    endpoint: service.endpoint,
    category: service.category,
    selected: true,
    reason: service.purpose,
  }));

  log.step('sap.tools.selected', { tools: discoveredTools });

  const scoredTokens = demoTokens.map((token) => ({
    ...token,
    agentScore: scoreToken(token),
  }));

  const paymentTraces = aceServices.map((service, index) => buildPaymentTrace(service, index, config));

  for (const service of aceServices) {
    log.step('ace.service.execution', {
      serviceId: service.id,
      endpoint: service.endpoint,
      sampleInput: service.sampleInput,
      mode: config.mode,
    });
  }

  let liveAceResult = null;
  let x402Requirement = null;
  if (config.mode === 'live') {
    x402Requirement = await previewAceX402Requirement();
    log.step('ace.x402.requirement_preview', {
      status: x402Requirement.status,
      x402Version: x402Requirement.x402Version,
      accepts: x402Requirement.accepts,
    });

    liveAceResult = await runAceChatCompletion(config);
    log.step('ace.live.chat_completion', {
      ok: liveAceResult.ok,
      status: liveAceResult.status,
      model: liveAceResult.model,
      content: liveAceResult.content,
      usage: liveAceResult.usage,
      skipped: liveAceResult.skipped,
      reason: liveAceResult.reason,
    });
  }

  const report = {
    title: 'OOBE Ace Signal Agent Run',
    category: 'Ace Data Cloud Usage',
    workflow: [
      'Trigger scheduled Solana signal scan',
      'Discover SAP-compatible services and Sentinel context',
      'Select three Ace Data Cloud services',
      'Preview or sign x402 payment envelopes',
      'Execute analysis workflow',
      'Publish structured signal report',
    ],
    scoredTokens,
    paymentTraces,
    x402Requirement,
    liveAceResult,
    selectedServices: discoveredTools,
    nextLiveSteps: [
      'Register the agent on SAP mainnet with the public endpoint',
      'Connect a funded wallet for x402 payment signing',
      'Run live mode with Ace Data Cloud account credits or x402 USDC',
      'Attach transaction hashes and explorer agent URL to the Superteam submission',
    ],
  };

  log.step('report.ready', {
    tokenCount: scoredTokens.length,
    serviceCount: aceServices.length,
    paymentTraceCount: paymentTraces.length,
  });

  return report;
}
