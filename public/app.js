const workflow = document.querySelector('#workflow');
const services = document.querySelector('#services');
const tokens = document.querySelector('#tokens');
const payments = document.querySelector('#payments');
const button = document.querySelector('#run-demo');

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
    const data = await response.json();
    render(data.report);
  } finally {
    button.disabled = false;
    button.textContent = 'Run dry-run workflow';
  }
}

button.addEventListener('click', run);
run();
