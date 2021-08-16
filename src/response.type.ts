export type MetricsResponse = {
  data: Metric[]
}

export type Metric = {
  type: string,
  id: string,
  attributes: {
    type: string,
    contains: string,
    tainted: boolean,
    sample: {
      // Trend Metrics
      avg: number,
      max: number,
      med: number,
      min: number,
      "p(90)": number,
      "p(95)": number,
      // Rate Metrics
      rate: number,
      // Counter Metrics
      count: number,
      // gauge Metrics
      value: number,
    }
  }
}

export type StatusResponse = {
  data: {
    type: string,
    id: string,
    attributes: {
      status: number,
      paused: boolean,
      vus: number,
      "vus-max": number,
      stopped: boolean,
      running: boolean,
      tainted: boolean
    }
  }
}

export type GroupsResponse = {
  data: Group[]
}

export type Group = {
  "type": string,
  "id": string,
  "attributes": {
    "path": string,
    "name": string,
    "checks": Check[]
  },
  "relationships": {
    "groups": {
      "data": Group[]
    },
    "parent": {
      "data": Group[]
    }
  }
}

export type Check = {
  "id": string,
  "path": string,
  "name": string,
  "passes": number,
  "fails": number
}