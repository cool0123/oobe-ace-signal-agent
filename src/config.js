export function loadConfig(argv = process.argv.slice(2), env = process.env) {
  const modeIndex = argv.indexOf('--mode');
  const mode = modeIndex >= 0 ? argv[modeIndex + 1] : env.AGENT_MODE || 'dry-run';

  return {
    mode,
    json: argv.includes('--json'),
    publicAgentUrl: env.PUBLIC_AGENT_URL || 'http://localhost:5180',
    synapseRpcUrl: env.SYNAPSE_RPC_URL || '',
    synapseApiKey: env.SYNAPSE_API_KEY || '',
    aceDataApiToken: env.ACE_DATA_API_TOKEN || '',
    aceX402Network: env.ACE_X402_NETWORK || 'solana',
    hasWallet: Boolean(env.SOLANA_WALLET_PRIVATE_KEY || env.EVM_PRIVATE_KEY),
  };
}
