import { RepoManager } from '../repoManager'
import { Repo } from './repo'

export interface Config {
  port?: number
  repoManager: RepoManagerConfig
}

export interface RepoManagerConfig {
  /** auto update interval second */
  interval: number
  repos: ConfigRepo[]
  presets: {
    [name: string]: (rm: RepoManager) => Repo
  }
}

export interface ConfigRepo {
  name: string
  url: string
  branch?: string
}
