# OOBE Ace Signal Agent

OOBE Ace Signal Agent is an autonomous Solana workflow demo built for the OOBE × Ace Data Cloud bounty.

The agent starts from a scheduled trigger, discovers SAP-compatible service requirements, selects three Ace Data Cloud capabilities, traces x402 payment requirements, and produces a structured signal report without manual steps.

## What it demonstrates

- SAP-style tool discovery and selection
- Synapse Sentinel included in the discovery plan
- Three Ace Data Cloud service categories:
  - `/openai/chat/completions` for reasoning
  - `/search/web` for public context
  - `/images/generate` for report visuals
- x402 payment trace generation through the Ace Data Cloud facilitator
- Dry-run mode for reviewers and live-mode hooks for funded-wallet execution

## Run locally

```bash
npm run demo
```

Start the demo UI:

```bash
npm run serve
```

Open `http://localhost:5180`.

## Live mode

Copy `.env.example` to `.env`, then add the required Synapse, Ace Data Cloud, and wallet values.

```bash
npm run live
```

Live mode is designed for a registered SAP agent and a funded wallet that can sign x402 payments. Dry-run mode does not spend funds and is safe for code review.

## Live Ace Data Cloud check

The live integration path calls Ace Data Cloud's OpenAI-compatible endpoint when `ACE_DATA_API_TOKEN` is set.

Verified call:

- Endpoint: `https://api.acedata.cloud/v1/chat/completions`
- Model: `gpt-4o-mini`
- Result: `Solana signal agent live check passed.`
- Usage: 28 total tokens

## Bounty category

This project targets the Ace Data Cloud Usage category. The workflow is organized around three distinct Ace Data Cloud services and a clear x402 payment trace.

## Links

- OOBE Protocol: https://www.oobeprotocol.ai/
- SAP Explorer: https://explorer.oobeprotocol.ai/
- Ace Data Cloud: https://platform.acedata.cloud
- x402 client: https://github.com/AceDataCloud/X402Client
