import express from 'express'
import promClient from 'prom-client'
import { collectK6Metrics } from './data.fetcher'

// const prefix = 'k6_exporter_';
// promClient.collectDefaultMetrics({ prefix });

const COLLECT_INTERVAL: number = !isNaN(Number(process.env.COLLECT_INTERVAL)) ? Number(process.env.COLLECT_INTERVAL): 5 // Default => 5 sec.
const METRICS_PORT: number = !isNaN(Number(process.env.METRICS_PORT)) ? Number(process.env.METRICS_PORT): 9091

console.log("COLLECT_INTERVAL: " + COLLECT_INTERVAL)
console.log("METRICS_PORT: " + COLLECT_INTERVAL)

console.log(
    `Hello. Metrics from K6 will be collected every ${COLLECT_INTERVAL} sec. \nRecommended prometheus configurations:
    ================
    prometheus.yml
    ================ 
    - job_name: k6_exporter
      scrape_interval: ${COLLECT_INTERVAL}s
      static_configs:
        - targets:
          - k6_exporter:${METRICS_PORT}
    ================
    `
)

setInterval(() => {
    collectK6Metrics()
}, COLLECT_INTERVAL * 1000)

collectK6Metrics()

const metricServer = express()

metricServer.get('/metrics', (req, res) => {
    console.log('Scraped')
    promClient.register.metrics().then(metrics => {
        res.send(metrics)
    })
})


metricServer.listen(METRICS_PORT, () =>
    console.log(`🚨 K6 Exporter is listening on port ${METRICS_PORT} /metrics`)
)
