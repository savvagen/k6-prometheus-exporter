import {
    GroupsResponse,
    MetricsResponse,
    StatusResponse
} from './response.type'
import Axios from 'axios'
import {
    k6_exporter_hello_world,
    // status
    k6_exporter_vus,
    // counters
    k6_exporter_http_reqs,
    k6_exporter_data_received,
    k6_exporter_data_sent,
    k6_exporter_iterations,
    // rates
    k6_exporter_checks,
    k6_exporter_http_req_failed,
    // gauge
    k6_exporter_vus_max,
    // trends
    k6_exporter_group_duration,
    k6_exporter_http_req_connecting,
    k6_exporter_http_req_duration,
    k6_exporter_http_req_sending,
    k6_exporter_http_req_tls_handshaking,
    k6_exporter_http_req_waiting,
    k6_exporter_http_req_blocked,
    // groups
    k6_exporter_checks_passes,
    k6_exporter_checks_fails,
} from './metrics'
import {Gauge} from "prom-client";

const k6Server = process.env.K6_SERVER !== undefined ? process.env.K6_SERVER : "http://localhost:6565"

export async function fetchK6Metrics(): Promise<MetricsResponse | undefined> {
  try {
      const result = await Axios({
          url: `${k6Server}/v1/metrics`,
      })
      if (result.status === 200) {
          return result.data as MetricsResponse
      } else {
          return undefined
      }
  } catch (e){
      if (String(e).includes('Error: connect ECONNREFUSED'))
      throw Error(`ConnectionError: K6 Server ${k6Server} is unavailable.`)
  }
}

export async function fetchK6Status(): Promise<StatusResponse | undefined> {
    try {
        const result = await Axios({
            url: `${k6Server}/v1/status`,
        })
        if (result.status === 200) {
            return result.data as StatusResponse
        } else {
            return undefined
        }
    } catch (e){
        if (String(e).includes('Error: connect ECONNREFUSED'))
            throw Error(`ConnectionError: K6 Server ${k6Server} is unavailable.`)
    }
}

export async function fetchK6Groups(): Promise<GroupsResponse | undefined> {
    try {
        const result = await Axios({
            url: `${k6Server}/v1/groups`,
        })
        if (result.status === 200) {
            return result.data as GroupsResponse
        } else {
            return undefined
        }
    } catch (e){
        if (String(e).includes('Error: connect ECONNREFUSED'))
            throw Error(`ConnectionError: K6 Server ${k6Server} is unavailable.`)
    }
}

