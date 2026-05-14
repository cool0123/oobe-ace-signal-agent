export const aceServices = [
  {
    id: 'ace.openai.chat.completions',
    category: 'reasoning',
    endpoint: '/openai/chat/completions',
    purpose: 'Classify raw market and account signals into an action plan.',
    sampleInput: {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a Solana risk analyst.' },
        { role: 'user', content: 'Score BONK, JUP, and WIF liquidity risk.' },
      ],
      max_tokens: 120,
    },
  },
  {
    id: 'ace.search.web',
    category: 'context',
    endpoint: '/search/web',
    purpose: 'Collect public context about protocol news before executing a signal.',
    sampleInput: {
      query: 'Solana token liquidity news last 24 hours',
      limit: 5,
    },
  },
  {
    id: 'ace.images.generate',
    category: 'reporting',
    endpoint: '/images/generate',
    purpose: 'Generate a compact visual summary card for the final signal report.',
    sampleInput: {
      provider: 'nano-banana',
      prompt: 'A clean dashboard card summarizing Solana token risk signals',
    },
  },
];

export const sapDiscoveryPlan = {
  protocol: 'Synapse Agent Protocol',
  sentinelAgent: 'Ccr2yK3hLALU4p8oNRqrh4dGuvPJTth5KCLMio8cE1ph',
  requiredCapabilities: ['data', 'analytics', 'payment'],
  settlement: 'x402 via AceDataCloud facilitator, with SAP discovery and execution trace',
};
