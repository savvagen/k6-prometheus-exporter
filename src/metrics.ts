import { Gauge } from 'prom-client'

export const k6_exporter_hello_world = new Gauge({
  name: 'k6_exporter_hello_world',
  help: 'Hello World Metrics',
  labelNames: ['type', 'name'],
})

// Status

export const k6_exporter_vus = new Gauge({
  name: 'k6_exporter_vus',
  help: 'K6 VUs Number',
  labelNames: ['stopped', 'running', 'sample', 'server'],
})

// Metrics


// 1. Counters

export const k6_exporter_http_reqs = new Gauge({
  name: 'k6_exporter_http_reqs',
  help: 'K6 http reqs',
  labelNames: ['type', 'sample', 'server'],
})

export const k6_exporter_data_sent = new Gauge({
  name: 'k6_exporter_data_sent',
  help: 'K6 http data sent',
  labelNames: ['type', 'sample', 'server'],
})

export const k6_exporter_data_received = new Gauge({
  name: 'k6_exporter_data_received',
  help: 'K6 http data received count',
  labelNames: ['type', 'sample', 'server'],
})

export const k6_exporter_iterations = new Gauge({
  name: 'k6_exporter_iterations',
  help: 'K6 iter',
  labelNames: ['type', 'sample', 'server'],
})


// 2. Rate

export const k6_exporter_checks = new Gauge({
  name: 'k6_exporter_checks',
  help: 'K6 checks rate',
  labelNames: ['type', 'sample', 'server'],
})

export const k6_exporter_http_req_failed = new Gauge({
  name: 'k6_exporter_http_req_failed',
  help: 'K6 failed http reqs rate',
  labelNames: ['type', 'sample', 'server'],
})

// 3. Gauge

export const k6_exporter_vus_max = new Gauge({
  name: 'k6_exporter_vus_max',
  help: 'K6 vus max value',
  labelNames: ['type', 'sample', 'server'],
})

// // 4. Trends

export const k6_exporter_http_req_connecting = new Gauge({
  name: 'k6_exporter_http_req_connecting',
  help: 'K6 http reqs connections',
  labelNames: ['type', 'value', 'server'],
})

export const k6_exporter_http_req_sending = new Gauge({
  name: 'k6_exporter_http_req_sending',
  help: 'K6 http reqs reqs sending',
  labelNames: ['type', 'sample', 'server'],
})

export const k6_exporter_group_duration = new Gauge({
  name: 'k6_exporter_group_duration',
  help: 'Test',
  labelNames: ['type', 'sample', 'server'],
})

export const k6_exporter_http_req_duration = new Gauge({
  name: 'k6_exporter_http_req_duration',
  help: 'Test',
  labelNames: ['type', 'sample', 'server'],
})

export const k6_exporter_http_req_tls_handshaking = new Gauge({
  name: 'k6_exporter_http_req_tls_handshaking',
  help: 'Test',
  labelNames: ['type', 'sample', 'server'],
})

export const k6_exporter_http_req_waiting = new Gauge({
  name: 'k6_exporter_http_req_waiting',
  help: 'Test',
  labelNames: ['type', 'value', 'server'],
})

export const k6_exporter_http_req_blocked = new Gauge({
  name: 'k6_exporter_http_req_blocked',
  help: 'Test',
  labelNames: ['type', 'sample', 'server'],
})


// groups

export const k6_exporter_checks_passes = new Gauge({
  name: 'k6_exporter_checks_passes',
  help: `Checks passed`,
  labelNames: ['name', 'path', 'group', 'server']
})

export const k6_exporter_checks_fails = new Gauge({
  name: 'k6_exporter_checks_fails',
  help: `Checks failed`,
  labelNames: ['name', 'path', 'group', 'server']
})
