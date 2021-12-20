export interface Config {
  interval: number
  repos: ConfigRepo[]
}

export interface ConfigRepo {
  name: string
  url: string
}
