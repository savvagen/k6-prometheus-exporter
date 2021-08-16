# k6_prometheus_exporter
Simple prometheus exporter for k6 metrics exposed by [k6-rest-api](https://k6.io/docs/misc/k6-rest-api/)

```
Compatible just for HTTP protocol Metrics
```

Metrics are available by path: `http://<host>:9091/metrics`

## Run k6_exporter with Docker

Run DEMO using command `docker-compose up -d`
``` 
It will start simple json-server, K6 test, k6_exporter, prometheus and grafana
```
Watch available services:
* k6 server: `http://localhost:6565/v1/metrics`
* k6_node exporter metrics: `http://localhost:9091/metrics`
* Check if metrics are available on Prometheus: `http://localhost:9090/graph?g0.range_input=1h&g0.expr=k6_exporter_http_reqs&g0.tab=1`

#### Requirements:
* Need to K6 test with server exposed on port: `6565`


1. With commandline:
``` 
docker run -p 9091:9091 --network host -e "METRICS_PORT=9091" -e "COLLECT_INTERVAL=10" -e "K6_SERVER=http://127.0.0.1:6565" -i savvagenchevskiy/k6-exporter:latest
```
2. Run k6_exporter and prometheus with `docker-compose`:
```
  k6_exporter:
    image: savvagenchevskiy/k6-exporter:latest
    container_name: k6_exporter
    networks: 
      - k6
    #network_mode: host
    ports:
      - 9091:9091
    environment:
      - METRICS_PORT=9091
      - COLLECT_INTERVAL=10
      - K6_SERVER=http://k6:6565
    depends_on: 
      - k6
```
Watch full example in `docker-compose.yml` file

## Configure Prometheus
`proimetheus.yml` config:
``` 
  - job_name: k6_exporter
    scrape_interval: 5s
    static_configs:
      - targets: ['k6_exporter:9091']
```


## Exporter Configurations
Environment Variables:

Name | Description | Default
----|----|----|
`METRICS_PORT` | Exposed port for `/metrics`| 9091 |
`COLLECT_INTERVAL` | Metrics collection interval (in seconds) | 10 sec. |
`K6_SERVER` | K6 Test Server exposed by K6 framework. This address can be set with k6 command line flag: `k6 <arguments> --address 127.0.0.1:6565` | Default address is: `http://localhost:6565` |




## Exported Metrics

### Statistics:
Name | Description
----|----|
`k6_exporter_vus` | Current number of active virtual users (from K6 `/api/v1/status`) |
`k6_exporter_http_reqs` | How many HTTP requests has k6 generated, in total |
`k6_exporter_data_received` | The amount of received data. Trend (max, min, avg, med, p90, p95) |
`k6_exporter_data_sent` | The amount of data sent. Trend (max, min, avg, med, p90, p95) |
`k6_exporter_iterations` | The aggregate number of times the VUs in the test have executed the JS script |
`k6_exporter_checks` | The rate of successful checks |
`k6_exporter_http_req_failed` | percentage - rate of failed http requests |
`k6_exporter_vus_max` | Max possible number of virtual users (VU resources are pre-allocated, to ensure performance will not be affected when scaling up the load level)|
`k6_exporter_group_duration` | K6-group duration trend (max, min, avg, med, p90, p95) |
`k6_exporter_http_req_connecting` | Time spent establishing TCP connection to the remote host (max, min, avg, med, p90, p95) |
`k6_exporter_http_req_duration` | Total time for the request. It's equal to http_req_sending + http_req_waiting + http_req_receiving (i.e. how long did the remote server take to process the request and respond, without the initial DNS lookup/connection times). (resp. time) trend (max, min, avg, med, p90, p95) |
`k6_exporter_http_req_sending` | Time spent sending data to the remote host. (max, min, avg, med, p90, p95) |
`k6_exporter_http_req_tls_handshaking` | Time spent handshaking TLS session with remote host (max, min, avg, med, p90, p95) |
`k6_exporter_http_req_waiting` | Time spent waiting for response from remote host (a.k.a. \"time to first byte\", or \"TTFB\").  (max, min, avg, med, p90, p95) |
`k6_exporter_http_req_blocked` | Time spent blocked (waiting for a free TCP connection slot) before initiating the request. (max, min, avg, med, p90, p95) |
`k6_exporter_checks_passes` | Passed checks listed by k6-groups |
`k6_exporter_checks_fails` | Failed checks listed by k6-groups |
