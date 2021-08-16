# k6_prometheus_exporter
Simple prometheus exporter for k6 metrics exposed by [k6-rest-api](https://k6.io/docs/misc/k6-rest-api/)

## Run k6 exporter with Docker

1. With commandline:
``` 
docker run -p 9091:9091 --network host -e "METRICS_PORT=9091" -e "COLLECT_INTERVAL=10" -e "K6_SERVER=http://127.0.0.1:6565" -i savvagenchevskiy/k6-exporter:latest
```
2. Run with `docker-compose`:
```

  k6_exporter:
    image: savvagenchevskiy/k6-exporter:latest
    build:
      context: .
      dockerfile: Dockerfile
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
  
  prometheus:
    image: prom/prometheus:v2.22.0
    container_name: prometheus
    restart: always
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=30d'
    volumes:
      - ./metrics/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro
    ports:
      - 9090:9090
    networks: 
      - k6

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
Name | Type | Description | Labels
----|----|----|----|
`nginxexporter_build_info` | Gauge | Shows the exporter build information. | `gitCommit`, `version` |
`nginx_up` | Gauge | Shows the status of the last metric scrape: `1` for a successful scrape and `0` for a failed one | [] |
