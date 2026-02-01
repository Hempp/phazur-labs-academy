#!/bin/bash
export NEXT_TELEMETRY_DISABLED=1
export NODE_OPTIONS="--dns-result-order=ipv4first"
npm run dev