export async function collectK6Metrics() {
    const metrics = await fetchK6Metrics()
    const status = await fetchK6Status()
    const groups = await fetchK6Groups()

    if (status){
        k6_exporter_vus.labels(`${status.data.attributes.stopped}`, `${status.data.attributes.running}`, 'vus', k6Server).set(status.data.attributes.vus)
        k6_exporter_vus.labels(`${status.data.attributes.stopped}`, `${status.data.attributes.running}`, 'vus-max', k6Server).set(status.data.attributes["vus-max"])
    }

    if (metrics) {
        // counters
        let http_reqs = metrics.data.filter(m=> m.id == "http_reqs")[0]
        k6_exporter_http_reqs.labels(http_reqs.attributes.type, 'count', k6Server).set(http_reqs.attributes.sample.count)
        k6_exporter_http_reqs.labels(http_reqs.attributes.type, 'rate', k6Server).set(http_reqs.attributes.sample.rate)

        let data_received = metrics.data.filter(m=> m.id == "data_received")[0]
        k6_exporter_data_received.labels(data_received.attributes.type, 'count', k6Server).set(data_received.attributes.sample.count)
        k6_exporter_data_received.labels(data_received.attributes.type, 'rate', k6Server).set(data_received.attributes.sample.rate)

        let data_sent = metrics.data.filter(m=> m.id == "data_sent")[0]
        k6_exporter_data_sent.labels(data_sent.attributes.type, 'count', k6Server).set(data_sent.attributes.sample.count)
        k6_exporter_data_sent.labels(data_sent.attributes.type, 'rate', k6Server).set(data_sent.attributes.sample.rate)

        let iterations = metrics.data.filter(m=> m.id == "iterations")[0]
        k6_exporter_iterations.labels(iterations.attributes.type, 'count', k6Server).set(iterations.attributes.sample.count)
        k6_exporter_iterations.labels(iterations.attributes.type, 'rate', k6Server).set(iterations.attributes.sample.rate)

        // rates
        let checks = metrics.data.filter(m=> m.id == "checks")[0]
        k6_exporter_checks.labels(checks.attributes.type, 'rate', k6Server).set(checks.attributes.sample.rate)

        let http_req_failed = metrics.data.filter(m=> m.id == "http_req_failed")[0]
        k6_exporter_http_req_failed.labels(http_req_failed.attributes.type, 'rate', k6Server).set(http_req_failed.attributes.sample.rate)

        // gauges
        let vus_max = metrics.data.filter(m=> m.id == "vus_max")[0]
        k6_exporter_vus_max.labels(vus_max.attributes.type, 'value', k6Server).set(vus_max.attributes.sample.value)

        // trends
        let http_req_blocked = metrics.data.filter(m=> m.id == "http_req_blocked")[0]
        if (http_req_blocked){
            k6_exporter_http_req_blocked.labels(http_req_blocked.attributes.type, 'avg', k6Server).set(http_req_blocked.attributes.sample.avg)
            k6_exporter_http_req_blocked.labels(http_req_blocked.attributes.type, 'max', k6Server).set(http_req_blocked.attributes.sample.max)
            k6_exporter_http_req_blocked.labels(http_req_blocked.attributes.type, 'med', k6Server).set(http_req_blocked.attributes.sample.med)
            k6_exporter_http_req_blocked.labels(http_req_blocked.attributes.type, 'min', k6Server).set(http_req_blocked.attributes.sample.min)
            k6_exporter_http_req_blocked.labels(http_req_blocked.attributes.type, 'p90', k6Server).set(http_req_blocked.attributes.sample["p(90)"])
            k6_exporter_http_req_blocked.labels(http_req_blocked.attributes.type, 'p95', k6Server).set(http_req_blocked.attributes.sample["p(95)"])
        }

        let http_req_tls_handshaking = metrics.data.filter(m=> m.id == "http_req_tls_handshaking")[0]
        if (http_req_tls_handshaking){
            k6_exporter_http_req_tls_handshaking.labels(http_req_tls_handshaking.attributes.type, 'avg', k6Server).set(http_req_tls_handshaking.attributes.sample.avg)
            k6_exporter_http_req_tls_handshaking.labels(http_req_tls_handshaking.attributes.type, 'max', k6Server).set(http_req_tls_handshaking.attributes.sample.max)
            k6_exporter_http_req_tls_handshaking.labels(http_req_tls_handshaking.attributes.type, 'med', k6Server).set(http_req_tls_handshaking.attributes.sample.med)
            k6_exporter_http_req_tls_handshaking.labels(http_req_tls_handshaking.attributes.type, 'min', k6Server).set(http_req_tls_handshaking.attributes.sample.min)
            k6_exporter_http_req_tls_handshaking.labels(http_req_tls_handshaking.attributes.type, 'p90', k6Server).set(http_req_tls_handshaking.attributes.sample["p(90)"])
            k6_exporter_http_req_tls_handshaking.labels(http_req_tls_handshaking.attributes.type, 'p95', k6Server).set(http_req_tls_handshaking.attributes.sample["p(95)"])
        }

        let group_duration = metrics.data.filter(m=> m.id == "group_duration")[0]
        if (group_duration){
            k6_exporter_group_duration.labels(group_duration.attributes.type, 'avg', k6Server).set(group_duration.attributes.sample.avg)
            k6_exporter_group_duration.labels(group_duration.attributes.type, 'max', k6Server).set(group_duration.attributes.sample.max)
            k6_exporter_group_duration.labels(group_duration.attributes.type, 'med', k6Server).set(group_duration.attributes.sample.med)
            k6_exporter_group_duration.labels(group_duration.attributes.type, 'min', k6Server).set(group_duration.attributes.sample.min)
            k6_exporter_group_duration.labels(group_duration.attributes.type, 'p90', k6Server).set(group_duration.attributes.sample["p(90)"])
            k6_exporter_group_duration.labels(group_duration.attributes.type, 'p95', k6Server).set(group_duration.attributes.sample["p(95)"])
        }

        let http_req_duration = metrics.data.filter(m=> m.id == "http_req_duration")[0]
        if (http_req_duration){
            k6_exporter_http_req_duration.labels(http_req_duration.attributes.type, 'avg', k6Server).set(http_req_duration.attributes.sample.avg)
            k6_exporter_http_req_duration.labels(http_req_duration.attributes.type, 'max', k6Server).set(http_req_duration.attributes.sample.max)
            k6_exporter_http_req_duration.labels(http_req_duration.attributes.type, 'med', k6Server).set(http_req_duration.attributes.sample.med)
            k6_exporter_http_req_duration.labels(http_req_duration.attributes.type, 'min', k6Server).set(http_req_duration.attributes.sample.min)
            k6_exporter_http_req_duration.labels(http_req_duration.attributes.type, 'p90', k6Server).set(http_req_duration.attributes.sample["p(90)"])
            k6_exporter_http_req_duration.labels(http_req_duration.attributes.type, 'p95', k6Server).set(http_req_duration.attributes.sample["p(95)"])
        }

        let http_req_connecting = metrics.data.filter(m=> m.id == "http_req_connecting")[0]
        if (http_req_connecting){
            k6_exporter_http_req_connecting.labels(http_req_connecting.attributes.type, 'avg', k6Server).set(http_req_connecting.attributes.sample.avg)
            k6_exporter_http_req_connecting.labels(http_req_connecting.attributes.type, 'max', k6Server).set(http_req_connecting.attributes.sample.max)
            k6_exporter_http_req_connecting.labels(http_req_connecting.attributes.type, 'med', k6Server).set(http_req_connecting.attributes.sample.med)
            k6_exporter_http_req_connecting.labels(http_req_connecting.attributes.type, 'min', k6Server).set(http_req_connecting.attributes.sample.min)
            k6_exporter_http_req_connecting.labels(http_req_connecting.attributes.type, 'p90', k6Server).set(http_req_connecting.attributes.sample["p(90)"])
            k6_exporter_http_req_connecting.labels(http_req_connecting.attributes.type, 'p95', k6Server).set(http_req_connecting.attributes.sample["p(95)"])
        }

        let http_req_sending = metrics.data.filter(m=> m.id == "http_req_sending")[0]
        if (http_req_sending){
            k6_exporter_http_req_sending.labels(http_req_sending.attributes.type, 'avg', k6Server).set(http_req_sending.attributes.sample.avg)
            k6_exporter_http_req_sending.labels(http_req_sending.attributes.type, 'max', k6Server).set(http_req_sending.attributes.sample.max)
            k6_exporter_http_req_sending.labels(http_req_sending.attributes.type, 'med', k6Server).set(http_req_sending.attributes.sample.med)
            k6_exporter_http_req_sending.labels(http_req_sending.attributes.type, 'min', k6Server).set(http_req_sending.attributes.sample.min)
            k6_exporter_http_req_sending.labels(http_req_sending.attributes.type, 'p90', k6Server).set(http_req_sending.attributes.sample["p(90)"])
            k6_exporter_http_req_sending.labels(http_req_sending.attributes.type, 'p95', k6Server).set(http_req_sending.attributes.sample["p(95)"])
        }

        let http_req_waiting = metrics.data.filter(m=> m.id == "http_req_waiting")[0]
        if (http_req_waiting){
            k6_exporter_http_req_waiting.labels(http_req_waiting.attributes.type, 'avg', k6Server).set(http_req_waiting.attributes.sample.avg)
            k6_exporter_http_req_waiting.labels(http_req_waiting.attributes.type, 'max', k6Server).set(http_req_waiting.attributes.sample.max)
            k6_exporter_http_req_waiting.labels(http_req_waiting.attributes.type, 'med', k6Server).set(http_req_waiting.attributes.sample.med)
            k6_exporter_http_req_waiting.labels(http_req_waiting.attributes.type, 'min', k6Server).set(http_req_waiting.attributes.sample.min)
            k6_exporter_http_req_waiting.labels(http_req_waiting.attributes.type, 'p90', k6Server).set(http_req_waiting.attributes.sample["p(90)"])
            k6_exporter_http_req_waiting.labels(http_req_waiting.attributes.type, 'p95', k6Server).set(http_req_waiting.attributes.sample["p(95)"])
        }

        // Publish all metrics separately and publish custom metrics
        /*metrics.data.forEach((metric) => {
            try {
                if (metric.attributes.type == "counter"){
                    new Gauge({name: `k6_exporter_${metric.id}_count`, help: `Test Metric`, labelNames: ['type', 'server']})
                        .labels(metric.attributes.type, k6Server)
                        .set(metric.attributes.sample.count)
                    new Gauge({name: `k6_exporter_${metric.id}_rate`, help: `Test Metric`, labelNames: ['type', 'server']})
                        .labels(metric.attributes.type, k6Server)
                        .set(metric.attributes.sample.rate)

                } else if (metric.attributes.type == "trend"){
                    new Gauge({name: `k6_exporter_${metric.id}_avg`, help: `Metric`, labelNames: ['type', 'server']})
                        .labels(metric.attributes.type, k6Server).set(metric.attributes.sample.avg)
                    new Gauge({name: `k6_exporter_${metric.id}_max`, help: `Metric`, labelNames: ['type', 'server']})
                        .labels(metric.attributes.type, k6Server).set(metric.attributes.sample.max)
                    new Gauge({name: `k6_exporter_${metric.id}_med`, help: `Metric`, labelNames: ['type', 'server']})
                        .labels(metric.attributes.type, k6Server).set(metric.attributes.sample.med)
                    new Gauge({name: `k6_exporter_${metric.id}_min`, help: `Metric`, labelNames: ['type', 'server']})
                        .labels(metric.attributes.type, k6Server).set(metric.attributes.sample.min)
                    new Gauge({name: `k6_exporter_${metric.id}_p90`, help: `Metric`, labelNames: ['type', 'server']})
                        .labels(metric.attributes.type, k6Server).set(metric.attributes.sample["p(90)"])
                    new Gauge({name: `k6_exporter_${metric.id}_p95`, help: `Metric`, labelNames: ['type', 'server']})
                        .labels(metric.attributes.type, k6Server).set(metric.attributes.sample["p(95)"])

                } else if (metric.attributes.type == "rate"){
                    new Gauge({name: `k6_exporter_${metric.id}_rate`, help: `Metric`, labelNames: ['type', 'server']})
                        .labels(metric.attributes.type, k6Server)
                        .set(metric.attributes.sample.rate)

                } else if (metric.attributes.type == "gauge"){
                    new Gauge({name: `k6_exporter_${metric.id}_value`, help: `Metric`, labelNames: ['type', 'server']})
                        .labels(metric.attributes.type, k6Server)
                        .set(metric.attributes.sample.value)
                }
            } catch (e){}
      })*/
    }

    if (groups){
        groups.data.forEach((group) => {
            if (group.attributes.checks){
                group.attributes.checks.forEach((check) => {
                    k6_exporter_checks_passes.labels(check.name, check.path, group.attributes.name, k6Server).set(check.passes)
                    k6_exporter_checks_fails.labels(check.name, check.path, group.attributes.name, k6Server).set(check.fails)
                })
            }
        })
    }

    let randomValue = Math.floor(Math.random()*2+100)
    k6_exporter_hello_world.labels('hello', 'world').set(randomValue)

    console.log(`Metrics refreshed!`)
}

