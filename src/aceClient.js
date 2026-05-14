export async function runAceChatCompletion(config) {
  if (!config.aceDataApiToken) {
    return {
      ok: false,
      skipped: true,
      reason: 'ACE_DATA_API_TOKEN is not set',
    };
  }

  const response = await fetch('https://api.acedata.cloud/v1/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${config.aceDataApiToken}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: 'Return one short sentence: Solana signal agent live check passed.',
        },
      ],
      max_tokens: 30,
    }),
  });

  const data = await response.json().catch(() => ({}));

  return {
    ok: response.ok,
    status: response.status,
    model: data.model || 'gpt-4o-mini',
    content: data.choices?.[0]?.message?.content || data.message || data.detail || null,
    usage: data.usage || null,
  };
}

export async function previewAceX402Requirement() {
  const response = await fetch('https://api.acedata.cloud/v1/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: 'Say hi in 3 words',
        },
      ],
      max_tokens: 10,
    }),
  });

  const data = await response.json().catch(() => ({}));

  return {
    status: response.status,
    x402Version: data.x402Version || null,
    accepts: Array.isArray(data.accepts)
      ? data.accepts.map((item) => ({
          network: item.network,
          scheme: item.scheme,
          maxAmountRequired: item.maxAmountRequired,
          resource: item.resource,
          asset: item.asset,
          payTo: item.payTo,
        }))
      : [],
  };
}
