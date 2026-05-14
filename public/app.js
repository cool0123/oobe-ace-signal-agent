const workflow = document.querySelector('#workflow');
const services = document.querySelector('#services');
const tokens = document.querySelector('#tokens');
const payments = document.querySelector('#payments');
const button = document.querySelector('#run-demo');

const fallbackReport = {
  workflow: [
    'Trigger scheduled Solana signal scan',
    'Discover SAP-compatible services and Sentinel context',
    'Select three Ace Data Cloud services',
    'Preview or sign x402 payment envelopes',
    'Execute analysis workflow',
    'Publish structured signal report',
  ],
  selectedServices: [
    {
      id: 'ace.openai.chat.completions',
      reason: 'Classify raw market and account signals into an action plan.',
    },
    {
      id: 'ace.search.web',
      reason: 'Collect public context about protocol news before executing a signal.',
    },
    {
      id: 'ace.images.generate',
      reason: 'Generate a compact visual summary card for the final signal report.',
    },
  ],
  scoredTokens: [
    { symbol: 'SOL', liquidityUsd: 184000000, volume24hUsd: 980000000, agentScore: 95 },
    { symbol: 'JUP', liquidityUsd: 42000000, volume24hUsd: 122000000, agentScore: 29 },
    { symbol: 'WIF', liquidityUsd: 31000000, volume24hUsd: 89000000, agentScore: 26 },
  ],
  paymentTraces: [
    {
      serviceId: 'ace.openai.chat.completions',
      paymentProtocol: 'x402',
      network: 'solana',
      status: 'dry_run_preview',
      maxAmountRequired: '75000',
    },
    {
      serviceId: 'ace.search.web',
      paymentProtocol: 'x402',
      network: 'solana',
      status: 'dry_run_preview',
      maxAmountRequired: '86000',
    },
    {
      serviceId: 'ace.images.generate',
      paymentProtocol: 'x402',
      network: 'solana',
      status: 'dry_run_preview',
      maxAmountRequired: '97000',
    },
  ],
};

function card(title, body) {
  const node = document.createElement('div');
  node.className = 'card';
  node.innerHTML = `<strong>${title}</strong><p>${body}</p>`;
  return node;
}

function render(report) {
  workflow.innerHTML = '';
  services.innerHTML = '';
  tokens.innerHTML = '';
  payments.innerHTML = '';

  report.workflow.forEach((step) => {
    const li = document.createElement('li');
    li.textContent = step;
    workflow.appendChild(li);
  });

  report.selectedServices.forEach((service) => {
    services.appendChild(card(service.id, service.reason));
  });

  report.scoredTokens.forEach((token) => {
    tokens.appendChild(card(token.symbol, `Score ${token.agentScore}/100 · liquidity $${token.liquidityUsd.toLocaleString()} · 24h volume $${token.volume24hUsd.toLocaleString()}`));
  });

  report.paymentTraces.forEach((trace) => {
    payments.appendChild(card(trace.serviceId, `${trace.paymentProtocol} on ${trace.network} · ${trace.status} · ${trace.maxAmountRequired} micro-USD preview`));
  });
}

async function run() {
  button.disabled = true;
  button.textContent = 'Running...';
  try {
    const response = await fetch('/api/run?mode=dry-run');
    if (!response.ok) {
      throw new Error('Local API unavailable');
    }
    const data = await response.json();
    render(data.report);
  } catch {
    render(fallbackReport);
  } finally {
    button.disabled = false;
    button.textContent = 'Run dry-run workflow';
  }
}

button.addEventListener('click', run);
run();
